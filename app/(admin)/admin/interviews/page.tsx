import InterviewCard from "@/components/InterviewCard";
import { getAllInterviews } from "@/lib/actions/general.action";

async function Interviews() {
  // Add try-catch for error handling during prerendering
  let interviews: any[] = [];
  try {
    const result = await getAllInterviews();
    interviews = Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching interviews:", error);
  }

  return (
    <>
      <section className="flex flex-col mx-6 gap-6 mt-8">
        <h2>Interviews</h2>
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
