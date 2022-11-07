import { createContext, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import EventEmitter from '../hooks/EventEmitter';

import useWebsocket from '../hooks/useWebsocket';

export const WebSocketContext = createContext({});

const WebSocketContextProvider = ({ children }) => {
  const eventEmitter = useRef(new EventEmitter());

  const handleMessage = useCallback(
    (event, msg) => {
      eventEmitter.current.emit('message', msg);
      eventEmitter.current.emit(`message/${event}`, msg);
    },
    [eventEmitter]
  );

  const { ws } = useWebsocket(handleMessage);

  return (
    <WebSocketContext.Provider value={{ ws, eventEmitter: eventEmitter.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketContextProvider.propTypes = {
  children: PropTypes.element
};

export default WebSocketContextProvider;
