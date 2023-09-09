import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import MessageInterface from "../components/Main/MessageInterface";
import ServerChannels from "../components/SecondaryDraw/ServerChannels";
import UserServers from "../components/PrimaryDraw/UserServers";
import { useParams, useNavigate } from "react-router-dom";
import { useCrud } from "../hooks/useCrud";
import { useEffect } from "react";

const Server = () => {
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const navigate = useNavigate();

  const { data, fetchData, error, loading } = useCrud(
    [],
    `/api/server/select/?by_serverid=${serverId}`
  );

  if (error != null && error.message === "400") {
    navigate("/");
    return null;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const isChannel = (): boolean => {
    if (!channelId) {
      return true;
    }
    return data.some((server) =>
      server.channel_server.some(
        (channel) => channel.id === parseInt(channelId)
      )
    );
  };

  useEffect(() => {
    if (!isChannel()) {
      navigate(`/server/${serverId}`);
    }
  }, [isChannel, channelId]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw>
        <UserServers open={false} data={data} />
      </PrimaryDraw>
      <SecondaryDraw>
        <ServerChannels data={data} serverId={serverId} />
      </SecondaryDraw>
      <Main>
        <MessageInterface />
      </Main>
    </Box>
  );
};
export default Server;
