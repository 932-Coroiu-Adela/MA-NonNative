import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

import { Entity } from '@/redux/features/entity/entity';
import { deleteEntity, editEntity, getDBConnection, getEntities, insertEntity, insertTempEntity } from '@/database/localdb';
import { setErrorStatus } from '@/redux/features/errorstatus/errorStatusSlice';

export function* addEntity(action: { type: string, payload: Entity }): Generator<any, void, any> {
    try {
        const db = yield call(getDBConnection);
        const id = yield call(insertEntity, db, action.payload);
        yield call(insertTempEntity, db, { id: id, type: 1 });
        const { id: _, ...payloadWithoutId } = action.payload;
        yield put({ type: "entity/addEntity", payload: { id: id, ...payloadWithoutId } });
    } catch (e) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Local Database Error", status: true }));
    }
}

export function* removeEntity(action: { type: string, payload: number }): Generator<any, void, any> {
    try {
        const db = yield call(getDBConnection);
        yield call(deleteEntity, db, action.payload);
        yield call(insertTempEntity, db, { id: action.payload, type: 2 });
        yield put({ type: "entity/removeEntity", payload: action.payload });
    } catch (e) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Local Database Error", status: true }));
    }
}

export function* updateEntity(action: { type: string, payload: Entity }): Generator<any, void, any> {
    try {
        const db = yield call(getDBConnection);
        yield call(editEntity, db, action.payload);
        yield put({ type: "entity/updateEntity", payload: action.payload });
    } catch (e) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Local Database Error", status: true }));
    }
}


export function* fetchEntities(): Generator<any, void, any> {
    try {
        const db = yield call(getDBConnection);
        const entities = yield call(getEntities, db);
        yield put({ type: "entity/fetchEntities", payload: entities });
    } catch (e) {
        console.error(e);
        yield put(setErrorStatus({ message: "There has been a Local Database Error", status: true }));
    }
}
