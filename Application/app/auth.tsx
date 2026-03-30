import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [_, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
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
      const code = e?.code ?? "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Incorrect email or password.");
      } else if (code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Check your connection.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Email/password login is not enabled in Firebase Console.");
      } else {
        setError(code || e?.message || "An unknown error occurred.");
      }
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
      } catch {
        setError("Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        {/* Top: logo */}
        <View style={styles.top}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>
            {isLogin ? "Sign in to continue" : "Create an account"}
          </Text>
        </View>

        {/* Bottom: form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.25)"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.25)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleEmailAuth} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryBtnText}>{isLogin ? "Sign in" : "Register"}</Text>
            }
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle}>
            <View style={styles.googleLogo}>
              <Text style={{ color: "#4285F4", fontSize: 13, fontWeight: "700" }}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError(""); }}>
            <Text style={styles.toggle}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.toggleAccent}>{isLogin ? "Register" : "Sign in"}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const BG = "#0a0f1e";
const CARD = "rgba(255,255,255,0.05)";
const BORDER = "rgba(255,255,255,0.1)";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  kav: { flex: 1 },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: { width: 260, height: 120, marginBottom: 12 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.4)" },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 10,
  },
  input: {
    backgroundColor: CARD,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 15,
  },
  error: { color: "#F09595", fontSize: 13, textAlign: "center" },
  primaryBtn: {
    backgroundColor: "#185FA5",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "500" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: "rgba(255,255,255,0.1)" },
  dividerText: { color: "rgba(255,255,255,0.3)", fontSize: 12 },
  googleBtn: {
    backgroundColor: CARD,
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleLogo: {
    width: 20, height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnText: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "500" },
  toggle: { textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.35)", paddingTop: 2 },
  toggleAccent: { color: "#85B7EB" },
});