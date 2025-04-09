// src/App.tsx
import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import FeedbackDisplay from "./components/FeedbackDisplay";
import "./App.css";

interface ResumeFeedback {
  summary: string;
  strengths: string[];
  areas_for_improvement: string[];
  recommendations: string[];
  example_changes: string[];
}

const App = () => {
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null);

  return (
    <div className="container">
      <h1>Resume Reviewer</h1>
      <UploadForm onFeedback={setFeedback} />
      <FeedbackDisplay feedback={feedback} />
    </div>
  );  
};

export default App;
