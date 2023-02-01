import React, { useEffect, useState } from 'react';
import styles from '../styles/AddSelectTag.module.css';
import { options } from '../utils/Options';

type InputProps = {
    type: string;
    placeholder: string;
};

const AddSelectTag = () => {
    const {
        value: label,
        input: inputLabel,
        setValue: setLabelValue,
    } = useInput({
        type: 'text',
        placeholder: 'Input your new Label',
    });

    const {
        value,
        input: inputValue,
        setValue: setValueInput,
    } = useInput({
        type: 'text',
        placeholder: 'Input your new Value',
    });

    const [disabled, setDisabled] = useState(true);

    function useInput({ type, placeholder }: InputProps) {
        const [value, setValue] = useState('');
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
        };
        const input = (
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles.input}
            />
        );

        return {
            value,
            input,
            setValue,
        };
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        options.push({ label: label, value: parseInt(value) });
        setLabelValue('');
        setValueInput('');
    }

    useEffect(() => {
        if (
            value === '' ||
            label === '' ||
            !+value ||
            options.find(
                (option) =>
                    option.value === parseInt(value) || option.label === label
            )
        ) {
            setDisabled(true);
            return;
        }
        setDisabled(false);
        return;
    }, [value, label]);
    return (
        <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
            <label htmlFor="selectTag" className={styles.label}>
                Add Select Tag
            </label>
            {inputLabel}
            {inputValue}
            <button type="submit" className={styles.submit} disabled={disabled}>
                Submit
            </button>
        </form>
    );
};

export default AddSelectTag;
