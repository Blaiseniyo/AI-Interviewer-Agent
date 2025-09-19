import React from 'react'
import DisplayTechIcons from './DisplayTechIcons'
import Agent from './Agent'
import RetakeHandler from './RetakeHandler'

interface InterviewCallProps {
    interview: Interview
    interviewId: string
    user: User
    userInvitation?: Invitation
    retake?: boolean
    isMockInterview?: boolean
}

const InterviewCall = ({ interview, user, userInvitation, retake, isMockInterview, interviewId }: InterviewCallProps) => {
    return (
        <section className="grid place-items-center pb-12 min-h-screen">
            {retake && (
                <RetakeHandler interviewId={interview.id} userId={user.id} />
            )}
            <div className="flex w-full flex-row justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4 items-center">
                        <h3 className="capitalize">{interview.role} Interview</h3>
                    </div>

                    <DisplayTechIcons techStack={interview.techstack} />
                </div>

                <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
                    {interview.type}
                </p>
            </div>

            <Agent
                userName={user?.name!}
                userId={user?.id}
                interviewId={interviewId}
                type="interview"
                questions={interview.questions}
                rubric={interview.rubric}
                invitationId={userInvitation?.id}
                isMockInterview={isMockInterview}
            />
        </section>
    )
}

export default InterviewCall