import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">

      <h3 className="self-start py-6">Interview generation</h3>
        <Agent
          userName={user?.name!}
          userId={user?.id}
          profileImage={user?.profileURL}
          type="generate"
        />
    </div>
  );
};

export default Page;
