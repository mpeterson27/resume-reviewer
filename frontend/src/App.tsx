import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import FeedbackDisplay from "./components/FeedbackDisplay";
import "./App.css";
import React from "react";
import CoverLetterForm from "./components/CoverLetterForm";

const ResumePage = ({ setFeedback, feedback }: any) => (
  <>
    <h1>Resume Reviewer</h1>
    <UploadForm onFeedback={setFeedback} />
    <FeedbackDisplay feedback={feedback} />
  </>
);

const HomePage = () => (
  <>
    <h1>Welcome</h1>
    <p>This app lets you upload your resume and get AI-powered feedback.</p>
    <p>Use the nav above to switch between features.</p>
  </>
);

const CoverLetterPage = () => <CoverLetterForm />;

function App() {
  const [feedback, setFeedback] = React.useState(null);

  return (
    <Router>
      <div className="container">
        <nav style={{ marginBottom: "2rem" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/resume-reviewer" style={{ marginRight: "1rem" }}>Resume Reviewer</Link>
          <Link to="/cover-letter">Cover Letter Creator</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume-reviewer" element={<ResumePage setFeedback={setFeedback} feedback={feedback} />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
