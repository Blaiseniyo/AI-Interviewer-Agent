import { db } from "@/firebase/admin";
// import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
    try {
        // Get current user to check if they have admin role
        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            return Response.json({
                success: false,
                error: "Unauthorized. Admin access required."
            }, { status: 403 });
        }

        const { type, role, level, questions, rubric } = await request.json();

        // Validate required fields
        if (!type || !role || !level || !questions || !rubric) {
            return Response.json({
                success: false,
                error: "Missing required fields"
            }, { status: 400 });
        }

        const interview = {
            role: role,
            type: type,
            level: level,
            questions: JSON.parse(questions),
            createdBy: user.id,
            coverImage: "",
            rubric: rubric,
            createdAt: new Date().toISOString(),
            isAdminCreated: true
        };

        const docRef = await db.collection("interviews").add(interview);

        return Response.json({
            success: true,
            data: { id: docRef.id, ...interview }
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating admin interview:", error);
        return Response.json({
            success: false,
            error: error
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Get current user to check if they have admin role
        const user = await getCurrentUser();

        if (!user || user.role !== "admin") {
            return Response.json({
                success: false,
                error: "Unauthorized. Admin access required."
            }, { status: 403 });
        }

        // Get all admin created interviews
        const interviews = await db
            .collection("interviews")
            .where("isAdminCreated", "==", true)
            .orderBy("createdAt", "desc")
            .get();

        const interviewsData = interviews.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return Response.json({
            success: true,
            data: interviewsData
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching admin interviews:", error);
        return Response.json({
            success: false,
            error: error
        }, { status: 500 });
    }
}
