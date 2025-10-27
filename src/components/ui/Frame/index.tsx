import clsx from 'clsx';
import styles from './styles.module.css';

export default function Frame(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, className, ...propsRest } = props;
  return (
    <div className={clsx(styles.frame, className)} {...propsRest}>
      {children}
    </div>
  );
}
