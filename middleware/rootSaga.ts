import { initDB } from "@/database/localdb";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { SERVER_IP, SERVER_PORT } from "@/constants/Constants";
import axios, { AxiosResponse } from "axios"
import { addDrug, fetchDrugs, removeDrug, updateDrug } from "./localdbSaga";
import { fetch, NetInfoState } from "@react-native-community/netinfo";
import { setConnected, setOnline } from "@/redux/features/status/statusSlice";
import { Status } from "@/redux/features/status/status";
import { addDrugServer, checkConnection, fetchDrugsServer, removeDrugServer, updateDrugServer, webSocketSaga } from "./serverSaga";


function* initialize() {
    yield call(initDB);
    yield call(checkConnection);
    console.log("Initialized");
    yield put({ type: 'drug/fetch' });
    yield webSocketSaga();
}


function* fetchOfflineOrOnline() {
    const status: Status = yield select(state => state.status);
    if (status.isConnected && status.isOnline) {
        yield call(fetchDrugsServer);
    } else {
        yield call(fetchDrugs);
    }
}

function* addDrugOfflineOrOnline(action: { type: string, payload: any }) {
    const status: Status = yield select(state => state.status);
    if (status.isConnected && status.isOnline) {
        yield call(addDrugServer, action);
    } else {
        yield call(addDrug, action);
    }
}

function* removeDrugOfflineOrOnline(action: { type: string, payload: number }) {
    const status: Status = yield select(state => state.status);
    if (status.isConnected && status.isOnline) {
        yield call(removeDrugServer, action);
    } else {
        yield call(removeDrug, action);
    }
}

function* updateDrugOfflineOrOnline(action: { type: string, payload: any }) {
    const status: Status = yield select(state => state.status);
    if (status.isConnected && status.isOnline) {
        yield call(updateDrugServer, action);
    } else {
        yield call(updateDrug, action);
    }
}

export function* rootSaga() {
    yield takeEvery('drug/initialize', initialize);
    yield takeEvery('drug/fetch', fetchOfflineOrOnline);
    yield takeEvery('drug/add', addDrugOfflineOrOnline);
    yield takeEvery('drug/remove', removeDrugOfflineOrOnline);
    yield takeEvery('drug/update', updateDrugOfflineOrOnline);
    yield takeEvery('status/checkConnection', checkConnection);
}
