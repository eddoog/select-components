import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../styles/Select.module.css';

export type SelectOption = {
    label: string;
    value: string | number;
};

type SingleSelectProps = {
    multiple: false;
    value?: SelectOption;
    onChange: (value: SelectOption | undefined) => void;
};

type MultiSelectProps = {
    multiple: true;
    value: SelectOption[];
    onChange: (value: SelectOption[]) => void;
};

type SelectProps = {
    options: SelectOption[];
} & (SingleSelectProps | MultiSelectProps);

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    function isOptionSelected(option: SelectOption) {
        if (multiple) return value.includes(option);
        return option === value;
    }

    function clearOptions() {
        if (!multiple) return onChange(undefined);
        return onChange([]);
    }

    const setOption = useCallback(
        (option: SelectOption) => {
            if (!multiple && value !== option) return onChange(option);
            if (!multiple) return;
            if (value.includes(option))
                return onChange(value.filter((v) => v.value !== option.value));
            return onChange([...value, option]);
        },
        [multiple, onChange, value]
    );

    useEffect(() => {
        if (isOpen) setIsHighlighted(0);
    }, [isOpen]);

    useEffect(() => {
        function handleInput(e: KeyboardEvent) {
            if (e.target !== containerRef.current) return;
            switch (e.code) {
                case 'Enter':
                case 'Space': {
                    setIsOpen((prev) => !prev);
                    if (isOpen) setOption(options[isHighlighted]);
                    break;
                }

                case 'ArrowUp':
                case 'ArrowDown': {
                    if (!isOpen) {
                        setIsOpen(true);
                        break;
                    }
                    const newValue =
                        isHighlighted + (e.code === 'ArrowUp' ? -1 : 1);
                    if (newValue < 0 || newValue >= options.length) break;
                    setIsHighlighted(newValue);
                    break;
                }
                case 'Escape': {
                    if (isOpen) setIsOpen(false);
                    break;
                }
            }
        }
        containerRef.current?.addEventListener('keydown', handleInput);

        return () => {
            return containerRef.current?.removeEventListener(
                'keydown',
                handleInput
            );
        };
    }, [isHighlighted, isOpen, options, setOption]);

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className={styles.container}
            onBlur={() => {
                setIsOpen(false);
            }}
            onClick={() => {
                setIsOpen((prev) => {
                    return !prev;
                });
            }}
        >
            <span className={styles.value}>
                {multiple
                    ? value.map((option) => {
                          return (
                              <button
                                  key={option.value}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setOption(option);
                                  }}
                                  className={styles.mutltipleValueButton}
                              >
                                  {option.label}
                                  <span className={styles.deleteButton}>
                                      &times;
                                  </span>
                              </button>
                          );
                      })
                    : value && value.label}
            </span>
            <button
                className={styles.deleteButton}
                onClick={(e) => {
                    e.stopPropagation();
                    clearOptions();
                }}
            >
                &times;
            </button>
            <div className={styles.divider}></div>
            <div className={styles.dropdownButton}></div>
            <ul className={`${styles.options} ${isOpen && styles.show}`}>
                {options.map((option: SelectOption, index: number) => {
                    return (
                        <li
                            className={`${styles.option} ${
                                isOptionSelected(option) && styles.selected
                            } ${
                                isHighlighted === index
                                    ? styles.highlighted
                                    : ''
                            }`}
                            onMouseEnter={() => {
                                setIsHighlighted(index);
                            }}
                            key={option.value}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOption(option);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Select;
