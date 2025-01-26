import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorStatus } from "./errorStatus";


export const errorStatusSlice = createSlice({
    name: "status",
    initialState: { status: false, message: "" } as ErrorStatus,
    reducers: {
        setErrorStatus: (state, action: PayloadAction<ErrorStatus>) => {
            state.status = action.payload.status;
            state.message = action.payload.message;
        },
    }
});

export const { setErrorStatus } = errorStatusSlice.actions
export default errorStatusSlice.reducer