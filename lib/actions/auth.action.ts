"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { SignInParams, SignUpParams, User, UserRole } from "@/types";

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
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      role: UserRole.USER,
      profileURL: "",
      // resumeURL: "",
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

// Get redirect path based on user role
export async function getRedirectPath(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) return "/sign-in";

  return user.role === UserRole.ADMIN ? "/admin" : "/";
}


// Get user by id (for admin views and lookups)
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return null;
    return { id: userDoc.id, ...(userDoc.data() as Omit<User, "id">) } as User;
  } catch (error) {
    console.error("Error fetching user by id:", error);

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

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === UserRole.ADMIN;
}

export async function getCurrentUserWithRole() {
  return await getCurrentUser();
}