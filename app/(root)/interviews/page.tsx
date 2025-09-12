// import InterviewCard from '@/components/InterviewCard'
import Image from 'next/image'
// import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { Link } from 'lucide-react'
import { apiGet } from '@/lib/api'
// import { getAllUserInvitations } from '@/lib/actions/userInvitations.action'
import React from 'react'
import InterviewCard from '@/components/InterviewCard'

const page = async () => {
  const user = await getCurrentUser()
  console.log(user?.id)
  const getInvitations = async (): Promise<{ id: string; interview: Interview }[]> => {
    try {
      const res = await apiGet<{ success: boolean; data: { id: string; interview: Interview }[] }>(
        '/api/user/invitations'
      )
      return res?.data ?? []
    } catch (error) {
      console.error("Error fetching invitations:", error)
      return []
    }
  }
  const invitations = await getInvitations()

  console.log(invitations)

  return (
    <div>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Take interviews you have been invited to take.</h2>
          {/* <p className="text-lg">
            Take interviews you have been invited to take from here.
          </p> */}

          {/* <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button> */}
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
      <h1 className='text-2xl font-bold py-2'>Interviews</h1>
      {
        invitations.length > 0 ? (
          <div className='interviews-section'>
            {invitations.map((invitation: any) => (
              <InterviewCard key={invitation.id} interviewId={invitation.invitation?.interviewId} role={invitation.interview?.role} type={invitation.interview?.type} techstack={invitation.interview?.techstack} createdAt={invitation.interview?.createdAt} />
            ))}
          </div>
        ) : (
          <p>You have not been invited to any interviews yet.</p>
        )
      }
    </div>
  )
}

export default page