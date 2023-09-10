import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useRef } from "react";

interface ScrollProps {
  children: React.ReactNode;
}

const ScrollContainer = styled(Box)(() => ({
  // -190px is the height of the primary app bar
  height: `calc(100vh - 190px)`,
  overflowY: "scroll",
  // this is for the scrollbar
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  // this is for the scrollbar thumb (the draggable thing)
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "4px",
  },
  // this is for the scrollbar thumb (the draggable thing) when you hover over it
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555",
  },
  // this is for the scrollbar track (the thing the draggable thing moves on)
  "&::-webkit-scrollbar-track": {
    // backgroundColor: "#f0f0f0",
  },
  // this is for the scrollbar track (the thing the draggable thing moves on) when you hover over it
  "&::-webkit-scrollbar-corner": {
    backgroundColor: "transparent",
  },
}));

const Scroll = ({ children }: ScrollProps) => {
  // useRef is used to access the DOM element
  // to start from the bottom
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    // if scrollbar is active (if dom element exists)
    if (scrollRef.current) {
      // scrollHeight is the height of the entire element (max. scrollable height)
      // scrollTop represents the verical scroll position
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, children]);

  return <ScrollContainer ref={scrollRef}>{children}</ScrollContainer>;
};
export default Scroll;
