import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCrud } from "../../hooks/useCrud";
import { Box } from "@mui/system";

interface Message {
  content: string;
  sender: string;
  timestamp: string;
  id: number;
}

const MessageInterface = () => {
  const [newMessage, setNewMessage] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  // this doesn't work.  if you have two channels 1 and 3 then in 3 it will fetch 1's messages and vice versa
  // why is this happening? because the fetch is happening before the channelId is updated in the url (not sure)
  // const { data, fetchData } = useCrud<Message>([], `/api/messages/`);
  //   await fetchData();
  //          rm message from other channels
  //         setNewMessage([]);
  //         console.log(data);
  //         setNewMessage(Array.isArray(data) ? data : []);
  const { fetchData } = useCrud<Message>(
    [],
    `/api/messages/?channel_id=${channelId}`
  );

  const url = channelId ? `ws://localhost:8000/${serverId}/${channelId}` : null;

  // name should be sendJsonMessage
  const { sendJsonMessage } = useWebSocket(url, {
    onOpen: async () => {
      try {
        const data = await fetchData();
        // rm message from other channels
        setNewMessage([]);
        setNewMessage(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log(e);
      }
    },
    onClose: () => console.log("closed"),
    onError: () => console.log("error"),
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      console.log(data);
      setNewMessage((prev) => [...prev, data.new_message]);
    },
  });

  return (
    <>
      {channelId === undefined ? (
        <Box>Home</Box>
      ) : (
        <div>
          {newMessage.map((msg, index) => (
            <div key={index}>
              <p>
                {msg.sender}: {msg.content}
              </p>
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
        </div>
      )}
    </>
  );
};

export default MessageInterface;
