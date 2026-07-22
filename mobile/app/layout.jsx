import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="landing" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="utilaj/[id]" />
        <Stack.Screen name="adauga-utilaj" />
      </Stack>
    </>
  );
}