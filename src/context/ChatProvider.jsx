import { useState, useCallback } from "react";
import { ChatContext } from "./ChatContext";
import { getChats } from "../api/chats";

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchChats = useCallback(async (cursor = null) => {
    try {
      const res = await getChats(cursor);

      if (cursor) {
        setChats((prev) => [...prev, ...(res.chats || [])]);
      } else {
        setChats(res.chats || []);
      }

      setNextCursor(res.nextCursor);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        fetchChats,
        nextCursor,
        setNextCursor,
        loadingMore,
        setLoadingMore,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
