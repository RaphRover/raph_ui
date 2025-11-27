import Frame from '@/components/ui/Frame';
import useRosTopicSubscription from '@/scripts/hooks/useRosTopicSubscription';

import type { PowerSystemStateMsg } from '@/types/rosInterfaces';

import styles from './styles.module.css';
import { useConfigContext } from '@/config';

export default function BatteryStatus() {
  const { settings } = useConfigContext();
  const { refreshIntervalMs, displayPrecision, warningLevel, criticalLevel } =
    settings.battery;
  const powerSystemState = useRosTopicSubscription<PowerSystemStateMsg>(
    'controller/power_system_state',
    'raph_interfaces/msg/PowerSystemState',
    refreshIntervalMs,
  );

  const battery1Connected = powerSystemState?.bat1_connected;
  const battery2Connected = powerSystemState?.bat2_connected;
  const battery1Level = battery1Connected
    ? powerSystemState.bat1_state.state_of_charge
    : null;
  const battery2Level = battery2Connected
    ? powerSystemState.bat2_state.state_of_charge
    : null;

  const batteryStyle = (level: number | null) => {
    if (level === null) return;
    if (level >= warningLevel) return styles.solidGreen;
    if (level >= criticalLevel) return styles.solidYellow;
    return styles.blinkRed;
  };

  return (
    <Frame className={styles.frame}>
      <div>
        <span>Battery 1: </span>
        <span className={batteryStyle(battery1Level)}>
          {battery1Level ? battery1Level.toFixed(displayPrecision) + '%' : '-'}
        </span>
      </div>
      <div>
        <span>Battery 2: </span>
        <span className={batteryStyle(battery2Level)}>
          {battery2Level ? battery2Level.toFixed(displayPrecision) + '%' : '-'}
        </span>
      </div>
    </Frame>
  );
}
