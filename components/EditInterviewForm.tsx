"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EXPERIENCE_LEVELS, INTERVIEW_TYPES, editSchema, EditFormData } from "@/public/types/validations";
import { toast } from "sonner";
import { updateInterview } from "@/lib/actions/general.action";


type EditInterviewFormProps = {
    interview: Interview;
    onSubmit?: (payload: Partial<Interview> & { questions?: string[] }) => Promise<void> | void;
    backHref?: string;
};

const EditInterviewForm = ({ interview, onSubmit, backHref = "/admin" }: EditInterviewFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questions, setQuestions] = useState<string[]>(interview.questions || [""]);

    const {
        register,
        handleSubmit: handleSubmit,
        formState: { errors },
    } = useForm<EditFormData>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            role: "",
            techStack: "",
            rubricText: "",
        },
    });

    const submit: SubmitHandler<EditFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const qs = (questions || []).map(q => q.trim()).filter(Boolean);
            const payloadEntries: [string, unknown][] = [
                ["role", data.role?.trim()],
                ["type", data.type],
                ["level", data.level],
                ["techstack", data.techStack?.split(",").map(s => s.trim()).filter(Boolean)],
                ["questions", qs.length ? qs : undefined],
                ["rubric", data.rubricText?.trim()],
            ];

            const payload = Object.fromEntries(
                payloadEntries.filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0))
            ) as Partial<Interview> & { questions?: string[] };

            const result = await updateInterview(interview.id, payload);
            if (result?.success) toast.success("Interview updated successfully");
            else toast.error(result?.message || "Failed to update interview");

            if (onSubmit) await onSubmit(payload);
        } catch (e) {
            // console.error("Error updating interview:", e);
            toast.error("Unexpected error while updating interview");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-layout">
            <div className="admin-container">
                <div className="create-interview-header">
                    <Button asChild variant="ghost" className="back-btn">
                        <Link href={backHref}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </Button>

                    <div>
                        <h1 className="create-title">Edit Interview</h1>
                        <p className="create-subtitle">Update fields you want to change. Unchanged fields can be left blank.</p>
                    </div>
                </div>

                <div className="create-form-container">
                    <form onSubmit={handleSubmit(submit)} className="create-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <Label htmlFor="role">Interview Role</Label>
                                <Input
                                    id="role"
                                    placeholder={interview.role}
                                    {...register("role")}
                                    className={errors.role ? "border-red-500" : ""}
                                />
                                {errors.role && <p className="text-red-400 text-sm mt-1">Role is invalid</p>}
                            </div>

                            <div className="form-group">
                                <Label htmlFor="type">Interview Type</Label>
                                <select id="type" className="form-select" defaultValue="" {...register("type")}>
                                    <option value="" disabled>
                                        {interview.type || "Select interview type"}
                                    </option>
                                    {INTERVIEW_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <Label htmlFor="level">Experience Level</Label>
                                <select id="level" className="form-select" defaultValue="" {...register("level")}>
                                    <option value="" disabled>
                                        {interview.level || "Select experience level"}
                                    </option>
                                    {EXPERIENCE_LEVELS.map((l) => (
                                        <option key={l.value} value={l.value}>{l.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <Label htmlFor="techStack">Tech Stack</Label>
                                <Input
                                    id="techStack"
                                    placeholder={interview.techstack?.join(", ") || "e.g., React, Node.js"}
                                    {...register("techStack")}
                                    className={errors.techStack ? "border-red-500" : ""}
                                />
                                {errors.techStack && (
                                    <p className="text-red-400 text-sm mt-1">Tech stack is invalid</p>
                                )}
                            </div>
                        </div>

                        <div className="questions-section">
                            <div className="questions-header">
                                <Label>Interview Questions</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => setQuestions(prev => [...prev, ""])} className="add-question-btn">
                                    Add Question
                                </Button>
                            </div>
                            <div className="questions-list">
                                {questions.map((q, index) => (
                                    <div key={index} className="question-item">
                                        <div className="question-input-wrapper">
                                            <Input
                                                placeholder={interview.questions?.[index] || `Enter question ${index + 1}`}
                                                value={q}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setQuestions(prev => prev.map((pq, i) => (i === index ? v : pq)));
                                                }}
                                                className="question-input"
                                            />
                                            {questions.length > 1 && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setQuestions(prev => prev.filter((_, i) => i !== index))} className="remove-question-btn">
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rubric-section">
                            <div className="rubric-header">
                                <Label>Interview Rubric</Label>
                            </div>
                            <textarea
                                rows={8}
                                className="text-editor-textarea"
                                placeholder={interview.rubric || "Write your interview rubric here..."}
                                {...register("rubricText")}
                            />
                        </div>

                        <div className="form-actions">
                            <Button type="button" variant="outline" asChild>
                                <Link href={backHref}>Cancel</Link>
                            </Button>
                            <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditInterviewForm;