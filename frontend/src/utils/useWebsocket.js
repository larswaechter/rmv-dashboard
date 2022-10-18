import { useState, useRef, useEffect } from "react";

const useWebsocket = (onMessage) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const ws = useRef(null);

  const connect = () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);

    ws.current = new WebSocket(`ws://localhost:3001`);

    ws.current.onopen = () => {
      console.log("Connected to WS");
      setIsConnected(true);
      setIsConnecting(false);
    };

    ws.current.onerror = (err) => {
      console.log(err);
      setIsConnected(false);
      setIsConnecting(false);
    };

    ws.current.onclose = (e) => {
      if (e.code !== 4000) setIsConnected(false);
    };

    ws.current.onmessage = (data) => {
      onMessage(data);
    };
  };

  useEffect(() => {
    connect();
  }, [ws.current, isConnected]);

  return {
    ws,
    isConnecting,
    isConnected,
  };
};

export default useWebsocket;
