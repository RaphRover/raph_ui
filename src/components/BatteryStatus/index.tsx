import Frame from '@components/ui/Frame';
import useRosTopicSubscription from '@scripts/hooks/useRosTopicSubscription';

import type { PowerSystemStateMsg } from 'types/rosInterfaces';

import styles from './styles.module.css';
import { useConfigContext } from '@scripts/context/ConfigContext';

export default function BatteryStatus() {
  const { batteryConfig } = useConfigContext();
  const {
    REFRESH_INTERVAL_MS,
    DISPLAY_PRECISION,
    CRITICAL_LEVEL_PERCENT,
    WARNING_LEVEL_PERCENT,
  } = batteryConfig;
  const powerSystemState = useRosTopicSubscription<PowerSystemStateMsg>(
    'controller/power_system_state',
    'raph_interfaces/msg/PowerSystemState',
    REFRESH_INTERVAL_MS,
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
    if (level >= WARNING_LEVEL_PERCENT) return styles.solidGreen;
    if (level >= CRITICAL_LEVEL_PERCENT) return styles.solidYellow;
    return styles.blinkRed;
  };

  return (
    <Frame className={styles.frame}>
      <div>
        <span>Battery 1: </span>
        <span className={batteryStyle(battery1Level)}>
          {battery1Level ? battery1Level.toFixed(DISPLAY_PRECISION) + '%' : '-'}
        </span>
      </div>
      <div>
        <span>Battery 2: </span>
        <span className={batteryStyle(battery2Level)}>
          {battery2Level ? battery2Level.toFixed(DISPLAY_PRECISION) + '%' : '-'}
        </span>
      </div>
    </Frame>
  );
}
