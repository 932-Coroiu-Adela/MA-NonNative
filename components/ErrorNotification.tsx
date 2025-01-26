import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export const ErrorNotification = () => {
    const dispatch = useDispatch();
    const status = useSelector((state: RootState) => state.errorStatus);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (status.status) {
            setVisible(true);
        }
        else{
            setVisible(false);
        }
    }, [status.message]);
    const onDismiss = () => {
        dispatch({type: "errorStatus/setErrorStatus", payload: {status: false, message: ""}})
    };
    return (
        <View style={{ zIndex: 9999, flex: 1, justifyContent: 'center', position: 'absolute', width: '100%', bottom: 0, left: "50%", transform: [{ translateX: "-42%" }]}}>
            <Snackbar
                visible={visible}
                onDismiss={onDismiss}
                style={{ zIndex: 9999}}
                action={{
                    label: 'Dismiss',
                    onPress: () => {
                    setVisible(false);
                    },
                }}
            >   
                {status.message}
            </Snackbar>
        </View>
    );
}