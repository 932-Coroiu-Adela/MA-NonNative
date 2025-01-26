import { deleteDrugServer, editDrugServer, getDrugsServer, insertDrugServer, syncOfflineData } from "@/database/serverdb";
import { Drug } from "@/redux/features/drug/drug";
import { all, call, put, retry, select, take } from "redux-saga/effects";
import { deleteDrug, deleteTempDrug, editDrug, getDBConnection, getTempDrugs, insertDrug, rehydrateLocalDB, TempDrug } from "@/database/localdb";
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


export function* fetchDrugsServer() {
    try {
        const drugs: Drug[] = yield call(() => getDrugsServer());
        console.log(drugs);
        yield call(rehydrateLocalDB, drugs);
        yield put({ type: "drug/fetchDrugs", payload: drugs });
    } catch (error) {
        console.log(error);
        yield put(setErrorStatus({ message: "There has been a Network Error", status: true }));
    }
}

export function* addDrugServer(action: { type: string, payload: Drug }) {
    try {
        const drug: Drug = yield call(() => insertDrugServer(action.payload));
        const db: SQLiteDatabase = yield call(getDBConnection);
        console.log(drug);
        yield call(() => insertDrug(db, drug));
        yield put({ type: "drug/addDrug", payload: drug });
    }
    catch (error) {
        console.log(error);
        yield put(setErrorStatus({ message: "There has been a Network Error", status: true }));
    }
}

export function* removeDrugServer(action: { type: string, payload: number }) {
    try {
        yield call(() => deleteDrugServer(action.payload));
        const db: SQLiteDatabase = yield call(getDBConnection);
        yield call(() => deleteDrug(db, action.payload));
        yield put({ type: "drug/removeDrug", payload: action.payload });
    }
    catch (error) {
        console.log(error);
        yield put(setErrorStatus({ message: "There has been a Network Error", status: true }));
    }
}

export function* updateDrugServer(action: { type: string, payload: Drug }) {
    try {
        yield call(() => editDrugServer(action.payload));
        const db: SQLiteDatabase = yield call(getDBConnection);
        yield call(() => editDrug(db, action.payload));
        yield put({ type: "drug/updateDrug", payload: action.payload });
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
        const response: AxiosResponse = yield call(axios.get, `http://${SERVER_IP}:${SERVER_PORT}/`, { timeout: 5000, validateStatus: () => true });
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
    const socket = getSocket();
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
    const socket: ReconnectingWebSocket = yield call(getSocket);
    socket.reconnect();
    while (true) {
        const action: PayloadAction<Drug | { id: number } | void> = yield take(channel);
        console.log(action);
        const db: SQLiteDatabase = yield call(getDBConnection);
        switch (action.type) {

            case "connect":
                console.log("Connected to server via WebSocket");
                yield put({ type: "status/checkConnection" });
                const tempData: TempDrug[] = yield call(getTempDrugs, db);
                yield call(() => syncOfflineData(tempData));
                yield call(() => fetchDrugsServer());
                yield call(deleteTempDrug, db);
                break;
            case "itemAdded":
                yield call(() => insertDrug(db, action.payload as Drug));
                yield put({ type: "drug/addDrug", payload: action.payload as Drug });
                break;
            case "itemUpdated":
                yield call(() => editDrug(db, action.payload as Drug));
                yield put({ type: "drug/updateDrug", payload: action.payload as Drug });
                break;
            case "itemDeleted":
                yield call(() => deleteDrug(db, (action.payload as { id: number }).id));
                yield put({ type: "drug/removeDrug", payload: (action.payload as { id: number }).id });
                break;
            case "disconnect":
                console.log("Disconnected from server. Reconnecting...");
                yield put({ type: "status/checkConnection" });
                break;
        }
    }
}
