import { Image } from 'react-bootstrap';
import { useAppContext } from '@/scripts/context/AppContext';
import styles from './styles.module.css';

export default function StreamWindow() {
  const { selectedStream } = useAppContext();

  return (
    <div className={styles.streamWrapper}>
      <Image
        title="Stream window"
        alt="Stream window"
        src={selectedStream?.url}
        className={styles.stream}
      />
    </div>
  );
}
