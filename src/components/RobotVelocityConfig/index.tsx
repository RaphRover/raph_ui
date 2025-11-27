import ConfigFrame from '@/components/ui/ConfigFrame';
import RangeWithLabel from '@/components/ui/RangeWithLabel';
import { useConfigContext, APP_CONFIG } from '@/config';
import { showOrUpdateToast } from '@/scripts/utils/showOrUpdateToast';

export default function RobotVelocityConfig() {
  const { settings, updateSettings } = useConfigContext();
  const {
    linearVelocityMps,
    steeringAngleVelocityRadps,
    ackermannAcceleration,
    ackermannJerk,
  } = settings.driveConfig;
  const driveLimits = APP_CONFIG.driveConfig;
  const {
    linearVelocityMps: linearVelocityLimits,
    steeringAngleVelocityRadps: steeringAngleLimits,
    ackermannAcceleration: ackermannAccelerationLimits,
    ackermannJerk: ackermannJerkLimits,
  } = driveLimits;

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

  const handleSteeringAngleVelocitySet = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => {
    const newValue = e.currentTarget.valueAsNumber;
    updateSettings({
      driveConfig: { steeringAngleVelocityRadps: newValue },
    });
    showOrUpdateToast(
      `Steering angle velocity set to: ${newValue} ${steeringAngleLimits.unit}`,
      {
        toastId: 'steering-velocity-set',
        type: 'info',
      },
    );
  };

  const handleAckermannAccelerationSet = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => {
    const newValue = e.currentTarget.valueAsNumber;
    updateSettings({
      driveConfig: { ackermannAcceleration: newValue },
    });
    showOrUpdateToast(
      `Ackermann acceleration set to: ${newValue} ${ackermannAccelerationLimits.unit}`,
      {
        toastId: 'ackermann-acceleration-set',
        type: 'info',
      },
    );
  };

  const handleAckermannJerkSet = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>,
  ) => {
    const newValue = e.currentTarget.valueAsNumber;
    updateSettings({
      driveConfig: { ackermannJerk: newValue },
    });
    showOrUpdateToast(
      `Ackermann jerk set to: ${newValue} ${ackermannJerkLimits.unit}`,
      {
        toastId: 'ackermann-jerk-set',
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
      <RangeWithLabel
        label={steeringAngleLimits.label}
        unit={steeringAngleLimits.unit}
        min={steeringAngleLimits.min}
        max={steeringAngleLimits.max}
        step={steeringAngleLimits.step}
        value={steeringAngleVelocityRadps}
        onMouseUp={handleSteeringAngleVelocitySet}
        onTouchEnd={handleSteeringAngleVelocitySet}
        showLegend
      />
      <RangeWithLabel
        label={ackermannAccelerationLimits.label}
        unit={ackermannAccelerationLimits.unit}
        min={ackermannAccelerationLimits.min}
        max={ackermannAccelerationLimits.max}
        step={ackermannAccelerationLimits.step}
        value={ackermannAcceleration}
        onMouseUp={handleAckermannAccelerationSet}
        onTouchEnd={handleAckermannAccelerationSet}
        showLegend
      />
      <RangeWithLabel
        label={ackermannJerkLimits.label}
        unit={ackermannJerkLimits.unit}
        min={ackermannJerkLimits.min}
        max={ackermannJerkLimits.max}
        step={ackermannJerkLimits.step}
        value={ackermannJerk}
        onMouseUp={handleAckermannJerkSet}
        onTouchEnd={handleAckermannJerkSet}
        showLegend
      />
    </ConfigFrame>
  );
}
