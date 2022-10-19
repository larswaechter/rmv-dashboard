import { useContext } from "react";

import { WebSocketContext } from "../providers/WebsocketContextProvider";

const useWebsocketProvider = () => useContext(WebSocketContext);

export default useWebsocketProvider;
