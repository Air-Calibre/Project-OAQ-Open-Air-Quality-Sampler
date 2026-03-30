import "expo-dev-client";
import { useEffect, useState } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../components/firebaseConfig";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View, ActivityIndicator } from "react-native";

type AppState = "loading" | "unauthenticated" | "needsDevice" | "ready";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [appState, setAppState] = useState<AppState>("loading");

  useEffect(() => {
    let deviceUnsub: (() => void) | null = null;

    const authUnsub = onAuthStateChanged(auth, (user: User | null) => {
      if (deviceUnsub) { deviceUnsub(); deviceUnsub = null; }

      if (!user) {
        setAppState("unauthenticated");
        return;
      }

      // User is signed in — check if they've set a device name
      const deviceRef = ref(database, `users/${user.uid}/deviceName`);
      deviceUnsub = onValue(deviceRef, (snapshot) => {
        if (snapshot.exists()) {
          setAppState("ready");
        } else {
          setAppState("needsDevice");
        }
      });
    });

    return () => {
      authUnsub();
      if (deviceUnsub) deviceUnsub();
    };
  }, []);

  // Handle navigation based on app state
  useEffect(() => {
    if (appState === "loading") return;

    const inAuthGroup = segments[0] === "auth";
    const inSetupGroup = segments[0] === "deviceSetup";

    if (appState === "unauthenticated" && !inAuthGroup) {
      router.replace("/auth");
    } else if (appState === "needsDevice" && !inSetupGroup) {
      router.replace("/deviceSetup");
    } else if (appState === "ready" && (inAuthGroup || inSetupGroup)) {
      router.replace("/");
    }
  }, [appState, segments]);

  if (appState === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}