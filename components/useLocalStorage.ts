import { useEffect, useState } from "react";

function getStorageValue(key:any, initialValue:any) {
    if (typeof window !== "undefined") {
        const savedValue = localStorage.getItem(key);
        return savedValue !== null ? JSON.parse(savedValue) : initialValue;
    }
}

export const useLocalStorage = (key:any, initialValue:any) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, initialValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};