import Frame from '@components/ui/Frame';

export default function CopyrightFrame() {
  return (
    <Frame>
      <div style={{ marginBottom: '0.5rem' }}>{__APP_DISPLAY_NAME__}</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: 'var(--bs-secondary-color)',
        }}
      >
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
