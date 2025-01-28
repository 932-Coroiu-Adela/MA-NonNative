import { Entity } from "@/redux/features/entity/entity";
import { AppDispatch, RootState } from "@/redux/store";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useEffect, useState } from "react";
import { Dimensions, Text, View, StyleSheet, ScrollView } from "react-native";
import { Button, HelperText, MD3Theme, TextInput, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function Form(props: {entityId?: number}) {
    const [entity, setEntity] = useState<Entity>({
        id: -1,
        date: "",
        amount: 0,
        type: "",
        category: "",
        description: "",
    });
    //const [price , setPrice] = useState("0");
    const updateEntity = useSelector((state: RootState) => state.entity.entityList.find(entity => entity.id === props.entityId));

    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const style = styles(theme);
    const navigation = useNavigation<any>(); //TODO: types...
    useEffect(() => {
        if(props.entityId){
            if(updateEntity){
                setEntity(updateEntity);
            }
        }
    }, [updateEntity]);

    const onSubmit = () => {
        if(props.entityId){
            dispatch({type: "entity/update", payload: entity});
        }
        else{
            dispatch({type: "entity/add", payload: entity});
        }
    }

    const isDisabled = () => {
        return entity.date === "" || entity.amount === 0 || entity.type === "" || entity.category === "" || entity.description === "";
    }

  return (
    <View style={style.container}> 
    <View style={style.chipMargin}>
                    <View style={style.chip}>
                        <Text style={style.chipLabel}>{props.entityId ? "Update Transaction" : "Add Transaction"}</Text>
                    </View>
                </View>

        <ScrollView style={style.mainMargin}>
            <View style={style.column}>
                
            <View style={style.fieldList}>
                <View style={style.inputWrapper}>
                    <TextInput
                        label="Date"
                        value={entity?.date}
                        onChangeText={(text) => {
                            setEntity({...entity, date: text} as Entity)
                        }}
                        right={<TextInput.Icon icon="close" onPress={() => setEntity({...entity, date: ""} as Entity)}/>}
                    />
                </View>

                <View style={style.inputWrapper}>
                    <TextInput
                        label="Amount"
                        value={entity?.amount.toString()}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                            setEntity({...entity, amount: parseInt(text)} as Entity)
                        }}
                        right={<TextInput.Icon icon="close" onPress={() => setEntity({...entity, amount: 0} as Entity)}/>}
                    />
                </View>

                <View style={style.inputWrapper}>
                    <TextInput
                        label="Type"
                        value={entity.type}
                        onChangeText={(text) => {
                            setEntity({...entity, type: text} as Entity)
                        }}
                        right={<TextInput.Icon icon="close" onPress={() => setEntity({...entity, type: ""} as Entity)}/>}
                    />
                </View>

                <View style={style.inputWrapper}>
                    <TextInput
                        label="Category"
                        value={entity.category}
                        onChangeText={(text) => {
                            setEntity({...entity, category: text} as Entity)
                        }}
                        right={<TextInput.Icon icon="close" onPress={() => setEntity({...entity, category: ""} as Entity)}/>}
                    />
                </View>

                <View style={style.inputWrapper}>
                    <TextInput
                        label="Description"
                        value={entity.description}
                        onChangeText={(text) => {
                            setEntity({...entity, description: text} as Entity)
                        }}
                        right={<TextInput.Icon icon="close" onPress={() => setEntity({...entity, description: ""} as Entity)}/>}
                    />
                </View>
            </View>

            
        </View>
        </ScrollView>
        <View style={style.buttonRow}>
                <Button mode="outlined" onPress={() => navigation.pop()}>Cancel</Button>
                <Button mode="contained"
                    textColor={theme.colors.onPrimary} 
                    buttonColor={theme.colors.primary}
                    onPress={() => {
                        if(!isDisabled())
                        {
                            onSubmit();
                            navigation.pop();
                        }
                }}>{props.entityId ? "Update" : "Add"}</Button>
            </View>
    </View>
    
  );
}

const styles = (theme: MD3Theme) => StyleSheet.create({
    container:{
        height: "70%",
    },
    mainMargin:{
        width: '80%',
        height: '20%',
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 20,
        padding: 20,
        borderRadius: 20,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.surface,
    },
    chipMargin: {
        paddingTop: 35,
        paddingBottom: 5,
        paddingLeft: 61,
        paddingRight: 61,
    },
    chip: {
        height: 49,
        width: "100%",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    chipLabel: {
        color: theme.colors.onSurface,
        textAlign: "center",
        fontFamily: theme.fonts.labelLarge.fontFamily,
        fontSize: theme.fonts.labelLarge.fontSize,
        lineHeight: theme.fonts.labelLarge.lineHeight,
        letterSpacing: theme.fonts.labelLarge.letterSpacing,
        fontWeight: theme.fonts.labelLarge.fontWeight,
        fontStyle: theme.fonts.labelLarge.fontStyle

    },
    fieldList: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 30,
        width: "100%"
    },
    buttonRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8
    },
    inputWrapper: {
        marginBottom: 16,
        width: "100%"
    }

})