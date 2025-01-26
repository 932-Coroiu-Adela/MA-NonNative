import { store } from "@/redux/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { StatusBar, useColorScheme, Text } from "react-native";
import { DataLoader } from "@/components/DataLoader";


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const {theme} = useMaterial3Theme();
  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };
  return (
  <Provider store={store}>
      <DataLoader />
      <PaperProvider theme={paperTheme}>
        <StatusBar
          hidden={true}
        />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="add" options={{ headerShown: false }} />
          <Stack.Screen name="update/[id]" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
  </Provider>
  );
}
