[Nano Stores](https://github.com/nanostores/nanostores) bindings for [Firebase Realtime Database](https://firebase.google.com/docs/database). The state shape in the store is compatible with [Nano Stores Query](https://github.com/nanostores/query).

## Installation

```js
npx jsr add @nanofire/database
```

## Synopsis

```js
import { getFirebaseDatabaseQueryStore } from "@nanofire/database";

// Get a query
const query = ref(db, "path/to/data");

// Get a store corresponding to the query
const $snapshot = getFirebaseDatabaseQueryStore(query);

// Use it as with any other Nano Store
$snapshot.subscribe((state) => {
  // Initial state: { loading: true }
  // When loaded:   { loading: false, data: DataSnapshot }
  console.log(state);
});
```
