import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Form, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import type { FormRangeProps } from 'react-bootstrap/esm/FormRange';
import styles from './styles.module.css';

interface RangeWithLabelProps extends FormRangeProps {
  /** Label for the range input */
  label?: string;
  /** Unit to display next to the minimum, maximum and current values */
  unit?: string;
  /** Whether to show the legend with min, max, and current values */
  showLegend?: boolean;
  /** Multiplier to apply to the unit for display purposes */
  unitMultiplier?: number;
  /** Discrete values for the range input */
  valueArray?: (number | string)[];
}

export default function RangeWithLabel(props: RangeWithLabelProps) {
  const {
    label,
    unit,
    showLegend,
    unitMultiplier = 1,
    valueArray,
    value,
    onChange,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    ...rangeProps
  } = props;
  const [internalValue, setInternalValue] = useState(value);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const rangeRef = useRef<HTMLInputElement>(null);

  // Measure slider width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (rangeRef.current) {
        setSliderWidth(rangeRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Compute range props for valueArray mode
  const computedRangeProps = useMemo(() => {
    if (valueArray && valueArray.length > 0) {
      return {
        ...rangeProps,
        min: 0,
        max: valueArray.length - 1,
        step: 1,
      };
    }
    return rangeProps;
  }, [valueArray, rangeProps]);

  const formatValue = (
    value: number | string | readonly string[] | undefined,
  ): string | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === 'number') {
      return `${value * unitMultiplier} ${unit}`.trim();
    }
    return String(value);
  };

  const prepareLegend = () => {
    if (!showLegend) return null;
    const minValue = valueArray ? valueArray[0] : computedRangeProps.min;
    const maxValue = valueArray
      ? valueArray[valueArray.length - 1]
      : computedRangeProps.max;

    const min = formatValue(minValue);
    const max = formatValue(maxValue);
    return (
      <div className={styles.legend}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    );
  };

  // Helper to convert index to actual value in events
  const createSyntheticEvent = useCallback(
    <T extends React.SyntheticEvent<HTMLInputElement>>(e: T): T => {
      if (valueArray) {
        const index = Number(e.currentTarget.value);
        const actualValue = valueArray[index];
        return {
          ...e,
          currentTarget: {
            ...e.currentTarget,
            value: String(actualValue),
          },
          target: {
            ...e.target,
            value: String(actualValue),
          } as EventTarget & HTMLInputElement,
        } as T;
      }
      return e;
    },
    [valueArray],
  );

  const handleMouseEnter = (e: React.MouseEvent<HTMLInputElement>) => {
    setShowTooltip(true);
    onMouseEnter?.(createSyntheticEvent(e));
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLInputElement>) => {
    setShowTooltip(false);
    onMouseLeave?.(createSyntheticEvent(e));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
    setShowTooltip(true);
    onTouchStart?.(createSyntheticEvent(e));
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    setShowTooltip(false);
    onTouchEnd?.(createSyntheticEvent(e));
  };

  // Convert actual value to index for valueArray mode
  const currentIndex = useMemo(() => {
    if (valueArray && internalValue !== undefined) {
      const index = valueArray.findIndex((val) => val === internalValue);
      return index !== -1 ? index : 0;
    }
    return internalValue;
  }, [valueArray, internalValue]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.currentTarget.valueAsNumber);
    if (valueArray) {
      onChange?.(createSyntheticEvent(e));
    } else {
      onChange?.(e);
    }
  };

  const currentDisplayValue = valueArray
    ? valueArray[currentIndex as number]
    : internalValue;

  const tooltipId = `range-tooltip-${label?.toLowerCase().replaceAll(' ', '-')}`;

  // Calculate horizontal offset based on slider position
  const horizontalOffset = useMemo(() => {
    if (!sliderWidth) return 0;

    const min = Number(computedRangeProps.min) || 0;
    const max = Number(computedRangeProps.max) || 100;
    const current = Number(currentIndex) || 0;

    if (max === min) return 0;

    // Calculate percentage position (0 to 1)
    const percentage = (current - min) / (max - min);

    // Convert to pixel offset from center based on actual slider width
    return (percentage - 0.5) * sliderWidth;
  }, [
    computedRangeProps.min,
    computedRangeProps.max,
    currentIndex,
    sliderWidth,
  ]);

  return (
    <FormGroup>
      <Form.Label>{label}</Form.Label>
      <OverlayTrigger
        show={showTooltip}
        placement="top"
        flip={false}
        popperConfig={{
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'clippingParents',
              },
            },
            {
              name: 'offset',
              options: {
                offset: [horizontalOffset, 8],
              },
            },
          ],
        }}
        overlay={
          <Tooltip id={tooltipId} className={styles.tooltip}>
            {currentDisplayValue}
          </Tooltip>
        }
      >
        <Form.Range
          {...computedRangeProps}
          ref={rangeRef}
          value={currentIndex}
          onChange={handleRangeChange}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      </OverlayTrigger>
      {prepareLegend()}
    </FormGroup>
  );
}
