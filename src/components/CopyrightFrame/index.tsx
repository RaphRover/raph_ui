import Frame from '@/components/ui/Frame';
import styles from './styles.module.css';

export default function CopyrightFrame() {
  return (
    <Frame className={styles.frame}>
      <div className={styles.appDisplayName}>{__APP_DISPLAY_NAME__}</div>
      <div className={styles.info}>
        <span>© {__BUILD_YEAR__} Fictionlab</span>
        <a
          href={__REPOSITORY_URL__}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--bs-secondary-color)' }}
        >
          {__APP_NAME__} v{__APP_VERSION__}
        </a>
      </div>
    </Frame>
  );
}
