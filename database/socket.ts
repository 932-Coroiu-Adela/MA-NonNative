import { SERVER_IP, WS_PORT } from "@/constants/Constants";
import ReconnectingWebSocket from 'reconnecting-websocket';
import WS from 'ws';

const ws = new ReconnectingWebSocket(`ws://${SERVER_IP}:${WS_PORT}`, [], {
    WebSocket: WS.WebSocket,
    connectionTimeout: 1000,
    startClosed: true
});

const getSocket = () => {
    return ws;
}

export default getSocket;