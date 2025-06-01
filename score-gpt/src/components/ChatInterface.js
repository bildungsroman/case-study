import React, { useState } from "react";
import "./ChatInterface.css";

const ChatInterface = ({ onScoreGenerated }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, sender: "user" }];
    setMessages(newMessages);
    setInputMessage("");

    // Check if the message is requesting a score transcription
    const isScoreRequest =
      inputMessage.toLowerCase().includes("transcribe") ||
      inputMessage.toLowerCase().includes("sheet music") ||
      inputMessage.toLowerCase().includes("score");

    // Simulate response (in a real app, this would be an API call)
    setTimeout(() => {
      let botResponse;

      if (isScoreRequest) {
        botResponse = {
          text: "I've transcribed the current track. Here's the sheet music for the piano part.",
          sender: "bot",
          hasScore: true,
        };

        // Simulate generating a score and passing it to the parent component
        // In a real app, this would come from an actual API response
        onScoreGenerated({
          imageUrl:
            "https://musescore.com/static/musescore/scoredata/g/a1d29710ce366d14185c79c7f1daa4f51c03a2c1/score_0.png",
          instrument: "Piano",
          trackTitle: "Current Playing Track",
        });
      } else {
        botResponse = {
          text: `Response to: ${inputMessage}`,
          sender: "bot",
          hasScore: false,
        };
      }

      setMessages([...newMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat</h2>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            Start a conversation... Try asking "Can you transcribe the piano
            part from this track?"
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
            >
              {message.text}
              {message.hasScore && (
                <div className="score-notification">
                  <span className="score-icon">🎼</span> Sheet music generated
                  below
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message... (e.g., 'Transcribe this song')"
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
