import { DataSnapshot, Query, onValue } from "firebase/database";
import { ReadableAtom, atom, onMount } from "nanostores";

const cache: Map<string, ReadableAtom> = new Map();

export { cache as unstable_nanofireStoreCache };

function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
  if (map.has(key)) {
    return map.get(key)!;
  }
  const value = create();
  map.set(key, value);
  return value;
}

/**
 * Represents the result of an observable query.
 */
export interface ObservableResult<T> {
  /**
   * true if data is being loaded, false otherwise.
   */
  loading: boolean;

  /**
   * The loaded data, or undefined if data is still being loaded or an error occurred.
   */
  data?: T;

  /**
   * The error that occurred while loading the data.
   */
  error?: Error;
}

/**
 * Obtains a store that represents the result of a Firebase Realtime Database query.
 *
 * - The store state will begin with `{ loading: true }`.
 *
 * - Once the data is available, the store state will transition to `{ loading: false, data: DataSnapshot }`.
 *   This `data` will keep updating as the data changes in the database.
 *
 * - If an error occurs during loading (e.g. due to lack of permissions or network issues),
 *   or while listening to the data changes (e.g. access to the data has been revoked),
 *   the store state will transition to `{ loading: false, error: Error, data?: DataSnapshot }`.
 *   The `data` will be present if the error occurred after the data was loaded, letting you access the last successful data.
 *
 * @param query The query to observe.
 * @returns A store that represents the result of the query.
 */
export function getFirebaseDatabaseQueryStore(
  query: Query
): ReadableAtom<ObservableResult<DataSnapshot>> {
  return getOrCreate(cache, query.toString(), () => {
    const store = atom<ObservableResult<DataSnapshot>>({ loading: true });
    onMount(store, () => {
      return onValue(
        query,
        (snapshot) => {
          store.set({ loading: false, data: snapshot });
        },
        (error) => {
          store.set({ ...store.get(), loading: false, error });
        }
      );
    });
    return store;
  });
}

/**
 * Utility function to transform an `ObservableResult<T>` into an `ObservableResult<U>` using a mapping function.
 */
export function mapObservableResult<T, U>(
  result: ObservableResult<T>,
  map: (data: T) => U
): ObservableResult<U> {
  return "data" in result
    ? { ...result, data: map(result.data!) }
    : (result as ObservableResult<unknown> as ObservableResult<U>);
}
