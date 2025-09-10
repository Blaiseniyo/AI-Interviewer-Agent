import { db } from "@/firebase/admin";
import { withAdminAuthHandler } from "@/lib/middleware/auth.middleware";

export const GET = withAdminAuthHandler(async (request: Request, user: User) => {
    try {

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return Response.json({
                success: false,
                error: "Email parameter is required"
            }, { status: 400 });
        }

        // Search for users that match the email (using a startsWith approach to make it a prefix search)
        const usersSnapshot = await db.collection("users")
            .where("email", ">=", email)
            .where("email", "<=", email + "\uf8ff") // This is a trick for prefix search in Firestore
            .limit(10) // Limit results to avoid performance issues
            .get();

        if (usersSnapshot.empty) {
            return Response.json({
                success: true,
                data: []
            }, { status: 200 });
        }

        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return Response.json({
            success: true,
            data: users
        }, { status: 200 });
    } catch (error) {
        console.error("Error searching users:", error);
        return Response.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
});
