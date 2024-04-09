import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { assert } from "jsr:@std/assert@^0.221.0";
import { getFirebaseDatabaseQueryStore } from "./mod.ts";

const app = initializeApp({
  apiKey: "AIzaSyDLDD_KtKkfAj9sgOHupxUuDt_p8g19bkU",
  authDomain: "fiery-react.firebaseapp.com",
  databaseURL: "https://fiery-react.firebaseio.com",
  projectId: "fiery-react",
  storageBucket: "",
  messagingSenderId: "284926450412",
});

const db = getDatabase(app);

Deno.test({
  name: "can load data",
  fn: async () => {
    const dbRef = ref(db, "demos/counter");
    const store = getFirebaseDatabaseQueryStore(dbRef);
    await new Promise<void>((resolve, reject) => {
      store.subscribe((value) => {
        if (value.error) {
          reject(value.error);
        } else if (value.data && !value.loading) {
          assert(typeof value.data.val() === "number");
          resolve();
        }
      });
    });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
