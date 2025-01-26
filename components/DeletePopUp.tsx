import { StyleSheet } from "react-native";
import React from "react";
import { Button, Dialog, MD3Theme, Portal, useTheme, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function DeletePopUp(props: {drugId: number, onCancel: () => void, onDelete: () => void}) {
    const theme = useTheme();
    const style = styles(theme);
    const navigation = useNavigation<any>(); //TODO: types...

    return (
        <Portal>
            <Dialog
                visible={true}
            >
                <Dialog.Title>Delete Drug</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">Are you sure you want to delete this drug? This action can not be reversed</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button contentStyle={{paddingHorizontal: 8}} mode="contained" onPress={props.onCancel}>Cancel</Button>
                    <Button contentStyle={{paddingHorizontal: 8}} mode="contained" onPress={props.onDelete}>Delete</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
  );
}

const styles = (theme: MD3Theme) => StyleSheet.create({
    
})