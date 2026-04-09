import { useContext } from "react";
import { ChatContext } from "./ChatContext";

export function useChats() {
  return useContext(ChatContext);
}
