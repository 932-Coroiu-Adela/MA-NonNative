import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { Drug } from '@/redux/features/drug/drug';
import { deleteDrug, editDrug, getDBConnection, getDrugs, insertDrug, insertTempDrug } from '@/database/localdb';
import { setErrorStatus } from '@/redux/features/errorstatus/errorStatusSlice';

export function* addDrug(action: { type: string, payload: Drug }): Generator<any, void, any> {
    try {
        const db = yield call(getDBConnection);
        const id = yield call(insertDrug, db, action.payload);
        yield call(insertTempDrug, db, { id: id, type: 1 });
        const { id: _, ...payloadWithoutId } = action.payload;
        yield put({ type: "drug/addDrug", payload: { id: id, ...payloadWithoutId } });
    } catch (e) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Local Database Error", status: true }));
    }
}

export function* removeDrug(action: { type: string, payload: number }): Generator<any, void, any> {
    try {
        const db = yield call(getDBConnection);
        yield call(deleteDrug, db, action.payload);
        yield call(insertTempDrug, db, { id: action.payload, type: 2 });
        yield put({ type: "drug/removeDrug", payload: action.payload });
    } catch (e) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Local Database Error", status: true }));
    }
}

export function* updateDrug(action: { type: string, payload: Drug }): Generator<any, void, any> {
    try {
        const db = yield call(getDBConnection);
        yield call(editDrug, db, action.payload);
        yield put({ type: "drug/updateDrug", payload: action.payload });
    } catch (e) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Local Database Error", status: true }));
    }
}


export function* fetchDrugs(): Generator<any, void, any> {
    try {
        const db = yield call(getDBConnection);
        const drugs = yield call(getDrugs, db);
        yield put({ type: "drug/fetchDrugs", payload: drugs });
    } catch (e) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Local Database Error", status: true }));
    }
}
