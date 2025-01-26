import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Drug, DrugState } from "./drug";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { initDB, insertDrug } from "@/database/localdb";


const initialState: DrugState = {
    drugList: [],
};


export const drugSlice = createSlice({
    name: "drug",
    initialState,
    reducers: {
        addDrug: (state, action: PayloadAction<Drug>) => {
            state.drugList.push(action.payload);
        },
        removeDrug: (state, action: PayloadAction<number>) => {
            console.log("Removing drug with id: ", action.payload);
            state.drugList = state.drugList.filter(drug => drug.id !== action.payload);
        },
        updateDrug: (state, action: PayloadAction<Drug>) => {
            console.log("Updating drug with id: ", action.payload.id);
            console.log(action.payload);
            const index = state.drugList.findIndex(drug => drug.id === action.payload.id);
            if (index !== -1) {
                state.drugList[index] = action.payload;
            }
            console.log(state.drugList);
        },
        fetchDrugs: (state, action: PayloadAction<Drug[]>) => {
            state.drugList = action.payload;
        }
    },
});

export const { addDrug, removeDrug, updateDrug, fetchDrugs } = drugSlice.actions
export default drugSlice.reducer