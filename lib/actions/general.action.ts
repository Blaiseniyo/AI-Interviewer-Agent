"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  // Simplified query - only filter by finalized to avoid index requirement
  const interviews = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .get();

  // Filter and sort in memory
  const filteredInterviews = interviews.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((interview: any) => interview.userId !== userId)
    .sort((a: any, b: any) => {
      // Sort by createdAt in descending order
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit) as Interview[];

  return filteredInterviews;
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  // Simplified query without ordering to avoid index requirement
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .get();

  // Sort in memory instead
  const interviewData = interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];

  return interviewData.sort((a, b) => {
    // Sort by createdAt in descending order
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getAllInterviews(): Promise<Interview[] | null> {
  try {
    const interviews = await db.collection("interviews").get();

    const interviewData = interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    return interviewData.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error("Error fetching all interviews:", error);
    return null;
  }
}

export async function getFilteredInterviews(
  filters: AdminFilterParams
): Promise<Interview[] | null> {
  try {
    const all = await getAllInterviews();
    if (!all) return [];

    const { role, type, dateFrom, dateTo } = filters;

    const normalizedType = (value?: string) =>
      value ? value.trim().toLowerCase() : "";

    const fromMs = dateFrom
      ? new Date(dateFrom).setHours(0, 0, 0, 0)
      : undefined;
    const toMs = dateTo
      ? new Date(dateTo).setHours(23, 59, 59, 999)
      : undefined;

    const filtered = all.filter((interview: any) => {
      // role contains
      if (role && typeof interview.role === "string") {
        if (!interview.role.toLowerCase().includes(role.toLowerCase()))
          return false;
      } else if (role && !interview.role) {
        return false;
      }

      if (type && typeof interview.type === "string") {
        const it = /mix/gi.test(interview.type)
          ? "mixed"
          : normalizedType(interview.type);
        if (it !== normalizedType(type)) return false;
      } else if (type && !interview.type) {
        return false;
      }

      if (fromMs || toMs) {
        const created = interview.createdAt
          ? new Date(interview.createdAt).getTime()
          : undefined;
        if (!created) return false;
        if (fromMs && created < fromMs) return false;
        if (toMs && created > toMs) return false;
      }

      return true;
    });

    return filtered;
  } catch (error) {
    console.error("Error filtering interviews:", error);
    return null;
  }
}

export async function getInterviewWithFeedback(
  interviewId: string
): Promise<any> {
  try {
    const interview = await getInterviewById(interviewId);
    if (!interview) return null;

    const feedback = await getFeedbackByInterviewId({
      interviewId,
      userId: interview.userId,
    });

    return {
      ...interview,
      feedback,
    };
  } catch (error) {
    console.error("Error fetching interview with feedback:", error);
    return null;
  }
}

export async function getCandidatesByInterviewId(
  interviewId: string
): Promise<any[]> {
  try {
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .get();

    if (feedbackSnapshot.empty) return [];

    const userIds = [
      ...new Set(feedbackSnapshot.docs.map((doc) => doc.data().userId)),
    ];

    const candidates = await Promise.all(
      userIds.map(async (userId) => {
        const userDoc = await db.collection("users").doc(userId).get();
        const userData = userDoc.data();

        const userFeedback = feedbackSnapshot.docs.find(
          (doc) => doc.data().userId === userId
        );

        return {
          id: userId,
          name: userData?.name || "Unknown",
          email: userData?.email || "No email",
          status: "completed",
          score: userFeedback?.data()?.totalScore || 0,
          completedAt: userFeedback?.data()?.createdAt || null,
        };
      })
    );

    return candidates.sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return (
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
    });
  } catch (error) {
    console.error("Error fetching candidates for interview:", error);
    return [];
  }
}
