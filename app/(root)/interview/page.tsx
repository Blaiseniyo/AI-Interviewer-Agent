import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="grid place-items-center pb-12 min-h-screen">
      <h3>Interview generation</h3>
        <Agent
          userName={user?.name!}
          userId={user?.id}
          type="generate"
        />
    </div>
  );
};

export default Page;
