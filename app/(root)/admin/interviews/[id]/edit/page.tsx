import EditInterviewForm from '@/components/EditInterviewForm'
import { getInterviewById } from '@/lib/actions/general.action';
import { notFound } from 'next/navigation';
import React from 'react'

const page = async ({ params }: RouteParams) => {
    const { id } = await params;
    const interview = await getInterviewById(id);
    if (!interview) {
        notFound();
    }
    return <EditInterviewForm interview={interview} />
}

export default page