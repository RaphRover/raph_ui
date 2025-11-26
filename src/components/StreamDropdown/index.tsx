import { useROSContext } from '@scripts/context/ROSContext';
import { useAppContext } from '@scripts/context/AppContext';
import { Dropdown } from 'react-bootstrap';

interface StreamDropdownProps {
  desktopLayout: boolean;
}

export default function StreamDropdown(props: StreamDropdownProps) {
  const { streamList } = useROSContext();
  const { selectedStream, selectStream } = useAppContext();

  const { desktopLayout } = props;

  const handleStreamSelection = (eventKey: string | null) => {
    const stream = streamList.find((stream) => stream.name === eventKey);
    if (stream) {
      selectStream(stream);
      console.debug('[StreamDropdown] Selected stream:', stream.name);
    }
  };

  return (
    <Dropdown
      onSelect={handleStreamSelection}
      drop={desktopLayout ? 'start' : 'down-centered'}
    >
      <Dropdown.Toggle style={{ width: '100%' }}>
        Stream selection
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {streamList.map((stream) => {
          return (
            <Dropdown.Item
              key={stream.name}
              eventKey={stream.name}
              active={selectedStream?.name === stream.name}
            >
              {stream.displayName}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
