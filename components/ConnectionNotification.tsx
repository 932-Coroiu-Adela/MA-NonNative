import { RootState } from "@/redux/store";
import React from "react";
import { useState, useEffect } from "react";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export const ConnectionNotification = () => {
    const dispatch = useDispatch();
    const status = useSelector((state: RootState) => state.status);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!status.isConnected || !status.isOnline) {
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    }, [status.isConnected, status.isOnline]);
    const onDismiss = () => {
        setVisible(false);
    };
    return (
    <Snackbar
        wrapperStyle={{ top: 50, left: "50%", position: 'absolute', transform: [{ translateX: "-42%" }], zIndex: 9999}}
        visible={visible}
        onDismiss={onDismiss}
        style={{ zIndex: 9999,  }}
        action={{
            label: 'Dismiss',
            onPress: () => {
            setVisible(false);
            },
        }}
        duration={60000}>
        
        No internet connection
    </Snackbar>
    );
}