import { db } from "@/firebase/admin";
import { withAdminAuthHandler } from "@/lib/middleware/auth.middleware";
import { getUserQuery } from "@/lib/actions/users.action";

export const GET = withAdminAuthHandler(async (request: Request, user: User) => {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const startAfterId = searchParams.get('startAfterId');

        // Initialize query
        let query: any = getUserQuery();

        // Apply email filter if provided
        if (email) {
            query = query
                .where("email", ">=", email)
                .where("email", "<=", email + "\uf8ff");
        }

        // Get total count for pagination
        const totalSnapshot = await query.count().get();
        const totalCount = totalSnapshot.data().count;
        const totalPages = Math.ceil(totalCount / limit);

        // Apply pagination - either cursor-based or page-based
        if (startAfterId) {
            // Cursor-based pagination
            const docSnapshot = await db.collection("users").doc(startAfterId).get();
            if (docSnapshot.exists) {
                query = query.startAfter(docSnapshot);
            }
        } else if (page > 1) {
            // Page-based pagination - skip documents based on page number
            const skipCount = (page - 1) * limit;

            // For Firestore, we need to use startAfter with an offset
            // This is less efficient for large offsets
            if (skipCount > 0) {
                const offsetSnapshot = await query.limit(skipCount).get();
                if (offsetSnapshot.docs.length > 0) {
                    const lastDocInOffset = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
                    query = query.startAfter(lastDocInOffset);
                }
            }
        }

        // Apply limit after determining the starting point
        query = query.limit(limit);
        const usersSnapshot = await query.get();

        // Extract user data
        const users = usersSnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Enhanced pagination metadata
        const pagination = {
            page,
            limit,
            totalPages,
            totalCount,
            hasMore: page < totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            nextStartAfterId: users.length > 0 ? users[users.length - 1].id : null
        };

        return Response.json({
            success: true,
            data: users,
            pagination
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return Response.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
});
