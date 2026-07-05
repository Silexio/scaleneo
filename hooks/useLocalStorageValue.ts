"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;

interface LocalStorageStore {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => string | null;
  getServerSnapshot: () => string | null;
  set: (value: string | null) => void;
}

const stores = new Map<string, LocalStorageStore>();

function createStore(key: string): LocalStorageStore {
  let memory: string | null = null;
  let memoryOnly = false;
  const listeners = new Set<Listener>();

  const notify = () => listeners.forEach((listener) => listener());

  return {
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot() {
      if (memoryOnly) return memory;
      try {
        return localStorage.getItem(key);
      } catch {
        memoryOnly = true;
        return memory;
      }
    },
    getServerSnapshot() {
      return null;
    },
    set(value) {
      memory = value;
      try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
      } catch {
        memoryOnly = true;
      }
      notify();
    },
  };
}

/**
 * Returns the singleton store behind a localStorage key, for reads/writes outside React rendering.
 */
export function getLocalStorageStore(key: string): LocalStorageStore {
  let store = stores.get(key);
  if (!store) {
    store = createStore(key);
    stores.set(key, store);
  }
  return store;
}

/**
 * React state backed by localStorage, synchronized across components and tabs.
 * Falls back to in-memory state when storage is unavailable (quota, private mode).
 */
export function useLocalStorageValue(
  key: string
): [string | null, (value: string | null) => void] {
  const store = getLocalStorageStore(key);
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return [value, store.set];
}
