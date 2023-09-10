import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCrud } from "../../hooks/useCrud";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Scroll from "./Scroll";
import MessageInterfaceChannels from "./MessageInterfaceChannels";

interface SendMessageData {
  type: string;
  message: string;
  [key: string]: any;
}

interface Message {
  content: string;
  sender: string;
  timestamp: string;
  id: number;
}

interface Server {
  id: number;
  name: string;
  icon: string;
  category: string;
  server: string;
  description: string;
  channel_server: {
    id: number;
    name: string;
    server: number;
    topic: string;
    owner: number;
  }[];
}

interface ServerInfo {
  data: Server[];
}

const MessageInterface = (props: ServerInfo) => {
  const theme = useTheme();
  const { data } = props;
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
      setMessage("");
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendJsonMessage({
        type: "message",
        message,
      } as SendMessageData);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendJsonMessage({
      type: "message",
      message,
    } as SendMessageData);
  };

  function formatTimeStamp(timestamp: string): string {
    const date = new Date(Date.parse(timestamp));
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} at ${formattedTime}`;
  }

  return (
    <>
      <MessageInterfaceChannels data={data} />
      {channelId === undefined ? (
        <Box
          sx={{
            overflow: "hidden",
            p: { xs: 0 },
            height: `calc(80vh)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
                px: 5,
                maxWidth: "600px",
              }}
            >
              {" "}
              Welcome to {data?.[0]?.name ?? "Server"}
            </Typography>
            <Typography>
              {data?.[0]?.description ?? "This is our home"}
            </Typography>
          </Box>
        </Box>
      ) : (
        <div>
          <Box
            sx={{
              overflow: "hidden",
              p: 0,
              height: `calc(100vh - 100px)`,
            }}
          >
            <Scroll>
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {newMessage.map((msg: Message, index: number) => {
                  return (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="user image" />
                      </ListItemAvatar>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "12px",
                          variant: "body2",
                        }}
                        primary={
                          <>
                            <Typography
                              component="span"
                              variant="body1"
                              color="text.primary"
                              sx={{ display: "inline", fontW: 600 }}
                            >
                              {msg.sender}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="textSecondary"
                            >
                              {" at "}
                              {formatTimeStamp(msg.timestamp)}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body1"
                              style={{
                                overflow: "visible",
                                whiteSpace: "normal",
                                textOverflow: "clip",
                              }}
                              sx={{
                                display: "inline",
                                lineHeight: 1.2,
                                fontWeight: 400,
                                letterSpacing: "-0.2px",
                              }}
                              component="span"
                              color="text.primary"
                            >
                              {msg.content}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Scroll>
          </Box>
          <Box sx={{ position: "sticky", bottom: 0, width: "100%" }}>
            <form
              onSubmit={handleSubmit}
              style={{
                bottom: 0,
                right: 0,
                padding: "1rem",
                backgroundColor: theme.palette.background.default,
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex" }}>
                <TextField
                  fullWidth
                  multiline
                  value={message}
                  minRows={1}
                  maxRows={4}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </form>
          </Box>
        </div>
      )}
    </>
  );
};

export default MessageInterface;
