import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCrud } from "../../hooks/useCrud";
import { useEffect } from "react";

// import useAxiosInstance from "../../helper/useAxiosInstance";

type SecondaryDrawProps = {
  children: React.ReactNode;
};

const SecondaryDraw = ({ children }: SecondaryDrawProps) => {
  // const axiosInstance = useAxiosInstance();
  const theme = useTheme();

  const { data, fetchData, error, loading } = useCrud(
    [],
    "/api/server/select/?category=cat2"
  );

  useEffect(() => {
    fetchData();
    console.log(data);
  }, []);

  return (
    <Box
      sx={{
        minWidth: `${theme.secondaryDraw.width}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px )`,
        mt: `${theme.primaryAppBar.height}px`,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: { xs: "none", sm: "block" },
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
};
export default SecondaryDraw;
