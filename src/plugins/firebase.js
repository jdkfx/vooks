import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FB_API_KEY,
  authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
  // databaseURL: process.env.VUE_APP_FB_DB_URL,
  projectId: process.env.VUE_APP_FB_PJ_ID,
  storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FB_APPID
}

firebase.initializeApp(firebaseConfig);

export var db = firebase.firestore();