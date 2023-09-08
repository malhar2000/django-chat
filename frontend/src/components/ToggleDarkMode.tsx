import { useMediaQuery } from "@mui/material";
import React from "react";

interface ToggleDarkModeProps {
  children: React.ReactNode;
}

const ToggleDarkMode: React.FC<ToggleDarkModeProps> = ({ children }) => {
  const [darkMode, setDarkMode] =
    React.useState<boolean>(() =>
      localStorage.getItem("darkMode") === "true" ? true : false
    ) || useMediaQuery("(prefers-color-scheme: dark)")
      ? true
      : false;

  // function only created once when component is created
  const toggleDarkMode = React.useCallback(() => {
    setDarkMode((prev: boolean) => !prev);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <>
      <h1></h1>
    </>
  );
};

export default ToggleDarkMode;
