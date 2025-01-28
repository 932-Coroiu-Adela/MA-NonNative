import { configureStore } from "@reduxjs/toolkit";
import { entitySlice } from "./features/entity/entitySlice";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "@/middleware/rootSaga";
import { statusSlice } from "./features/status/statusSlice";
import { errorStatusSlice } from "./features/errorstatus/errorStatusSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: { 
        entity: entitySlice.reducer, //redux slice to manage state related to entities
        status: statusSlice.reducer, 
        errorStatus: errorStatusSlice.reducer },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([sagaMiddleware])
});

sagaMiddleware.run(rootSaga); //the saga middleware listens for specific actions
// dispatched t0 the store and when an action matches, it triggers the corresponding saga
// to handle side effects


export type RootState = ReturnType<typeof store.getState>; //returning the current state of the store
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;


