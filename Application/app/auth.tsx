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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../components/firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const background = require("../assets/images/background1.png");

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [_, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID", // replace with yours from Google Cloud Console
  });

  const handleEmailAuth = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      setError(e.message.replace("Firebase: ", "").replace(/ \(auth\/.*\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    const result = await promptAsync();
    if (result?.type === "success") {
      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      try {
        await signInWithCredential(auth, credential);
      } catch (e: any) {
        setError("Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <ImageBackground source={background} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>AirCalibre</Text>
          <Text style={styles.subtitle}>{isLogin ? "Sign in to continue" : "Create an account"}</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.5)"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.btn} onPress={handleEmailAuth} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{isLogin ? "Sign In" : "Register"}</Text>}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={[styles.btn, styles.googleBtn]} onPress={handleGoogle}>
            <Text style={styles.btnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError(""); }}>
            <Text style={styles.toggle}>
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
            </Text>
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
  title: { fontSize: 32, fontWeight: "200", color: "white", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", marginBottom: 24 },
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
    marginBottom: 12,
  },
  googleBtn: { backgroundColor: "rgba(66,133,244,0.3)", borderColor: "rgba(66,133,244,0.5)" },
  btnText: { color: "white", fontSize: 15, fontWeight: "500" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  dividerText: { color: "rgba(255,255,255,0.4)", marginHorizontal: 10, fontSize: 13 },
  toggle: { color: "rgba(255,255,255,0.6)", textAlign: "center", fontSize: 13, marginTop: 4 },
});