import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:3000/chat", {
        userId: "user123",
        message: input,
      });

      const botMessage = { text: response.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error communicating with chatbot", sender: "bot" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
