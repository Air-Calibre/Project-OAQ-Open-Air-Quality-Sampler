import { Buffer } from "buffer";
import { useEffect, useRef, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { ref, onValue, off, push } from "firebase/database";
import { signOut } from "firebase/auth";
import { auth, database } from "./firebaseConfig";

const AQI_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const DATA_CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const DEVICE_NAME = "AirCalibre";

const getAqiStatus = (aqi: number): { label: string; color: string; bg: string } => {
  if (aqi <= 50)  return { label: "Good",     color: "#97C459", bg: "rgba(99,153,34,0.2)"   };
  if (aqi <= 100) return { label: "Moderate", color: "#EF9F27", bg: "rgba(186,117,23,0.2)"  };
  if (aqi <= 150) return { label: "Poor",     color: "#F0997B", bg: "rgba(216,90,48,0.2)"   };
  return              { label: "Critical",    color: "#F09595", bg: "rgba(226,75,74,0.2)"   };
};

const AQI = () => {
  const [temp, setTemp] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [pm25, setPm25] = useState(0);
  const [pm10, setPm10] = useState(0);
  const [aqi, setAqi] = useState(0);
  const [dataSource, setDataSource] = useState<"BLE" | "FIREBASE">("BLE");

  const managerRef = useRef<BleManager | null>(null);
  if (!managerRef.current) managerRef.current = new BleManager();
  const manager = managerRef.current;

  const saveReading = (t: number, h: number, p25: number, p10: number, a: number) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    push(ref(database, `users/${uid}/readings`), {
      temperature: t, humidity: h, pm25: p25, pm10: p10, aqi: a,
      timestamp: Date.now(),
    });
  };

  useEffect(() => {
    let stateSubscription: any;
    let connectedDevice: Device | null = null;
    let bleTimeout: ReturnType<typeof setTimeout>;
    let firebaseRef: any = null;

    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return Object.values(result).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );
      }
      return true;
    };

    const startFirebaseMode = () => {
      setDataSource("FIREBASE");
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      firebaseRef = ref(database, `users/${uid}/readings`);
      onValue(firebaseRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        const keys = Object.keys(data);
        const latest = data[keys[keys.length - 1]];
        setTemp(latest.temperature ?? 0);
        setHumidity(latest.humidity ?? 0);
        setPm25(latest.pm25 ?? 0);
        setPm10(latest.pm10 ?? 0);
        setAqi(latest.aqi ?? 0);
      });
    };

    const scanAndConnect = () => {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) { startFirebaseMode(); return; }
        if (device && (device.name === DEVICE_NAME || device.localName === DEVICE_NAME)) {
          manager.stopDeviceScan();
          clearTimeout(bleTimeout);
          connectToDevice(device);
        }
      });
      bleTimeout = setTimeout(() => {
        manager.stopDeviceScan();
        startFirebaseMode();
      }, 7000);
    };

    const connectToDevice = async (device: Device) => {
      try {
        connectedDevice = await device.connect();
        await connectedDevice.discoverAllServicesAndCharacteristics();
        setDataSource("BLE");

        connectedDevice.monitorCharacteristicForService(
          AQI_SERVICE_UUID, DATA_CHAR_UUID,
          (error, characteristic) => {
            if (error) { startFirebaseMode(); return; }
            if (!characteristic?.value) return;

            const decoded = Buffer.from(characteristic.value, "base64").toString("utf-8");
            const values = decoded.split(",");

            if (values.length >= 3) {
              const t = parseFloat(values[0]);
              const h = parseFloat(values[1]);
              const a = parseFloat(values[2]);
              setTemp(t);
              setHumidity(h);
              setAqi(a);
              setPm25(0);
              setPm10(0);
              saveReading(t, h, 0, 0, a);
            }
          }
        );
      } catch {
        startFirebaseMode();
      }
    };

    const init = async () => {
      const granted = await requestPermissions();
      if (!granted) { startFirebaseMode(); return; }
      stateSubscription = manager.onStateChange((state) => {
        if (state === "PoweredOn") {
          scanAndConnect();
          stateSubscription.remove();
        }
      }, true);
    };

    init();

    return () => {
      clearTimeout(bleTimeout);
      manager.stopDeviceScan();
      connectedDevice?.cancelConnection();
      stateSubscription?.remove();
      manager.destroy();
      if (firebaseRef) off(firebaseRef);
    };
  }, []);

  const status = getAqiStatus(aqi);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.topbar}>
          <Text style={styles.appName}>AirCalibre</Text>
          <View style={styles.topRight}>
            <View style={[styles.sourcePill, dataSource === "BLE" ? styles.pillBle : styles.pillFb]}>
              <Text style={[styles.pillText, dataSource === "BLE" ? styles.pillTextBle : styles.pillTextFb]}>
                {dataSource}
              </Text>
            </View>
            <TouchableOpacity onPress={() => signOut(auth)}>
              <Text style={styles.signOut}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.aqiCard}>
          <Text style={styles.aqiLabel}>AIR QUALITY INDEX</Text>
          <Text style={styles.aqiValue}>{Math.round(aqi)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>PM 2.5</Text>
            <Text style={styles.metricValue}>{pm25}<Text style={styles.metricUnit}> μg/m³</Text></Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>PM 10</Text>
            <Text style={styles.metricValue}>{pm10}<Text style={styles.metricUnit}> μg/m³</Text></Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Temperature</Text>
            <Text style={styles.metricValue}>{temp.toFixed(1)}<Text style={styles.metricUnit}>°C</Text></Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Humidity</Text>
            <Text style={styles.metricValue}>{Math.round(humidity)}<Text style={styles.metricUnit}>%</Text></Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={() => { /* TODO */ }}>
          <Text style={styles.submitText}>Submit to sensor.community</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const BG = "#0a0f1e";
const CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 14 },
  topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  appName: { fontSize: 18, fontWeight: "500", color: "#fff" },
  topRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  sourcePill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  pillBle: { backgroundColor: "rgba(29,158,117,0.2)" },
  pillFb:  { backgroundColor: "rgba(55,138,221,0.15)" },
  pillText: { fontSize: 11, fontWeight: "500" },
  pillTextBle: { color: "#5DCAA5" },
  pillTextFb:  { color: "#85B7EB" },
  signOut: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
  aqiCard: {
    backgroundColor: CARD, borderWidth: 0.5, borderColor: BORDER,
    borderRadius: 20, padding: 24, alignItems: "center",
  },
  aqiLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 4 },
  aqiValue: { fontSize: 80, fontWeight: "200", color: "#fff", lineHeight: 88 },
  statusBadge: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "500" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metric: {
    width: "48%", backgroundColor: CARD, borderWidth: 0.5,
    borderColor: BORDER, borderRadius: 16, padding: 14,
  },
  metricLabel: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4 },
  metricValue: { fontSize: 22, fontWeight: "300", color: "#fff" },
  metricUnit: { fontSize: 11, color: "rgba(255,255,255,0.35)" },
  submitBtn: {
    backgroundColor: "rgba(55,138,221,0.15)", borderWidth: 0.5,
    borderColor: "rgba(55,138,221,0.35)", borderRadius: 14,
    padding: 16, alignItems: "center",
  },
  submitText: { fontSize: 14, fontWeight: "500", color: "#85B7EB" },
});

export default AQI;