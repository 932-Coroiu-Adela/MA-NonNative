import { Entity } from "@/redux/features/entity/entity";
import { AppDispatch, RootState } from "@/redux/store";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet, Dimensions, Text, TouchableNativeFeedbackComponent, TouchableOpacity } from "react-native";
import { MD3Theme, useTheme, TextInput, HelperText, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export const DetailedPage = (props: {entityId?: number}) => {

    const { entityId } = props;
    
    const [entity, setEntity] = useState<Entity>({
            id: -1,
            date: "",
            amount: 0,
            type: "",
            category: "",
            description: ""
        });

    const entityDetails = useSelector((state: RootState) => state.entity.entityList.find(entity => entity.id === props.entityId));

    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const style = styles(theme);
    const navigation = useNavigation<any>(); //TODO: types...

    useEffect(() => {
        if(entityId){
            if(entityDetails){
                setEntity(entityDetails);
            }
        }
    }, [entityDetails]);
    
    return (
        <View style={style.mainMargin}>
            <View style={style.column}>
                <View style={style.chipMargin}>
                    <View style={style.chip}>
                        <Text style={style.chipLabel}>Transaction details</Text>
                    </View>
                </View>
            <View style={style.fieldList}>
           
            <View style={style.inputWrapper}>
                <View style={style.inputWrapper}>
                    <TextInput
                        label="Date"
                        value={entity.date}
                        editable={false}
                    />
                </View>

                <View style={style.inputWrapper}>
                    <TextInput
                        label="Amount"
                        value={entity?.amount.toString()}
                        editable={false}
                    />
                </View>

                <View style={style.inputWrapper}>
                    <TextInput
                        label="Type"
                        value={entity.type}
                        editable={false}
                    />
                </View>

                <View style={style.inputWrapper}>
                    <TextInput
                        label="Category"
                        value={entity.category}
                        editable={false}
                    />
                </View>

                <View style={style.inputWrapper}>
                    <TextInput
                        label="Description"
                        value={entity.description}
                        editable={false}
                    />
                </View>
            </View>

            <TouchableOpacity style={style.buttonRow} onPress={() => navigation.pop()}>
                <Text style={style.backButton}>Go back</Text>
            </TouchableOpacity>
        
        </View>
    </View>
</View>
    );

};

const styles = (theme: MD3Theme) => StyleSheet.create({
    mainMargin:{
        paddingTop: 63,
        paddingBottom: 62,
        paddingLeft: 62,
        paddingRight: 73,
        height: Dimensions.get('window').height,
        flex: 1
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.surface,
    },
    chipMargin: {
        paddingBottom: 25,
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
        padding: 5,
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
        borderWidth: 1,
        borderColor: theme.colors.outline,
        borderRadius: 15,
        width: "100%",
        height: 40,
        alignItems: 'center',
        gap: 8
    },
    inputWrapper: {
        marginBottom: 20,
        width: "100%"
    },
    backButton: {
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.bodyLarge.fontFamily,
        fontSize: theme.fonts.bodyLarge.fontSize,
        lineHeight: theme.fonts.bodyLarge.lineHeight,
        letterSpacing: theme.fonts.bodyLarge.letterSpacing,
        fontWeight: theme.fonts.bodyLarge.fontWeight,
        fontStyle: theme.fonts.bodyLarge.fontStyle,
        width: "100%",
        textAlign: "center"
    }

})