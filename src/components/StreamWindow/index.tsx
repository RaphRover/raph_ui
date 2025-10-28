import { Image } from 'react-bootstrap';
import { useAppContext } from '@scripts/context/AppContext';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';

export default function StreamWindow() {
  const { selectedStream } = useAppContext();
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  useEffect(() => {
    if (selectedStream) setImageSrc(selectedStream.url);
    return () => {
      setImageSrc(undefined);
    };
  }, [selectedStream]);

  return (
    <div className={styles.streamWrapper}>
      <Image src={imageSrc} className={styles.stream} />
    </div>
  );
}
