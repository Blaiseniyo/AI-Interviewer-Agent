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
import { ArrowLeft, Plus, X, Upload, FileText } from "lucide-react";

import { interviewFormSchema } from "@/public/types/validations";

type InterviewFormData = z.infer<typeof interviewFormSchema>;

const CreateInterview = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rubricMode, setRubricMode] = useState<"text" | "pdf">("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rubricText, setRubricText] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewFormData>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      role: "",
      type: "Technical",
      level: "Entry",
      techStack: "",
      questions: [""],
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

  const addQuestion = () => {
    appendQuestion("");
  };

  const removeQuestionField = (index: number) => {
    if (questionFields.length > 1) {
      removeQuestion(index);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      console.log("PDF file selected:", file.name);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const onSubmit = async (data: InterviewFormData) => {
    setIsSubmitting(true);

    try {
      const filteredQuestions = data.questions.filter((q) => q.trim() !== "");

      const interviewData = {
        ...data,
        questions: filteredQuestions,
        rubricMode,
        rubricText: rubricMode === "text" ? rubricText : null,
        selectedFile: selectedFile?.name,
      };

      console.log("Creating interview:", interviewData);
      router.push("/admin");
    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  placeholder="e.g., Frontend Developer, Backend Engineer, Product Manager"
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
                  <option value="">Select interview type</option>
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
                  <option value="">Select experience level</option>
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                </select>
              </div>

              <div className="form-group">
                <Label htmlFor="techStack">Tech Stack</Label>
                <Input
                  id="techStack"
                  placeholder="e.g., React, Node.js, MongoDB, AWS, Docker"
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
                        placeholder={`Enter your interview question ${index + 1
                          }...`}
                        {...register(`questions.${index}`)}
                        className={`question-input ${errors.questions?.[index] ? "border-red-500" : ""
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
                <div className="rubric-mode-toggle">
                  <Button
                    type="button"
                    variant={rubricMode === "text" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRubricMode("text")}
                    className="mr-2"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Text Editor
                  </Button>
                  <Button
                    type="button"
                    variant={rubricMode === "pdf" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRubricMode("pdf")}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF
                  </Button>
                </div>
              </div>

              {rubricMode === "text" ? (
                <div className="text-editor-section">
                  <textarea
                    id="rubric-textarea"
                    value={rubricText}
                    onChange={(e) => setRubricText(e.target.value)}
                    placeholder="Write your interview rubric here..."
                    className="text-editor-textarea"
                    rows={15}
                  />
                </div>
              ) : (
                <div className="pdf-upload-section">
                  <div className="pdf-upload-area">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="pdf-upload-label">
                      <Upload className="w-8 h-8 mb-4 text-light-100" />
                      <p className="text-light-100 mb-2">
                        {selectedFile
                          ? selectedFile.name
                          : "Click to upload PDF rubric"}
                      </p>
                      <p className="text-sm text-light-100/70">
                        Upload your interview rubric as a PDF document
                      </p>
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="selected-file">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
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
