import Frame from '@components/ui/Frame';
import useRosTopicSubscription from '@scripts/hooks/useRosTopicSubscription';
import type { PowerSystemStateMsg } from 'types/rosInterfaces';
import styles from './styles.module.css';

export default function BatteryStatus() {
  const powerSystemState = useRosTopicSubscription<PowerSystemStateMsg>(
    'controller/power_system_state',
    'raph_interfaces/msg/PowerSystemState',
    1000,
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
    if (level >= 75) return styles.solidGreen;
    if (level >= 20) return styles.solidYellow;
    return styles.blinkRed;
  };

  return (
    <Frame className={styles.frame}>
      <div>
        Battery 1:{' '}
        <span className={batteryStyle(battery1Level)}>
          {battery1Level ? battery1Level.toFixed(2) + '%' : '-'}
        </span>
      </div>
      <div>
        Battery 2:{' '}
        <span className={batteryStyle(battery2Level)}>
          {battery2Level ? battery2Level.toFixed(2) + '%' : '-'}
        </span>
      </div>
    </Frame>
  );
}
