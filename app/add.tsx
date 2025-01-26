import DrugList from "@/components/DrugList";
import Form from "@/components/Form";
import { Link } from "expo-router";
import { Dimensions, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Add() {
  const theme = useTheme();
  return (
    <View style={{width: "100%", backgroundColor:theme.colors.surface, height: Dimensions.get('window').height}}>
      <Form />
    </View>
  );
}
