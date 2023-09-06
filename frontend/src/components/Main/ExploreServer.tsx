import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography,
  Card,
  CardMedia,
  Grid,
  CardContent,
  Container,
} from "@mui/material";
import { useCrud } from "../../hooks/useCrud";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MEDIA_URL } from "../../helper/config";

// need to create a server interface
// and the interface should match the data from the server we are getting
interface Server {
  id: number;
  name: string;
  icon: string;
  category: string;
  banner: string;
}

const ExploreServer = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const url = categoryName
    ? `/api/server/select/?category=${categoryName}`
    : "/api/server/select/";
  const { data, fetchData, error, loading } = useCrud<Server>([], url);

  useEffect(() => {
    fetchData();
  }, [categoryName]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 6 }}>
        <Typography
          variant="h3"
          noWrap
          component="h1"
          sx={{
            display: {
              fontWeight: 700,
              fontSize: "48px",
              sm: "block",
              letterSpacing: "-2px",
            },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {categoryName ? categoryName : "Popluar Channels"}
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="h6"
          noWrap
          component="h2"
          color="textSecondary"
          sx={{
            display: {
              fontWeight: 700,
              fontSize: "48px",
              sm: "block",
              letterSpacing: "-1px",
            },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {categoryName
            ? `Channels talking about ${categoryName}`
            : "Checkout some of the popular channels"}
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{ pt: 6, pb: 1, fontWeight: 700, letterSpacing: "-1px" }}
      >
        Recommended Channels...
      </Typography>
      <Grid container spacing={{ xs: 0, sm: 2 }}>
        {data.map((server) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={server.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                backgroundImage: "none",
              }}
            >
              <Link
                to={`/server/${server.id}`}
                style={{ textDecoration: "none", color: "inhert" }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    server.banner
                      ? `${MEDIA_URL}${server.icon}`
                      : "https://source.unsplash.com/random"
                  }
                  //   image="https://source.unsplash.com/random"
                  alt={server.name}
                  sx={{ display: { xs: "none", sm: "block" } }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 0,
                    "&:last-child": { paddingBottom: 0 },
                  }}
                >
                  <List>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 0 }}>
                        <ListItemAvatar sx={{ minWidth: "50px" }}>
                          <Avatar
                            alt={server.name}
                            src={`${MEDIA_URL}/${server.icon}`}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              textAlign="start"
                              sx={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                fontWeight: 700,
                              }}
                            >
                              {server.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2">
                              {server.category}
                            </Typography>
                          }
                        />
                      </ListItemIcon>
                    </ListItem>
                  </List>
                  <Typography gutterBottom variant="h5" component="div">
                    {server.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {server.category}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ExploreServer;
