"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";

import { interviewFormSchema } from "@/types/validations";

type InterviewFormData = z.infer<typeof interviewFormSchema>;

const CreateInterview = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      role: "",
      type: "Technical",
      level: "Entry",
      techStack: "",
      questions: [""],
      rubric: [
        {
          evaluation: "Communication Skills",
          points: 50,
          description: "Clarity, articulation, and structured responses",
        },
        {
          evaluation: "Technical Knowledge",
          points: 50,
          description: "Understanding of key concepts for the role",
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const {
    fields: rubricFields,
    append: appendRubric,
    remove: removeRubric,
  } = useFieldArray({
    control,
    name: "rubric",
  });

  const watchedRubric = watch("rubric");

  const addQuestion = () => {
    appendQuestion("");
  };

  const removeQuestionField = (index: number) => {
    if (questionFields.length > 1) {
      removeQuestion(index);
    }
  };

  const addRubricCriteria = () => {
    appendRubric({
      evaluation: "",
      points: 0,
      description: "",
    });
  };

  const removeRubricField = (index: number) => {
    if (rubricFields.length > 1) {
      removeRubric(index);
    }
  };

  const onSubmit = async (data: InterviewFormData) => {
    setIsSubmitting(true);

    try {
      const filteredQuestions = data.questions.filter((q) => q.trim() !== "");

      const interviewData = {
        ...data,
        questions: filteredQuestions,
      };

      console.log("Creating interview:", interviewData);

      router.push("/admin");
    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPoints = watchedRubric.reduce(
    (sum, criterion) => sum + criterion.points,
    0
  );

  return (
    <div className="admin-layout">
      <div className="admin-container">
        <div className="create-interview-header">
          <Button asChild variant="ghost" className="back-btn">
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div>
            <h1 className="create-title">Create New Interview</h1>
            <p className="create-subtitle">
              Set up a new interview session with custom rubric
            </p>
          </div>
        </div>

        <div className="create-form-container">
          <form onSubmit={handleSubmit(onSubmit)} className="create-form">
            <div className="form-grid">
              <div className="form-group">
                <Label htmlFor="role">Interview Role</Label>
                <Input
                  id="role"
                  placeholder="e.g., Frontend Developer, Backend Engineer"
                  {...register("role")}
                  className={errors.role ? "border-red-500" : ""}
                />
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor="type">Interview Type</Label>
                <select id="type" className="form-select" {...register("type")}>
                  <option value="Technical">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div className="form-group">
                <Label htmlFor="level">Experience Level</Label>
                <select
                  id="level"
                  className="form-select"
                  {...register("level")}
                >
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                </select>
              </div>

              <div className="form-group">
                <Label htmlFor="techStack">Tech Stack</Label>
                <Input
                  id="techStack"
                  placeholder="e.g., React, Node.js, MongoDB"
                  {...register("techStack")}
                  className={errors.techStack ? "border-red-500" : ""}
                />
                {errors.techStack && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.techStack.message}
                  </p>
                )}
              </div>
            </div>

            <div className="questions-section">
              <div className="questions-header">
                <Label>Interview Questions</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                  className="add-question-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="questions-list">
                {questionFields.map((field, index) => (
                  <div key={field.id} className="question-item">
                    <div className="question-input-wrapper">
                      <Input
                        placeholder={`Question ${index + 1}...`}
                        {...register(`questions.${index}`)}
                        className={`question-input ${
                          errors.questions?.[index] ? "border-red-500" : ""
                        }`}
                      />
                      {questionFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestionField(index)}
                          className="remove-question-btn"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {errors.questions?.[index] && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.questions[index]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {errors.questions && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.questions.message}
                </p>
              )}
            </div>

            <div className="rubric-section">
              <div className="rubric-header">
                <Label>Interview Rubric</Label>
                <div className="weight-summary">
                  <span
                    className={`weight-total ${
                      totalPoints !== 100 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    Total Points: {totalPoints}/100
                  </span>
                </div>
              </div>

              <div className="rubric-actions">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRubricCriteria}
                  className="add-rubric-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Evaluation Criteria
                </Button>
              </div>

              <div className="rubric-list">
                {rubricFields.map((field, index) => (
                  <div key={field.id} className="rubric-item">
                    <div className="rubric-inputs">
                      <div className="rubric-evaluation">
                        <Input
                          placeholder="Evaluation criteria (e.g., Communication Skills)"
                          {...register(`rubric.${index}.evaluation`)}
                          className={
                            errors.rubric?.[index]?.evaluation
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.rubric?.[index]?.evaluation && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.rubric[index]?.evaluation?.message}
                          </p>
                        )}
                      </div>

                      <div className="rubric-points">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Points"
                          {...register(`rubric.${index}.points`, {
                            valueAsNumber: true,
                          })}
                          className={
                            errors.rubric?.[index]?.points
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.rubric?.[index]?.points && (
                          <p className="text-red-400 text-sm mt-1">
                            {errors.rubric[index]?.points?.message}
                          </p>
                        )}
                      </div>

                      {rubricFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRubricField(index)}
                          className="remove-rubric-btn"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="rubric-description">
                      <textarea
                        placeholder="Description of this evaluation criteria..."
                        {...register(`rubric.${index}.description`)}
                        className={`criterion-description ${
                          errors.rubric?.[index]?.description
                            ? "border-red-500"
                            : ""
                        }`}
                        rows={2}
                      />
                      {errors.rubric?.[index]?.description && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.rubric[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.rubric && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.rubric.message}
                </p>
              )}
            </div>

            <div className="form-actions">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Interview"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;
