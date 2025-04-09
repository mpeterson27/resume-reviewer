import React, { useState } from "react";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://resume-reviewer-production.up.railway.app";

const CoverLetterForm: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !jobDescription.trim()) return;

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);
    formData.append("notes", notes);

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/cover-letter`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", response.status, errorText);
        throw new Error("Failed to get cover letter.");
      }

      const data = await response.json();
      setOutput(data.coverLetter || "No output received.");
    } catch (err) {
      console.error(err);
      setOutput("Error generating cover letter.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
      .then(() => alert("Copied to clipboard!"))
      .catch(() => alert("Failed to copy."));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cover Letter Creator</h2>

      <label>Upload Resume (PDF/DOC/DOCX)</label><br />
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => e.target.files && setResume(e.target.files[0])}
      /><br /><br />

      <label>Job Description (Paste from Job Posting)</label><br />
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={6}
        style={{ width: "100%" }}
      /><br /><br />

      <label>Optional Notes</label><br />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
        placeholder="e.g. Please emphasize leadership skills or tailor to a consulting role, etc."
      /><br /><br />

      <button type="submit" disabled={loading || !resume || !jobDescription}>
        {loading ? "Generating..." : "Generate Cover Letter"}
      </button>

      {output && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Cover Letter</h3>
          <div
            style={{
              backgroundColor: "#f4f4f4",
              padding: "1rem",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {output}
          </div>
          <button
            onClick={copyToClipboard}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
          >
            📋 Copy to Clipboard
          </button>
        </div>
      )}
    </form>
  );
};


export default CoverLetterForm;