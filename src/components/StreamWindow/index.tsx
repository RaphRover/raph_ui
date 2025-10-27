import { Image } from 'react-bootstrap';
import image from '@root/public/favicon/favicon.svg';
import styles from './styles.module.css';

export default function StreamWindow() {
  return (
    <div className={styles.streamWrapper}>
      <Image src={image} className={styles.stream} />
    </div>
  );
}
