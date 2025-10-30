import { Image } from 'react-bootstrap';
import { useAppContext } from '@scripts/context/AppContext';
import styles from './styles.module.css';
import { useEffect, useRef } from 'react';

export default function StreamWindow() {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { selectedStream } = useAppContext();

  useEffect(() => {
    const localRef = imageRef.current;
    return () => {
      if (localRef) localRef.src = '';
    };
  }, [selectedStream]);

  return (
    <div className={styles.streamWrapper}>
      <Image
        ref={imageRef}
        src={selectedStream?.url}
        className={styles.stream}
      />
    </div>
  );
}
