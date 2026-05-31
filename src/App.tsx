import {
  BatteryChargingIcon,
  BatteryEmptyIcon,
  BatteryFullIcon,
  BatteryHighIcon,
  BatteryLowIcon,
  BatteryMediumIcon,
  BatteryWarningIcon,
} from '@phosphor-icons/react';
import useHostDeviceBattery from '../src/useHostDeviceBattery';

const batteryLevels = [
  { max: 20, label: 'Battery critically low', BatteryIcon: BatteryWarningIcon },
  { max: 40, label: 'Battery low', BatteryIcon: BatteryLowIcon },
  { max: 60, label: 'Battery medium', BatteryIcon: BatteryMediumIcon },
  { max: 80, label: 'Battery high', BatteryIcon: BatteryHighIcon },
  { max: 100, lable: 'Battery full', BatteryIcon: BatteryFullIcon }
];


const BatteryStatusIcon = ({ level, isCharging }: { level: number; isCharging: boolean; }) => {
  const iconSize = 40;

  if (isCharging) {
    return (
      <span title="Battery is charging" aria-label="Battery is charging">
        <BatteryChargingIcon size={iconSize} />
      </span>
    );
  }

  const { label, BatteryIcon } =
    batteryLevels.find(b => level < b.max) ?? { label: 'Battery unknown', BatteryIcon: BatteryEmptyIcon };

  return (
    <span title={label} aria-label={label}>
      <BatteryIcon size={iconSize} />
    </span>
  );
};

const ConvertHoursMinutes = (seconds: number) => {
  if (seconds === Infinity) return '?';
  return new Date(seconds * 1000).toISOString().substring(11, 16);
};

function App() {
  const { battery: hostBattery, isSupported } = useHostDeviceBattery();

  return (
    <main>
      <h2 id='outer-card-header'>For this device</h2>
      <div id='card'>
        <h2>Battery Status</h2>
        {hostBattery && isSupported &&
          <>
            <div id='main-device-percentage'>{Math.round(hostBattery.level * 100)}%</div>
            <div id='main-device-battery-icon'>
              <BatteryStatusIcon level={hostBattery?.level * 100} isCharging={hostBattery.charging} />
            </div>
            <div id='main-device-time'>
              {hostBattery.charging ?
                `Charging time: ${ConvertHoursMinutes(hostBattery?.chargingTime)}` :
                `Discharging time: ${ConvertHoursMinutes(hostBattery?.dischargingTime)}`}
            </div>
          </>
        }
        {!hostBattery || !isSupported &&
          <>
            <div id='main-device-percentage'>?</div>
            <div id='main-device-battery-icon'>
              <BatteryStatusIcon level={0} isCharging={false} />
            </div>
            <div id='main-device-name'>Unknown</div>
          </>
        }
      </div>
      {!isSupported && !hostBattery &&
        <p id='unsupported-message'>Battery Status API is not supported in this browser.</p>
      }
      {isSupported && !hostBattery &&
        <p id='unsupported-message'>Unable to get battery status for this device.</p>
      }
    </main>
  );
}

export default App;
