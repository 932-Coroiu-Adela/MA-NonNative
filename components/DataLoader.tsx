import { initDB } from "@/database/localdb";
import { useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";


export const DataLoader = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'drug/initialize' });
            dispatch({ type: 'drug/fetch' });
        };
        fetchData();
    }, [dispatch]);
    return (<View></View>);
};