import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useState } from "react";

const url = "ws://localhost:8000/ws/test";

const Server = () => {
  const [newMessage, setNewMessage] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("Empty");

  // name should be sendJsonMessage
  const { sendJsonMessage } = useWebSocket(url, {
    onOpen: () => console.log("opened"),
    onClose: () => console.log("closed"),
    onError: () => console.log("error"),
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      setNewMessage((prev) => [...prev, data.new_message]);
    },
  });

  return (
    <>
      {newMessage.map((msg, index) => (
        <div key={index}>
          <p>{msg}</p>
        </div>
      ))}
      <form>
        <label htmlFor="message">
          Message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </form>
      <button
        onClick={() => {
          sendJsonMessage({ type: "message", message });
        }}
      >
        Send
      </button>
    </>
  );
};

export default Server;
