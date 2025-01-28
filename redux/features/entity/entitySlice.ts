import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Entity, EntityState } from "./entity";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { initDB, insertEntity } from "@/database/localdb";


const initialState: EntityState = {
    entityList: [],
};


export const entitySlice = createSlice({
    name: "entity",
    initialState,
    reducers: {
        addEntity: (state, action: PayloadAction<Entity>) => {
            state.entityList.push(action.payload);
        },
        removeEntity: (state, action: PayloadAction<number>) => {
            console.log("Removing entity with id: ", action.payload);
            state.entityList = state.entityList.filter(entity => entity.id !== action.payload);
        },
        updateEntity: (state, action: PayloadAction<Entity>) => {
            console.log("Updating entity with id: ", action.payload.id);
            console.log(action.payload);
            const index = state.entityList.findIndex(entity => entity.id === action.payload.id);
            if (index !== -1) {
                state.entityList[index] = action.payload;
            }
            console.log(state.entityList);
        },
        fetchEntities: (state, action: PayloadAction<Entity[]>) => {
            state.entityList = action.payload;
        }
    },
});

export const { addEntity: addEntity, removeEntity: removeEntity, updateEntity: updateEntity, fetchEntities: fetchEntities } = entitySlice.actions
export default entitySlice.reducer