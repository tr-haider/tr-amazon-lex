import React from "react";
import Chatbot from "./components/Chatbot";
import "./App.css";

function App() {
  return (
    <div className="container">
      {/* Left Side - Title */}
      <div className="title-container">
        <h1 className="title">Amazon lex booking reservation chatbot</h1>
      </div>

      {/* Right Side - Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
