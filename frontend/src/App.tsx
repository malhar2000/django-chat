import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import Home from "./pages/Home.tsx";
import { createMuiTheme } from "./theme/theme";
import Explore from "./pages/Explore.tsx";
import Server from "./pages/Server.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />,
      <Route path="/explore/:categoryName" element={<Explore />} />,
      <Route path="/server" element={<Server />} />,
    </Route>
  )
);

const App: React.FC = () => {
  const theme = createMuiTheme();
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />;
    </ThemeProvider>
  );
};

export default App;
