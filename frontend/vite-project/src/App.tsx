
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const inputRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "red" },
        })
      );
    };

    wsRef.current = ws;

    return () => ws.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const message = inputRef.current.value.trim();
    if (!message) return;
    wsRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: { message },
      })
    );
    inputRef.current.value = "";
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-2xl font-semibold bg-gray-800 shadow-md">
        Chat Room – Red
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex">
            <div className="bg-purple-500 text-white px-4 py-2 rounded-xl shadow-md max-w-[70%]">
              {msg}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-gray-800 flex gap-2">
        <input
          ref={inputRef}
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition font-semibold shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
