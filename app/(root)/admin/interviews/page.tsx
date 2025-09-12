import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsCreatedByAdmin } from "@/lib/actions/general.action";

async function Interviews() {
  let interviews: Interview[] = [];
  const user = await getCurrentUser();
  try {
    if(user?.id) {
      const result = await getInterviewsCreatedByAdmin(user?.id);
      interviews = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error("Error fetching interviews:", error);
  }

  return (
    <>
      <section className="flex flex-col mx-6 gap-6 mt-8">
        <h2>Interviews</h2>
        <p>View all interviews you have created.</p>
        <div className="interviews-section">
          {Array.isArray(interviews) && interviews.length > 0 ? (
            interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id || ''}
                role={interview.role || ''}
                type={interview.type || ''}
                techstack={interview.techstack || []}
                createdAt={interview.createdAt || ''}
                isAdmin={true}
              />
            ))
          ) : (
            <p>No interviews found</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Interviews;
