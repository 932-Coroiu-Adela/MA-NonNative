import { Drug } from "@/redux/features/drug/drug";
import { AppDispatch, RootState } from "@/redux/store";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import { Button, HelperText, MD3Theme, TextInput, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function Form(props: {drugId?: number}) {
    const [drug, setDrug] = useState<Drug>({
        id: -1,
        name: "",
        manufacturer: "",
        category: "",
        price: 0,
        numberOfUnits: 0
    });
    const [price , setPrice] = useState("0");
    const updateDrug = useSelector((state: RootState) => state.drug.drugList.find(drug => drug.id === props.drugId));

    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const style = styles(theme);
    const navigation = useNavigation<any>(); //TODO: types...
    useEffect(() => {
        if(props.drugId){
            if(updateDrug){
                setDrug(updateDrug);
                setPrice(updateDrug.price.toFixed(2));
            }
        }
    }, [updateDrug]);

    const onSubmit = () => {
        if(props.drugId){
            dispatch({type: "drug/update", payload: drug});
        }
        else{
            dispatch({type: "drug/add", payload: drug});
        }
    }

    const isDisabled = () => {
        return drug.name === "" || drug.manufacturer === "" || drug.category === "" || drug.price === 0 || drug.numberOfUnits === 0;
    }

  return (
    <View style={style.mainMargin}>
      <View style={style.column}>
        <View style={style.chipMargin}>
            <View style={style.chip}>
                <Text style={style.chipLabel}>{props.drugId ? "Update Drug" : "Add Drug"}</Text>
            </View>
        </View>
        <View style={style.fieldList}>
            <View style={style.inputWrapper}>
                <TextInput
                    label="Name"
                    value={drug?.name}
                    onChangeText={(text) => {
                        setDrug({...drug, name: text} as Drug)
                    }}
                    right={<TextInput.Icon icon="close" onPress={() => setDrug({...drug, name: ""} as Drug)}/>}
                />
                <HelperText type="error" visible={true}>*required</HelperText>
            </View>
            <View style={style.inputWrapper}>
                <TextInput
                    label="Manufacturer"
                    value={drug?.manufacturer}
                    onChangeText={(text) => {
                        setDrug({...drug, manufacturer: text} as Drug)
                    }}
                    right={<TextInput.Icon icon="close" onPress={() => setDrug({...drug, manufacturer: ""} as Drug)}/>}
                />
                <HelperText type="error" visible={true}>*required</HelperText>
            </View>
            <View style={style.inputWrapper}>
                <TextInput
                    label="Category"
                    value={drug?.category}
                    onChangeText={(text) => {
                        setDrug({...drug, category: text} as Drug)
                    }}
                    right={<TextInput.Icon icon="close" onPress={() => setDrug({...drug, category: ""} as Drug)}/>}
                />
                <HelperText type="error" visible={true}>*required</HelperText>
            </View>
            <View style={style.inputWrapper}>
                <TextInput
                    label="Number of Units"
                    value={drug?.numberOfUnits.toString()}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        if(text === ""){
                            setDrug({...drug, numberOfUnits: 0} as Drug)
                        }
                        else{
                            setDrug({...drug, numberOfUnits: parseInt(text)} as Drug)
                        }
                    }}
                    right={<TextInput.Icon icon="close" onPress={() => setDrug({...drug, numberOfUnits: 0} as Drug)}/>}
                />
                <HelperText type="error" visible={true}>*required</HelperText>
            </View>
            <View style={style.inputWrapper}>
                <TextInput
                    label="Price"
                    value={price}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        setPrice(text);
                        if(text === "" || isNaN(Number(text)) || text[text.length - 1] === '.'){
                            setDrug({...drug, price: 0} as Drug)
                        }
                        else{
                            setPrice(parseFloat(text).toString());
                            setDrug({...drug, price: parseFloat(text)} as Drug)
                        }
                    }}
                    right={<TextInput.Icon icon="close" onPress={() => {setDrug({...drug, price: 0} as Drug); setPrice("")}}/>}
                    left={<TextInput.Affix text="$ " />}
                />
                <HelperText type="error" visible={true}>*required</HelperText>
            </View>
        </View>
        <View style={style.buttonRow}>
            <Button mode="outlined" onPress={() => navigation.navigate("index")}>Cancel</Button>
            <Button mode="contained"
                textColor={theme.colors.onPrimary} 
                buttonColor={theme.colors.primary}
                onPress={() => {
                    if(!isDisabled())
                    {
                        onSubmit();
                        navigation.navigate("index")
                    }
            }}>{props.drugId ? "Update" : "Add"}</Button>
        </View>
      </View>
    </View>
  );
}

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