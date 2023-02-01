import { useTag } from '@/Hooks/useTag';
import styles from '../styles/AddSelectTag.module.css';

const AddSelectTag = () => {
    const { disabled, inputLabel, inputValue, handleSubmit } = useTag();

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
