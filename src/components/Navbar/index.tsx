import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Navbar, Row, Stack } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';
import ROSStatus from '@/components/ROSStatus';
import BatteryStatus from '@/components/BatteryStatus';
import ImuReadings from '@/components/ImuReadings';
import { useAppContext } from '@/scripts/context/AppContext';
import { useRosContext } from '@/scripts/context/RosContext';
import useRosParam from '@/scripts/hooks/useRosParam';
import { useConfigContext } from '@/config';
import MenuDrawer from '@/components/MenuDrawer';
import styles from './styles.module.css';
import MenuIcon from './menu.svg?react';

export default function RaphNavbar() {
  const isDesktop = useMediaQuery({ minWidth: 950 });
  const isTablet = useMediaQuery({ minWidth: 760 });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const { setMenuVisible, setConfigVisible } = useAppContext();
  const { settings } = useConfigContext();
  const { ros } = useRosContext();
  const [isSprayUpdating, setSprayUpdating] = useState(false);

  const {
    value: isSpraying,
    get: getSprayingState,
    set: setSprayingState,
  } = useRosParam(
    ros,
    '/controller',
    'power_manager.output_12v_enabled',
    2000,
    'bool',
  );

  const refreshSprayingState = useCallback(() => {
    if (!ros) {
      return;
    }
    void getSprayingState().catch((error) => {
      console.debug('[Navbar] Failed to refresh spray param', error);
    });
  }, [getSprayingState, ros]);

  useEffect(() => {
    refreshSprayingState();
    if (!ros) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (!isSprayUpdating) {
        refreshSprayingState();
      }
    }, settings.ros.topicPollIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isSprayUpdating, refreshSprayingState, ros, settings.ros.topicPollIntervalMs]);

  const handleSprayToggle = useCallback(async () => {
    if (isSpraying === null || !ros) {
      return;
    }

    const nextState = !isSpraying;
    const action = nextState ? 'start' : 'stop';

    setSprayUpdating(true);

    const promise = (async () => {
      await setSprayingState(nextState);
      return getSprayingState();
    })();

    toast.promise(
      promise,
      {
        pending: `${action === 'start' ? 'Starting' : 'Stopping'} spraying...`,
        success: `Spraying ${action === 'start' ? 'started' : 'stopped'}`,
        error: {
          render({ data }: { data: Error }) {
            return `Failed to ${action} spraying: ${data.message}`;
          },
        },
      },
      {
        toastId: 'spray-toggle',
      },
    );

    try {
      await promise;
    } finally {
      setSprayUpdating(false);
    }
  }, [getSprayingState, isSpraying, ros, setSprayingState]);

  const isSprayButtonDisabled = isSpraying === null || isSprayUpdating;
  const sprayButtonLabel =
    isSpraying === null
      ? 'Spray unavailable'
      : isSpraying
        ? 'Stop spraying'
        : 'Start spraying';
  const sprayButtonVariant = isSpraying ? 'fl-primary' : 'fl-secondary';

  return (
    <>
      <Navbar className={styles.navbar} expand="false" sticky="top">
        <Container fluid className="justify-content-start">
          <Stack
            direction="horizontal"
            gap={2}
            style={{ alignItems: 'stretch' }}
          >
            <Navbar.Brand href="/" className="d-flex align-items-center">
              <img
                alt="Raph Rover Logo"
                src="/favicon/favicon.svg"
                width="40"
                height="40"
                className="d-inline-block align-top"
              />
              <span style={{ paddingLeft: '0.8rem', verticalAlign: 'sub' }}>
                Raph Rover
              </span>
            </Navbar.Brand>
            {(isDesktop || !isPortrait) && <ROSStatus />}
            {(isDesktop || !isPortrait) && <BatteryStatus />}
            {isTablet && <ImuReadings />}
          </Stack>
          <Stack direction="horizontal" gap={2} className="ms-auto">
            <Button
              className={styles.actionButton}
              variant={sprayButtonVariant}
              onClick={() => {
                void handleSprayToggle();
              }}
              disabled={isSprayButtonDisabled}
              aria-label={sprayButtonLabel}
            >
              {sprayButtonLabel}
            </Button>
            <Button
              className={styles.menuButton}
              variant="fl-secondary"
              onClick={() => {
                setMenuVisible(true);
                setConfigVisible(false);
              }}
              aria-label="Open menu drawer"
            >
              <MenuIcon />
            </Button>
          </Stack>
          {!isDesktop && isPortrait && (
            <Stack
              gap={2}
              style={{
                width: '100%',
                marginTop: '0.5rem',
                justifyContent: 'space-between',
              }}
            >
              <Row>
                <Col>
                  <ROSStatus style={{ height: '100%' }} />
                </Col>
                <Col>
                  <BatteryStatus />
                </Col>
              </Row>
              <ImuReadings />
            </Stack>
          )}
        </Container>
      </Navbar>
      <MenuDrawer />
    </>
  );
}
