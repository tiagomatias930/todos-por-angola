import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/src/config/theme";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </PaperProvider>
  );
}
