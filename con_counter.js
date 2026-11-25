import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
import { getDatabase, ref, update, increment } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

const PAGE_NAME = "DateCalculator";

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

function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

try {
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);

  const database = getDatabase(app);
  const path = `DailyConnection/${getTodayString()}/${PAGE_NAME}/DayCount`;
  update(ref(database), { [path]: increment(1) }).catch(() => {});
} catch (_) {
  // 오프라인 또는 차단 환경에서도 메인 앱 동작에 영향을 주지 않음
}
