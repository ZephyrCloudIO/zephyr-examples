import { useState, useEffect, useCallback } from "react";

interface StorageOptions<T> {
  // Optional serializer/deserializer functions
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  // Optional error handler
  onError?: (error: Error) => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: StorageOptions<T> = {}
) {
  // Default serializer/deserializer
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError = console.error
  } = options;

  // Initialize state with a function to avoid unnecessary
  // localStorage access on every render
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return deserializer(item);
      }

      // Handle initial value if it's a function
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Storage error"));
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  // Update localStorage when the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, serializer(storedValue));
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Storage error"));
    }
  }, [key, storedValue, serializer, onError]);

  // Provide a way to update the value
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
      } catch (error) {
        onError(error instanceof Error ? error : new Error("Storage error"));
      }
    },
    [storedValue, onError]
  );

  // Provide a way to remove the value
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(
        initialValue instanceof Function ? initialValue() : initialValue
      );
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Storage error"));
    }
  }, [key, initialValue, onError]);

  return [storedValue, setValue, removeValue] as const;
}

// Type helpers for common data types
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// Custom serializers for non-JSON types
export const dateSerializer = {
  serializer: (date: Date) => date.toISOString(),
  deserializer: (str: string) => new Date(str)
};

export const setSerializer = {
  serializer: (set: Set<unknown>) => JSON.stringify(Array.from(set)),
  deserializer: (str: string) => new Set(JSON.parse(str))
};

export const mapSerializer = {
  serializer: (map: Map<unknown, unknown>) =>
    JSON.stringify(Array.from(map.entries())),
  deserializer: (str: string) => new Map(JSON.parse(str))
};
