import { SERVER_IP, SERVER_PORT } from "@/constants/Constants";
import ReconnectingWebSocket from 'reconnecting-websocket';
import WS from 'ws';

const ws = new ReconnectingWebSocket(`ws://${SERVER_IP}:${SERVER_PORT}`, [], {
    WebSocket: WS.WebSocket,
    connectionTimeout: 1000,
    startClosed: true
});

const getSocket = () => {
    return ws;
}

export default getSocket;