import { initDB } from "@/database/localdb";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { SERVER_IP, SERVER_PORT } from "@/constants/Constants";
import axios, { AxiosResponse } from "axios"
import { addEntity, fetchEntities, removeEntity, updateEntity } from "./localdbSaga";
import { fetch, NetInfoState } from "@react-native-community/netinfo";
import { setConnected, setOnline } from "@/redux/features/status/statusSlice";
import { Status } from "@/redux/features/status/status";
import { addEntityServer, checkConnection, fetchEntitiesServer, removeEntityServer, updateEntityServer, webSocketSaga } from "./serverSaga";


function* initialize() {
    yield call(initDB);
    yield call(checkConnection);
    console.log("Initialized");
    yield put({ type: 'entity/fetch' });
    yield webSocketSaga();
}


function* fetchOfflineOrOnline() {
    const status: Status = yield select(state => state.status);
    if (status.isConnected && status.isOnline) {
        yield call(fetchEntitiesServer);
    } else {
        yield call(fetchEntities);
    }
}

function* addEntityOfflineOrOnline(action: { type: string, payload: any }) {
    const status: Status = yield select(state => state.status);
    if (status.isConnected && status.isOnline) {
        yield call(addEntityServer, action);
    } else {
        yield call(addEntity, action);
    }
}

function* removeEntityOfflineOrOnline(action: { type: string, payload: number }) {
    const status: Status = yield select(state => state.status);
    if (status.isConnected && status.isOnline) {
        yield call(removeEntityServer, action);
    } else {
        yield call(removeEntity, action);
    }
}

function* updateEntityOfflineOrOnline(action: { type: string, payload: any }) {
    const status: Status = yield select(state => state.status);
    if (status.isConnected && status.isOnline) {
        yield call(updateEntityServer, action);
    } else {
        yield call(updateEntity, action);
    }
}

export function* rootSaga() {
    yield takeEvery('entity/initialize', initialize);
    yield takeEvery('entity/fetch', fetchOfflineOrOnline);
    yield takeEvery('entity/add', addEntityOfflineOrOnline);
    yield takeEvery('entity/remove', removeEntityOfflineOrOnline);
    yield takeEvery('entity/update', updateEntityOfflineOrOnline);
    yield takeEvery('status/checkConnection', checkConnection);
}
