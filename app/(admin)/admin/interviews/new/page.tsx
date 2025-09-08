"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X, Upload, FileText, Loader2 } from "lucide-react";

import { EXPERIENCE_LEVELS, INTERVIEW_TYPES, interviewFormSchema } from "@/types/validations";
import FormField from "@/components/FormFieldInput";
import SelectField from "@/components/SelectField";
import { RubricMode, InterviewFormData, MAX_FILE_SIZE } from "@/types/validations";


const CreateInterview = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rubricMode, setRubricMode] = useState<RubricMode>("text");
  const [rubricText, setRubricText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  } = useFieldArray<InterviewFormData>({
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

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid PDF file";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }
    return null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);
    toast.success(`File "${file.name}" selected successfully`);
  };

  const handleRubricModeChange = (mode: RubricMode) => {
    setRubricMode(mode);
    if (mode === "text") {
      setSelectedFile(null);
    } else {
      setRubricText("");
    }
  };

  const onSubmit = async (data: InterviewFormData) => {
    if (rubricMode === "text" && !rubricText.trim()) {
      toast.error("Please provide interview rubric content");
      return;
    }

    if (rubricMode === "pdf" && !selectedFile) {
      toast.error("Please upload a PDF rubric file");
      return;
    }

    setIsSubmitting(true);

    try {
      const filteredQuestions = data.questions.filter((q) => q.trim() !== "");

      if (filteredQuestions.length === 0) {
        toast.error("Please add at least one interview question");
        setIsSubmitting(false);
        return;
      }

      const interviewPayload = {
        type: data.type,
        role: data.role,
        level: data.level,
        questions: JSON.stringify(filteredQuestions),
        rubric: rubricMode === "text" ? rubricText : selectedFile?.name || "",
        techStack: data.techStack,
      };

      const response = await fetch("/api/admin/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interviewPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create interview");
      }

      toast.success("Interview created successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create interview"
      );
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
              <FormField
                name="role"
                label="Interview Role"
                placeholder="e.g., Frontend Developer, Backend Engineer, Product Manager"
                register={register}
                error={errors.role}
              />

              <SelectField
                name="type"
                label="Interview Type"
                placeholder="Select interview type"
                options={INTERVIEW_TYPES}
                register={register}
                error={errors.type}
              />

              <SelectField
                name="level"
                label="Experience Level"
                placeholder="Select experience level"
                options={EXPERIENCE_LEVELS}
                register={register}
                error={errors.level}
              />

              <FormField
                name="techStack"
                label="Tech Stack"
                placeholder="e.g., React, Node.js, MongoDB, AWS, Docker"
                register={register}
                error={errors.techStack}
              />
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
                    onClick={() => handleRubricModeChange("text")}
                    className="mr-2"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Text Editor
                  </Button>
                  <Button
                    type="button"
                    variant={rubricMode === "pdf" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRubricModeChange("pdf")}
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Interview"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;