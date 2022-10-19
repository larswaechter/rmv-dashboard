import { useState, useRef, useEffect } from "react";

const useWebsocket = (onMessage) => {
  const [isConnected, setIsConnected] = useState(false);

  const ws = useRef(null);

  const sendMessage = () => {
    if (ws.current?.OPEN) ws.current.send("Hello from client");
    else console.error("Cannot send message because WS is not open");
  };

  const connect = () => {
    if (ws.current?.CONNECTING || ws.current?.OPEN) return;

    ws.current = new WebSocket(`ws://localhost:3001/rofl`);

    ws.current.onopen = () => {
      console.log("Connected to WS");
      setIsConnected(true);
    };

    ws.current.onerror = (err) => {
      console.error(err);
      setIsConnected(false);
    };

    ws.current.onclose = (e) => {
      console.log("Disconnected from WS");
      if (e.code !== 4000) setIsConnected(false);
    };

    ws.current.onmessage = ({ data }) => {
      const { event, body } = JSON.parse(data);
      onMessage(event, body);
    };
  };

  useEffect(() => {
    connect();
  }, [ws.current, isConnected]);

  return {
    ws,
    sendMessage,
    isConnected,
  };
};

export default useWebsocket;
