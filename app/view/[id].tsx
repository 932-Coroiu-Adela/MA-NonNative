import Form from "@/components/Form";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Dimensions } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import { DetailedPage } from "@/components/DetailedPage";

export default function ViewDetails() {
    const { id } = useLocalSearchParams() as { id: string };
    const theme = useTheme();
    return (
      <View style={{width: "100%", backgroundColor:theme.colors.surface, height: Dimensions.get('window').height}}>
      <DetailedPage entityId={parseInt(id)} />
    </View>
  );
}
