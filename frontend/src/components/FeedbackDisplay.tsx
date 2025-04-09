import React from "react";

interface ResumeFeedback {
  summary: string;
  strengths: string[];
  areas_for_improvement: string[];
  recommendations: string[];
  example_changes: string[];
}

interface FeedbackDisplayProps {
  feedback: ResumeFeedback | null;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div>
      <h2>Resume Feedback</h2>

      <p><strong>Summary:</strong> {feedback.summary}</p>

      <h3>Strengths</h3>
      <ul>
        {feedback.strengths.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Areas for Improvement</h3>
      <ul>
        {feedback.areas_for_improvement.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Recommendations</h3>
      <ul>
        {feedback.recommendations.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Examples of Changes</h3>
      <ul>
        {(feedback.example_changes || []).map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

    </div>
  );
};

export default FeedbackDisplay;