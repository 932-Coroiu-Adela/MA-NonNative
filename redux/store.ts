import { configureStore } from "@reduxjs/toolkit";
import { drugSlice } from "./features/drug/drugSlice";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "@/middleware/rootSaga";
import { statusSlice } from "./features/status/statusSlice";
import { errorStatusSlice } from "./features/errorstatus/errorStatusSlice";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: { drug: drugSlice.reducer, status: statusSlice.reducer, errorStatus: errorStatusSlice.reducer },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([sagaMiddleware])
});

sagaMiddleware.run(rootSaga);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;


