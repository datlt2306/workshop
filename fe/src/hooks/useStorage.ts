import { useCallback, useState, useEffect } from "react";

type StorageType = typeof window.localStorage | typeof window.sessionStorage;

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
    return useStorage(key, defaultValue, window.localStorage);
}

export function useSessionStorage<T>(key: string, defaultValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
    return useStorage(key, defaultValue, window.sessionStorage);
}

function useStorage<T>(key: string, defaultValue: T | (() => T), storageObject: StorageType): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
    const [value, setValue] = useState<T>(() => {
        const jsonValue = storageObject.getItem(key);
        if (jsonValue != null) return JSON.parse(jsonValue);

        if (typeof defaultValue === "function") {
            return (defaultValue as () => T)();
        } else {
            return defaultValue;
        }
    });

    useEffect(() => {
        if (value === undefined) {
            storageObject.removeItem(key);
        } else {
            storageObject.setItem(key, JSON.stringify(value));
        }
    }, [key, value, storageObject]);

    const remove = useCallback(() => {
        setValue(undefined as unknown as T);
    }, []);

    return [value, setValue, remove];
}