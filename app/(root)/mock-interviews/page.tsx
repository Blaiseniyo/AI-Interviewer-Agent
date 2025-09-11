import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewsByUserId } from '@/lib/actions/general.action';
import React from 'react'

const page = async () => {
    const user = await getCurrentUser()
    const interviews = await getInterviewsByUserId(user?.id);


    console.log(interviews);
  return (
    <div>
        <h1 className='text-2xl font-bold py-2'>Mock Interviews</h1>
        <div className='interviews-section'>
        {interviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} role={interview.role} type={interview.type} techstack={interview.techstack} createdAt={interview.createdAt} />
            ))}
        </div>
    </div>
  )
}

export default page