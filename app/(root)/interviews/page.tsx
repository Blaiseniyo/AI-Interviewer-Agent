import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getAllUserInvitations } from '@/lib/actions/userInvitations.action'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser()
  const getInvitations = await getAllUserInvitations(user?.id || '')
  return (
    <div>
      <h1 className='text-2xl font-bold py-2'>Interviews</h1>
      {
        getInvitations.sent.length > 0 ? (
          <div className='interviews-section'>
            {getInvitations.sent.map((invitation) => (
              <InterviewCard key={invitation.id} interview={invitation.interview} role={invitation.interview.role} type={invitation.interview.type} techstack={invitation.interview.techstack} createdAt={invitation.interview.createdAt} />
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