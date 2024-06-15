// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore  } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {getAuth , setPersistence , inMemoryPersistence} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGESENDERID,
  appId: import.meta.env.VITE_APPID
};

// Initialize Firebase
let firebaseApp;

if (!getApps().length){
firebaseApp = initializeApp(firebaseConfig)
}else{
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig)
}
 // Get the storage instance


export const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp)
export const storage = getStorage(firebaseApp);

