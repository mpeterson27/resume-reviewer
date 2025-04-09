import React, { useState } from "react";

interface UploadFormProps {
  onFeedback: (data: any) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onFeedback }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("https://resume-reviewer-production.up.railway.app/api/review", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get feedback from server.");
      }

      const data = await response.json();
      console.log("✅ Feedback:", data);

      // Pass feedback to parent
      onFeedback(data);

      // Optional: save to localStorage
      localStorage.setItem("feedback", JSON.stringify(data));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong while submitting the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
      <button type="submit" disabled={!file || loading}>
        {loading ? "Reviewing..." : "Submit for Review"}
      </button>
    </form>
  );
};

export default UploadForm;
