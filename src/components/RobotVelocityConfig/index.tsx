import ConfigFrame from '@/components/ui/ConfigFrame';
import RangeWithLabel from '@/components/ui/RangeWithLabel';
import { useConfigContext, APP_CONFIG } from '@/config';

export default function RobotVelocityConfig() {
  const { settings } = useConfigContext();
  const { linearVelocityMps, steeringAngleLimitRad } = settings.driveConfig;
  const { driveConfig: driveLimits } = APP_CONFIG;

  const handleVelocitySet = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => {
    // setDriveConfig({
    //   ...driveConfig,
    //   linearVelocityMps: e.currentTarget.valueAsNumber,
    // });
    console.log('Velocity set to:', e.currentTarget.valueAsNumber);
  };

  return (
    <ConfigFrame title="Robot Velocity Config">
      <RangeWithLabel
        label="Linear Velocity Limit"
        unit="m/s"
        min={driveLimits.linearVelocityMps.min}
        max={driveLimits.linearVelocityMps.max}
        step={driveLimits.linearVelocityMps.step}
        defaultValue={linearVelocityMps}
        onMouseUp={handleVelocitySet}
        onTouchEnd={handleVelocitySet}
        showLegend
      />
      <RangeWithLabel
        label="Angular Velocity Limit"
        unit="rad/s"
        min={driveLimits.steeringAngleVelocityRadps.min}
        max={driveLimits.steeringAngleVelocityRadps.max}
        step={driveLimits.steeringAngleVelocityRadps.step}
        defaultValue={steeringAngleLimitRad}
        onMouseUp={handleVelocitySet}
        onTouchEnd={handleVelocitySet}
        showLegend
      />
    </ConfigFrame>
  );
}
