"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // Check if user already exists in db with this UID
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // Check if there's a temporary account with this email
    const tempUserQuery = await db
      .collection("users")
      .where("email", "==", email)
      .where("temporaryAccount", "==", true)
      .get();

    if (!tempUserQuery.empty) {
      // Found a temporary account - update it instead of creating a new one
      const tempUserDoc = tempUserQuery.docs[0];

      // Update the temporary account with permanent user details
      await db.collection("users").doc(tempUserDoc.id).update({
        name,
        email,
        profileURL: "",
        temporaryAccount: false, // Convert to permanent account
        updatedAt: new Date().toISOString()
      });

      // Delete the new auth user that was created, as we'll keep using the temp account ID
      // This is needed to avoid having duplicate accounts
      try {
        await auth.deleteUser(uid);
      } catch (deleteError) {
        console.error("Error deleting duplicate auth user:", deleteError);
        // Continue anyway since the main update succeeded
      }

      return {
        success: true,
        message: "Your account has been activated successfully. Please sign in.",
      };
    }

    // No temporary account found, create a new permanent account
    await db.collection("users").doc(uid).set({
      name,
      email,
      role: UserRole.USER,
      profileURL: "",
      temporaryAccount: false,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.log("");

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

export async function getUserSession(): Promise<string | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  return sessionCookie;
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}


// Get user by id (for admin views and lookups)
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return null;
    return { id: userDoc.id, ...(userDoc.data() as Omit<User, "id">) } as User;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return null;
  }
}

export async function verificationUserSession(session: string): Promise<User | null> {
  if (!session) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true);
    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    return { ...userRecord.data(), id: userRecord.id } as User;
  } catch (error) {
    console.error("Error verifying user session:", error);
    return null;
  }
}
// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const userRecord = await db.collection("users").where("email", "==", email).get();
    if (userRecord.empty) return null;

    const userData = userRecord.docs[0].data();
    return {
      ...userData,
      id: userRecord.docs[0].id,
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Converts a temporary user account to a permanent one
 * This function is useful when a user tries to sign up with an email that was previously
 * used for a temporary account during an interview invitation
 */
export async function convertTemporaryUserToPermanent({
  email,
  name,
  uid,
}: {
  email: string;
  name: string;
  uid: string;
}): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    // Find temporary user with this email
    const tempUserQuery = await db
      .collection("users")
      .where("email", "==", email)
      .where("temporaryAccount", "==", true)
      .get();

    if (tempUserQuery.empty) {
      return {
        success: false,
        message: "No temporary account found for this email address.",
      };
    }

    const tempUserDoc = tempUserQuery.docs[0];
    const tempUserId = tempUserDoc.id;

    // Update the temporary account to make it permanent
    await db.collection("users").doc(tempUserId).update({
      name,
      temporaryAccount: false,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Temporary account successfully converted to permanent account.",
      userId: tempUserId,
    };
  } catch (error) {
    console.error("Error converting temporary user to permanent:", error);
    return {
      success: false,
      message: "Failed to convert temporary account to permanent account.",
    };
  }
}