import Frame from '@components/ui/Frame';
import useRosTopicSubscription from '@scripts/hooks/useRosTopicSubscription';
import type { ImuMsg } from 'types/rosInterfaces';

export default function ImuReadings() {
  const imuReadings = useRosTopicSubscription<ImuMsg>( 'controller/imu/data_raw' , 'sensor_msgs/msg/Imu' , 10000 );

  console.log(imuReadings)

  return (
    <Frame>
      <div>IMU readings: Roll: 180.00</div>
      <div>Pitch: 180.00 | Yaw: 180.00</div>
    </Frame>
  );
}
