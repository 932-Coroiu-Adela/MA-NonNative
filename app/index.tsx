import EntityList from "@/components/EntityList";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { useTheme } from "react-native-paper";


export default function Index() {
  const theme = useTheme();

  return (
    <View style={{width: "100%", backgroundColor:theme.colors.surface, height: Dimensions.get('window').height}}>
      <EntityList />
    </View>
  );
}

