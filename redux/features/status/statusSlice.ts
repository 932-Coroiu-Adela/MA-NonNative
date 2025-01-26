import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "./status";


export const statusSlice = createSlice({
    name: "status",
    initialState: { isOnline: false, isConnected: false } as Status,
    reducers: {
        setOnline: (state, action: PayloadAction<boolean>) => {
            state.isOnline = action.payload;
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        }
    }
});

export const { setOnline, setConnected } = statusSlice.actions
export default statusSlice.reducer