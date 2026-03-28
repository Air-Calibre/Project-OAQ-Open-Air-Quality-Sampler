import { Buffer } from "buffer";
import { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { ref, onValue, off, push, set } from "firebase/database";
import { signOut } from "firebase/auth";
import { auth, database } from "./firebaseConfig";

const background = require("../assets/images/background1.png");

const AQI_SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const DATA_CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const DEVICE_NAME = "AirCalibre";

const AQI = () => {
  const [temp, setTemp] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [pm25, setPm25] = useState(0);
  const [pm10, setPm10] = useState(0);
  const [aqi, setAqi] = useState(0);
  const [dataSource, setDataSource] = useState<"BLE" | "FIREBASE">("BLE");
  const [deviceName, setDeviceName] = useState("");

  const managerRef = useRef<BleManager | null>(null);
  if (!managerRef.current) {
    managerRef.current = new BleManager();
  }
  const manager = managerRef.current;

  // Load device name for this user
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const nameRef = ref(database, `users/${uid}/deviceName`);
    const unsub = onValue(nameRef, (snap) => {
      if (snap.exists()) setDeviceName(snap.val());
    });
    return () => off(nameRef);
  }, []);

  // Save a reading to Firebase under this user's device
  const saveReading = (t: number, h: number, p25: number, p10: number, a: number) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const readingsRef = ref(database, `users/${uid}/readings`);
    push(readingsRef, {
      temperature: t,
      humidity: h,
      pm25: p25,
      pm10: p10,
      aqi: a,
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

      // Read the latest reading from this user's device
      firebaseRef = ref(database, `users/${uid}/readings`);
      onValue(firebaseRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        // Get the most recent entry
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
        if (error) {
          console.log("Scan error:", error);
          startFirebaseMode();
          return;
        }
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
          AQI_SERVICE_UUID,
          DATA_CHAR_UUID,
          (error, characteristic) => {
            if (error) {
              startFirebaseMode();
              return;
            }
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
              // pm25/pm10 not yet in BLE payload — set to 0
              setPm25(0);
              setPm10(0);
              saveReading(t, h, 0, 0, a);
            }
          }
        );
      } catch (err) {
        startFirebaseMode();
      }
    };

    const init = async () => {
      const granted = await requestPermissions();
      if (!granted) {
        startFirebaseMode();
        return;
      }
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

  return (
    <ImageBackground source={background} style={styles.container}>
      <Text style={styles.source}>Source: {dataSource}</Text>
      {deviceName ? <Text style={styles.deviceLabel}>{deviceName}</Text> : null}

      <TouchableOpacity style={styles.signOut} onPress={() => signOut(auth)}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>

      <View style={styles.tempWrapper}>
        <Text style={styles.text}>AQI: {aqi}</Text>
      </View>

      <View style={styles.data}>
        <View style={styles.Wrapper}>
          <View style={styles.dataWrapper}>
            <Text style={styles.dataText}>{pm25} μg/m³{"\n"}PM 2.5</Text>
          </View>
          <View style={styles.dataWrapper}>
            <Text style={styles.dataText}>{temp}°C{"\n"}Temperature</Text>
          </View>
          <View style={styles.dataWrapper}>
            <Text style={styles.dataText}>{pm10} μg/m³{"\n"}PM 10</Text>
          </View>
          <View style={styles.dataWrapper}>
            <Text style={styles.dataText}>{humidity}%{"\n"}Humidity</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  source: { position: "absolute", top: 40, alignSelf: "center", color: "white", fontSize: 14 },
  deviceLabel: { position: "absolute", top: 58, alignSelf: "center", color: "rgba(255,255,255,0.5)", fontSize: 12 },
  signOut: { position: "absolute", top: 40, right: 20 },
  signOutText: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  tempWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 75, fontWeight: "100", color: "white" },
  data: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
  dataWrapper: {
    backgroundColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
    marginVertical: 7,
  },
  dataText: { fontSize: 28, fontWeight: "200", color: "white", textAlign: "center" },
  Wrapper: { width: "90%", height: "60%", flexWrap: "wrap" },
});

export default AQI;