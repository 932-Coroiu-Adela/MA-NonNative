import { Entity } from "@/redux/features/entity/entity";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { RootState, AppDispatch } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import EntityDisplay from "./EntityDisplay";
import { FAB, MD3Theme, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import DeletePopUp from "./DeletePopUp";
import { entitySlice, removeEntity } from "@/redux/features/entity/entitySlice";
import { ConnectionNotification } from "./ConnectionNotification";
import { ErrorNotification } from "./ErrorNotification";

export default function EntityList() {
    const entities: Entity[] = useSelector((state: RootState) => state.entity.entityList);
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const style = styles(theme);
    const navigation = useNavigation<any>(); //TODO: types...

    const [deleteIndex, useDeleteIndex] = useState(-1)

    return (
        <View style={style.listMargin}>
            <ConnectionNotification />
            {/* <ErrorNotification /> */}
            <FAB
                color={theme.colors.onPrimary}
                style={style.fab}
                icon="pencil-outline"
                mode="elevated"
                onPress={() => {
                    navigation.navigate("add");
                }}
            />
            {deleteIndex != -1 ? 
            <DeletePopUp 
                entityId={deleteIndex}
                onCancel = {() => {
                    useDeleteIndex(-1)
                }}
                onDelete = {() => {
                    dispatch({type: "entity/remove", payload: deleteIndex})
                    useDeleteIndex(-1)
                }}
            /> : null}
            <FlatList style={style.list}
                data={entities}
                renderItem={({item})=>
                <EntityDisplay
                    key={item.id}
                    entity={item}
                    onUpdate={(entityId: number) => {
                        navigation.navigate("update/[id]", {id: item.id});
                    }}
                    onDelete={(entityId: number) => {
                        useDeleteIndex(entityId)
                    }} 
                    onPressForDetails={(entityId: number) => {
                        console.log("Pressed for details");
                        navigation.navigate("view/[id]", {id: item.id});
                    }}
                    />}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
            />
        </View>
  );
}

const styles = (theme: MD3Theme) => StyleSheet.create({
    listMargin:{
        paddingTop: 75.5,
        paddingBottom: 23.5,
        paddingLeft: 26,
        paddingRight: 26,
        height: Dimensions.get('window').height,
        flex: 1
    },
    list: {
        backgroundColor: theme.colors.surface,
        height: "100%"
    },
    fab: { 
        position: 'absolute', 
        margin: 48, 
        right: 0, 
        bottom: 0, 
        zIndex: 30, 
        borderRadius: 30, 
        backgroundColor: theme.colors.surface
    }
})