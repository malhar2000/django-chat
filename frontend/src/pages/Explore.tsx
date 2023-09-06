import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import PopularChannel from "../components/PrimaryDraw/PopularChannel";
import ExploreCategory from "../components/SecondaryDraw/ExploreCategories";
import ExploreServer from "../components/Main/ExploreServer";

const Explore = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      <PrimaryDraw>
        <PopularChannel open={false} />
      </PrimaryDraw>
      <SecondaryDraw>
        <ExploreCategory />
      </SecondaryDraw>
      <Main>
        <ExploreServer />
      </Main>
    </Box>
  );
};
export default Explore;
