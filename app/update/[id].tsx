import Form from "@/components/Form";
import { Link, useLocalSearchParams } from "expo-router";
import { Dimensions, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Update() {
    const { id } = useLocalSearchParams() as { id: string };
    const theme = useTheme();
    return (
      <View style={{width: "100%", backgroundColor:theme.colors.surface, height: Dimensions.get('window').height}}>
      <Form drugId={parseInt(id)} />
    </View>
  );
}
