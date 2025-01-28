import { deleteEntityServer, editEntityServer, getEntitiesServer, insertEntityServer, syncOfflineData } from "@/database/serverdb";
import { Entity } from "@/redux/features/entity/entity";
import { all, call, put, retry, select, take } from "redux-saga/effects";
import { deleteEntity, deleteTempEntity, editEntity, getDBConnection, getTempEntities, insertEntity, rehydrateLocalDB, TempEntity } from "@/database/localdb";
import { SQLiteDatabase } from "expo-sqlite";
import { Status } from "@/redux/features/status/status";
import { SERVER_IP, SERVER_PORT } from "@/constants/Constants";
import { setOnline, setConnected } from "@/redux/features/status/statusSlice";
import { NetInfoState, fetch } from "@react-native-community/netinfo";
import axios, { AxiosResponse } from "axios";
import { io, Socket } from "socket.io-client";
import { store } from "@/redux/store";
import { EventChannel, eventChannel } from "redux-saga";
import { PayloadAction } from "@reduxjs/toolkit";
import getSocket from "@/database/socket";
import { setErrorStatus } from "@/redux/features/errorstatus/errorStatusSlice";
import ReconnectingWebSocket from "reconnecting-websocket";

const socket = getSocket();

export function* fetchEntitiesServer() {
    try {
        const entities: Entity[] = yield call(() => getEntitiesServer());
        console.log(entities);
        yield call(rehydrateLocalDB, entities);
        yield put({ type: "entity/fetchEntities", payload: entities });
    } catch (error) {
        console.log(error);
        yield put(setErrorStatus({ message: "There has been a Network Error", status: true }));
    }
}

export function* addEntityServer(action: { type: string, payload: Entity }) {
    try {
        const entity: Entity = yield call(() => insertEntityServer(action.payload));
        const db: SQLiteDatabase = yield call(getDBConnection);
        console.log(entity);
        yield call(() => insertEntity(db, entity));
        yield put({ type: "entity/addEntity", payload: entity });
    }
    catch (error) {
        console.log(error);
        yield put(setErrorStatus({ message: "There has been a Network Error", status: true }));
    }
}

export function* removeEntityServer(action: { type: string, payload: number }) {
    try {
        yield call(() => deleteEntityServer(action.payload));
        const db: SQLiteDatabase = yield call(getDBConnection);
        yield call(() => deleteEntity(db, action.payload));
        yield put({ type: "entity/removeEntity", payload: action.payload });
    }
    catch (error) {
        console.log(error);
        yield put(setErrorStatus({ message: "There has been a Network Error", status: true }));
    }
}

export function* updateEntityServer(action: { type: string, payload: Entity }) {
    try {
        yield call(() => editEntityServer(action.payload));
        const db: SQLiteDatabase = yield call(getDBConnection);
        yield call(() => editEntity(db, action.payload));
        yield put({ type: "entity/updateEntity", payload: action.payload });
    }
    catch (error) {
        console.log(error);
        yield put(setErrorStatus({ message: "There has been a Network Error", status: true }));
    }
}


export function* checkConnection() {
    try {
        yield put(setOnline(false));
        yield put(setConnected(false));
        const internetConnection: NetInfoState = yield call(fetch);
        if (!internetConnection.isConnected) {
            console.error("No internet connection");
            return;
        }
        yield put(setOnline(true));
        console.log("Internet connection available");
        const response: AxiosResponse = yield call(axios.get, `http://${SERVER_IP}:${SERVER_PORT}/transactions`, { timeout: 5000, validateStatus: () => true });
        if (!(response.status === 200)) {
            console.error("Connection to server failed");
            return;
        }
        console.log("Connection to server successful");
        yield put(setConnected(true));
    } catch (e: any) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Network Error", status: true }));
    }
}

export function webSocketChannel() {
    return eventChannel((emit) => {
        console.log("Websocket saga started");
        socket.onopen = () => {
            console.log("Connected to WebSocket server!");
            emit({ type: "connect" });
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);
            emit({ type: data.event, payload: data.data });
        }

        socket.onclose = () => {
            console.log("Disconnected from server.");
            emit({ type: "disconnect" });
        };

        return () => {
            socket.close();
        };
    });

}


export function* webSocketSaga() {
    const channel: EventChannel<PayloadAction> = yield call(webSocketChannel);
    socket.reconnect();
    while (true) {
        const action: PayloadAction<Entity | { id: number } | void> = yield take(channel);
        console.log(action);
        const db: SQLiteDatabase = yield call(getDBConnection);
        switch (action.type) {

            case "connect":
                console.log("Connected to server via WebSocket");
                yield put({ type: "status/checkConnection" });
                const tempData: TempEntity[] = yield call(getTempEntities, db);
                yield call(() => syncOfflineData(tempData));
                yield call(() => fetchEntitiesServer());
                yield call(deleteTempEntity, db);
                break;
            case "itemAdded":
                yield call(() => insertEntity(db, action.payload as Entity));
                yield put({ type: "entity/addEntity", payload: action.payload as Entity });
                break;
            case "itemUpdated":
                yield call(() => editEntity(db, action.payload as Entity));
                yield put({ type: "entity/updateEntity", payload: action.payload as Entity });
                break;
            case "itemDeleted":
                yield call(() => deleteEntity(db, (action.payload as { id: number }).id));
                yield put({ type: "entity/removeEntity", payload: (action.payload as { id: number }).id });
                break;
            case "disconnect":
                console.log("Disconnected from server. Reconnecting...");
                yield put({ type: "status/checkConnection" });
                break;
        }
    }
}
