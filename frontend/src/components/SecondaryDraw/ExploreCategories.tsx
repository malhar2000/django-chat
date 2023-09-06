import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useCrud } from "../../hooks/useCrud";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MEDIA_URL } from "../../helper/config";

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
}

const ExploreCategory = () => {
  const theme = useTheme();
  const { data, fetchData, error, loading } = useCrud<Category>(
    [],
    "/api/server/category/"
  );

  useEffect(() => {
    fetchData();
  }, []);

  //   useEffect(() => {
  //     console.log(data);
  //   }, [data]);

  return (
    <>
      <Box
        sx={{
          height: 50,
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          flex: "1 1 100%", // flex-grow, flex-shrink, flex-basis
          position: "sticky",
          top: 0,
          backgroundColor: theme.palette.background.default,
        }}
      >
        Explore
      </Box>
      <List sx={{ py: 0 }}>
        {data.map((category) => (
          <ListItem
            disablePadding
            key={category.id}
            sx={{ display: "block" }}
            dense={true}
          >
            <Link
              to={`/explore/${category.name}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 48 }}>
                <ListItemIcon
                  sx={{ minWidth: "0px", justifyContent: "center" }}
                >
                  <ListItemAvatar sx={{ minWidth: "0px" }}>
                    <img
                      src={`${MEDIA_URL}${category.icon}`}
                      alt="category icon"
                      style={{
                        width: "30px",
                        height: "30px",
                        display: "block",
                        margin: "auto",
                      }}
                    />
                  </ListItemAvatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      textAlign="start"
                      paddingLeft={1}
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {category.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ExploreCategory;
