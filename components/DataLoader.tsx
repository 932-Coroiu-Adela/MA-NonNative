import { initDB } from "@/database/localdb";
import React from "react";
import { useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";


export const DataLoader = () => {
    const dispatch = useDispatch();
    //using the dispatch hook to send actions to the redux store
    //in order to trigger reducers or middleware to handle the actions
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'entity/initialize' });
            dispatch({ type: 'entity/fetch' });
        };
        fetchData();
    }, [dispatch]);
    return (<View></View>);
};