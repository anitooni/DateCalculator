// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7s95oaj498XdArjo9cT_8watLVw4JK3M",
  authDomain: "aptrank-cc61b.firebaseapp.com",
  projectId: "aptrank-cc61b",
  storageBucket: "aptrank-cc61b.appspot.com",
  messagingSenderId: "987401326011",
  appId: "1:987401326011:web:8732d04a9fc69280d7489e",
  measurementId: "G-BH5DRBH380",
  databaseURL: "https://aptrank-cc61b-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);    

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database()  
const dbRef = firebase.database().ref();

export function checkCounter(pageName){
  dbRef.child(today_str).get().then((snapshot) => {
    if (snapshot.exists()) {
      countUp(pageName)
    } else {
      addDB()
    }
  }).catch((error) => {
    console.error(error);
  });
}

function addDB(){
    // 데이터 저장  
  database.ref("DailyConnection/" + today_str+"/DateCalculator").set({
    "DayCount": 0,    
  })  
}

export function countUp(pageName) {
  const updates = {};  
  updates["DailyConnection/" + today_str + "/" + pageName + "/DayCount"] = firebase.database.ServerValue.increment(1);    
  firebase.database().ref().update(updates);
}

checkCounter(pageName)
