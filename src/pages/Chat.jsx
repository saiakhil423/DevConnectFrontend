import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import Navbar from "../components/Navbar";
const API_KEY = "AIzaSyBRA_5Yvl2Kf7ZwAmUczggkCHh16t0Jo5Y"; // Replace with your Gemini API Key
const systemMessage = {
  role: "system",
  content:
    "Explain things like you're talking to a full stack devloper as a beginner provide and provide answers in 10lines giving small examples",
};

const ChatApp = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Devconnetor! Ask me anything!",
      sentTime: "just now",
      sender: "ChatBot",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    await processMessageToGemini(newMessages);
  };

  async function processMessageToGemini(chatMessages) {
    let apiMessages = chatMessages.map((msg) => ({
      role: msg.sender === "ChatBot" ? "model" : "user",
      parts: [{ text: msg.message }], // ✅ Correct structure
    }));

    const apiRequestBody = {
      contents: apiMessages, // ✅ Fix here (no "content", use "parts")
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.candidates || data.candidates.length === 0) {
        console.error("Invalid API response:", data);
        return;
      }

      setMessages([
        ...chatMessages,
        {
          message: data.candidates[0].content.parts[0].text, // ✅ Extract response correctly
          sender: "ChatBot",
        },
      ]);
    } catch (error) {
      console.error("API Call Error:", error);
    }

    setIsTyping(false);
  }

  return (
    <>
      <Navbar />
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Devconnetor is typing" />
                ) : null
              }
            >
              {messages.map((msg, i) => (
                <Message
                  key={i}
                  model={{
                    message: msg.message,
                    sentTime: msg.sentTime,
                    sender: msg.sender,
                    direction: msg.sender === "user" ? "outgoing" : "incoming", // Differentiate alignment based on sender
                  }}
                />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
};

export default ChatApp;
