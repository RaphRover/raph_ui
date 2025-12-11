import { Stack } from 'react-bootstrap';
import Frame from '../Frame';

interface ConfigFrameProps {
  title: string;
  children: React.ReactNode;
}

export default function ConfigFrame(props: ConfigFrameProps) {
  const { title, children } = props;
  return (
    <Frame style={{ backgroundColor: 'var(--fl-bg)' }}>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h3>
      <Stack gap={2}>{children}</Stack>
    </Frame>
  );
}
