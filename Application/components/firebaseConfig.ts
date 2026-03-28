import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDj9pPHQKQrly2IfoLPcbof4Pr6qcGnXus",
  authDomain: "aircal-a9be6.firebaseapp.com",
  databaseURL: "https://aircal-a9be6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aircal-a9be6",
  storageBucket: "aircal-a9be6.firebasestorage.app",
  messagingSenderId: "1035560514949",
  appId: "1:1035560514949:web:19abbccc5250d544f280ec"
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);