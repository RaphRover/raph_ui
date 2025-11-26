import ConfigFrame from '@/components/ui/ConfigFrame';
import RangeWithLabel from '@/components/ui/RangeWithLabel';
import { useConfigContext, APP_CONFIG } from '@/config';
import { showOrUpdateToast } from '@/scripts/utils/showOrUpdateToast';

export default function RobotVelocityConfig() {
  const { settings, updateSettings } = useConfigContext();
  const { linearVelocityMps } = settings.driveConfig;
  const driveLimits = APP_CONFIG.driveConfig;
  const { linearVelocityMps: linearVelocityLimits } = driveLimits;

  const handleVelocitySet = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => {
    const newValue = e.currentTarget.valueAsNumber;
    updateSettings({
      driveConfig: { linearVelocityMps: newValue },
    });
    showOrUpdateToast(
      `Robot velocity set to: ${newValue} ${linearVelocityLimits.unit}`,
      {
        toastId: 'velocity-set',
        type: 'info',
      },
    );
  };

  return (
    <ConfigFrame title="Robot Velocity Config">
      <RangeWithLabel
        label={linearVelocityLimits.label}
        unit={linearVelocityLimits.unit}
        min={linearVelocityLimits.min}
        max={linearVelocityLimits.max}
        step={linearVelocityLimits.step}
        value={linearVelocityMps}
        onMouseUp={handleVelocitySet}
        onTouchEnd={handleVelocitySet}
        showLegend
      />
      {/* <RangeWithLabel
        label="Angular Velocity Limit"
        unit="rad/s"
        min={driveLimits.steeringAngleVelocityRadps.min}
        max={driveLimits.steeringAngleVelocityRadps.max}
        step={driveLimits.steeringAngleVelocityRadps.step}
        defaultValue={steeringAngleLimitRad}
        onMouseUp={handleVelocitySet}
        onTouchEnd={handleVelocitySet}
        showLegend
      /> */}
    </ConfigFrame>
  );
}
