"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import OpenAI from "openai";
import "./ChatInterface.css";
import { Message, ScoreData } from "../types";

interface ChatInterfaceProps {
  onScoreGenerated: (scoreData: ScoreData) => void;
}

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onScoreGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    // Add user message to the chat
    const userMessage: Message = { text: inputMessage, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Check if the message is requesting a score transcription
      const isScoreRequest =
        inputMessage.toLowerCase().includes("transcribe") ||
        inputMessage.toLowerCase().includes("sheet music") ||
        inputMessage.toLowerCase().includes("score");

      // Prepare the conversation history for the API call
      const conversationHistory = updatedMessages.map((msg) => ({
        role:
          msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

      // Make the API call to OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system" as const,
            content:
              "You are a musical assistant that can analyze songs and transcribe them into sheet music. When asked to transcribe a song, respond as if you've analyzed the audio and created sheet music.",
          },
          ...conversationHistory,
        ],
        max_tokens: 500,
      });

      // Get the response text
      const responseText = completion.choices[0].message.content || "";

      // Create the bot response object
      const botResponse: Message = {
        text: responseText,
        sender: "bot",
        hasScore: isScoreRequest,
      };

      // Update messages with the bot response
      setMessages([...updatedMessages, botResponse]);

      // If this was a score request, generate a score
      if (isScoreRequest) {
        // In a real implementation, you might want to use another API call or service to generate the actual sheet music
        // For now, we'll simulate it with a placeholder image
        onScoreGenerated({
          imageUrl:
            "https://musescore.com/static/musescore/scoredata/g/a1d29710ce366d14185c79c7f1daa4f51c03a2c1/score_0.png",
          instrument: "Piano",
          trackTitle: "Current Playing Track",
        });
      }
    } catch (error) {
      console.error("Error calling OpenAI API:", error);

      // Add an error message to the chat
      setMessages([
        ...updatedMessages,
        {
          text: "Sorry, I encountered an error processing your request. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputMessage(e.target.value);
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
        {isLoading && (
          <div className="message bot-message loading-message">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type a message... (e.g., 'Transcribe this song')"
          className="message-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="send-button"
          disabled={isLoading || inputMessage.trim() === ""}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
