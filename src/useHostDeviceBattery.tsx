import { useEffect, useState } from "react";

type BatteryState = {
    level: number;
    isCharging: boolean;
    chargingTime: number;
    dischargingTime: number;
};
type BatteryEventListeners =
    "chargingchange"
    | "levelchange"
    | "chargingtimechange"
    | "dischargingtimechange";

type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

type BatteryManager =
    BatteryState & {
        addEventListener(type: BatteryEventListeners, listener: EventListenerOrEventListenerObject): void;
        removeEventListener(type: BatteryEventListeners, listener: EventListenerOrEventListenerObject): void;
    };

// Extend the Navigator interface to include getBattery if it exists
// Battery Status API is not supported in all browsers, and TypeScript needs to know about it.
declare global {
    interface Navigator {
        getBattery?: () => Promise<BatteryManager>;
    }
}

const useHostDeviceBattery = () => {
    const [battery, setBattery] = useState<BatteryState | null>(null);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        if (!navigator.getBattery) {
            setIsSupported(false);
            return;
        }

        let batteryManager: BatteryManager | null = null;

        const updateBattery = () => {
            if (!batteryManager) return;

            setBattery({
                level: batteryManager.level,
                isCharging: batteryManager.isCharging,
                chargingTime: batteryManager.chargingTime,
                dischargingTime: batteryManager.dischargingTime,
            });
        };

        navigator.getBattery().then((battery) => {
            batteryManager = battery;
            updateBattery();

            battery.addEventListener("levelchange", updateBattery);
            battery.addEventListener("chargingchange", updateBattery);
            battery.addEventListener("chargingtimechange", updateBattery);
            battery.addEventListener("dischargingtimechange", updateBattery);
        });

        return () => {
            if (!batteryManager) return;

            batteryManager.removeEventListener("levelchange", updateBattery);
            batteryManager.removeEventListener("chargingchange", updateBattery);
            batteryManager.removeEventListener("chargingtimechange", updateBattery);
            batteryManager.removeEventListener("dischargingtimechange", updateBattery);
        };
    }, []);

    return { battery, isSupported };
};

export default useHostDeviceBattery;