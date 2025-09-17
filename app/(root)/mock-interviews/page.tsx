import React from 'react'

import Link from "next/link";
import Image from "next/image";

import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getMockInterviewsByUserId } from '@/lib/actions/general.action';

import { Button } from "@/components/ui/button";

const page = async () => {
  const user = await getCurrentUser()
  const interviews = await getMockInterviewsByUserId(user?.id);
  return (
    <div>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Create a Mock Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      <h1 className='text-2xl font-bold py-2'>Mock Interviews</h1>
      <div className='interviews-section'>
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} interviewId={interview.id} userId={user?.id} role={interview.role} type={interview.type} techstack={interview.techstack} createdAt={interview.createdAt} isMockInterview={true} />
        ))}
      </div>
    </div>
  )
}

export default page