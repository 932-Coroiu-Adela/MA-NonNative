import { Entity } from "@/redux/features/entity/entity";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Divider, MD3Theme, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React from "react";

export default function EntityDisplay(props: {entity: Entity, onUpdate: (entityId: number) => void, onDelete: (entityId: number) => void, onPressForDetails: (entityId: number) => void}) {
    const theme = useTheme();
    const style = styles(theme);
    const status = useSelector((state: RootState) => state.status);

    return (
        <View className="box" style={style.outerbox}>
            <View className="box" style={style.boxBackground} >
                
            </View>
            <View className="column" style={style.boxForeground}>
                <View style={style.rowHeadlineMargin}>
                    
                    <View className="row" style={style.rowHeadline}>
                        <TouchableOpacity style={style.wrapForRow} onPress={() => props.onPressForDetails(props.entity.id)}>
                            <View className="column" style={style.column}>
                                <Text style={style.nameText}>{props.entity.date}</Text>
                                <Text style={style.manufacturerText}>{props.entity.description}</Text>
                            </View>   
                        </TouchableOpacity> 
                        <View className="row" style={style.rowCTA}>
                            <Button disabled={!status.isConnected || !status.isOnline} contentStyle={{paddingHorizontal: 8}} textColor={theme.colors.primary} buttonColor={theme.colors.surface} style={style.editButton}  onPress={() => props.onUpdate(props.entity.id)}>Edit</Button>
                            <Button contentStyle={{paddingHorizontal: 8}} textColor={theme.colors.onPrimary} buttonColor={theme.colors.primary} onPress={() => props.onDelete(props.entity.id)} >Delete</Button>
                        </View>
                    </View>
                </View>
                {/*<Divider style={style.horizontalDivider} />
                 <View style={style.chipMargin}>
                    <View className="row" style={style.chip}>
                        <View className="box" style={style.labelChip}>
                            <Text style={style.label}>Amount:</Text>
                        </View>
                        <View className="box" style={style.valueChip}>
                            <Text style={style.value}>{props.entity.amount}</Text>
                        </View>
                    </View>
                </View>
                <View style={style.chipMargin}>
                    <View className="row" style={style.chip}>
                        <View className="box" style={style.labelChip}>
                            <Text style={style.label}>Type:</Text>
                        </View>
                        <View className="box" style={style.valueChip}>
                            <Text style={style.value}>{props.entity.type}</Text>
                        </View>
                    </View>
                </View>
                <View style={style.chipMargin}>
                    <View className="row" style={style.chip}>
                        <View className="box" style={style.labelChip}>
                            <Text style={style.label}>Category:</Text>
                        </View>
                        <View className="box" style={style.valueChip}>
                            <Text style={style.value}>{props.entity.category}</Text>
                        </View>
                    </View>
                </View> */}
            </View>
        </View>
  );
}

const styles = (theme: MD3Theme) => StyleSheet.create({
    boxBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderColor: theme.colors.outlineVariant,
        borderWidth: 1,
        zIndex: 10,
    },
    boxForeground: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: 16,
        top: 0,
        left: 0,
        zIndex: 20,
        
    },
    outerbox: {
        position: "relative",
        width: "100%",
        marginBottom: 8
    },
    rowHeadlineMargin:{
        marginTop: 16,
        marginRight: 16,
        marginBottom: 7,
        marginLeft: 16,
    },
    rowHeadline: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 44,
        
    },
    wrapForRow:{
        width: "40%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    column:{
        display: "flex",
        flexDirection: "column",
    },
    rowCTA: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    nameText:{
        color: theme.colors.onSurface,
        fontFamily: theme.fonts.bodyLarge.fontFamily,
        fontSize: theme.fonts.bodyLarge.fontSize,
        lineHeight: theme.fonts.bodyLarge.lineHeight,
        letterSpacing: theme.fonts.bodyLarge.letterSpacing,
        fontWeight: theme.fonts.bodyLarge.fontWeight,
        fontStyle: theme.fonts.bodyLarge.fontStyle
    },
    manufacturerText:{
        color: theme.colors.onSurfaceVariant,
        fontFamily: theme.fonts.bodyMedium.fontFamily,
        fontSize: theme.fonts.bodyMedium.fontSize,
        lineHeight: theme.fonts.bodyMedium.lineHeight,
        letterSpacing: theme.fonts.bodyMedium.letterSpacing,
        fontWeight: theme.fonts.bodyMedium.fontWeight,
        fontStyle: theme.fonts.bodyMedium.fontStyle
    },
    editButton:{
        borderWidth: 1,
        borderColor: theme.colors.outline,
    },
    horizontalDivider:{
        marginRight: 16,
        marginBottom: 16,
        marginLeft: 7,
    },

    chipMargin:{
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 7,
    },

    chip: { 
        display: "flex",
        flexDirection: "row",
        shadowRadius: 12, //TODO: shadow wack
        shadowOffset: { width: 2, height: 2 },
        width: "100%" ,
        height: 44,
        backgroundColor: theme.colors.surfaceDisabled,
        borderRadius: 12
    },
    lastChipMargin: {
        marginBottom: 40
    },
    labelChip: {
        height: "100%",
        width: "38%",
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    label: {
        color: theme.colors.onPrimary,
        textAlign: "center",
        fontFamily: theme.fonts.titleSmall.fontFamily,
        fontSize: theme.fonts.titleSmall.fontSize,
        lineHeight: theme.fonts.titleSmall.lineHeight,
        letterSpacing: theme.fonts.titleSmall.letterSpacing,
        fontWeight: theme.fonts.titleSmall.fontWeight,
        fontStyle: theme.fonts.titleSmall.fontStyle
    },
    valueChip: {
        height: "100%",
        width: "62%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    value: {
        color: theme.colors.onSurfaceVariant,
        textAlign: "center",
        fontFamily: theme.fonts.bodyMedium.fontFamily,
        fontSize: theme.fonts.bodyMedium.fontSize,
        lineHeight: theme.fonts.bodyMedium.lineHeight,
        letterSpacing: theme.fonts.bodyMedium.letterSpacing,
        fontWeight: theme.fonts.bodyMedium.fontWeight,
        fontStyle: theme.fonts.bodyMedium.fontStyle
    },
    
});