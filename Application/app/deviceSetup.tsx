import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ref, set } from "firebase/database";
import { auth, database } from "../components/firebaseConfig";

const background = require("../assets/images/background1.png");

export default function DeviceSetupScreen() {
  const [deviceName, setDeviceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const name = deviceName.trim();
    if (!name) { setError("Please enter a device name."); return; }
    if (name.length > 30) { setError("Name must be 30 characters or less."); return; }

    setLoading(true);
    setError("");
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Not authenticated.");
      await set(ref(database, `users/${uid}/deviceName`), name);
      // _layout.tsx will detect the deviceName and navigate automatically
    } catch (e: any) {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={background} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>Name your device</Text>
          <Text style={styles.subtitle}>
            Give your AirCalibre sensor a name. This can not be changed later.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Living Room Sensor"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={deviceName}
            onChangeText={setDeviceName}
            maxLength={30}
            autoFocus
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.btn} onPress={handleSave} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Save & Continue</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "85%",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  title: { fontSize: 26, fontWeight: "200", color: "white", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", marginBottom: 24, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    padding: 12,
    color: "white",
    fontSize: 15,
    marginBottom: 12,
  },
  error: { color: "#ff6b6b", fontSize: 13, marginBottom: 10, textAlign: "center" },
  btn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  btnText: { color: "white", fontSize: 15, fontWeight: "500" },
});