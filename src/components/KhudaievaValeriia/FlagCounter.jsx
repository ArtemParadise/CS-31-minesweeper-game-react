// src/components/KhudaievaValeriia/FlagCounter.jsx

import React from 'react';
import styles from './FlagCounter.module.css';

function FlagCounter({ count }) {
    return <div className={styles.counter}>{String(count).padStart(3, "0")}</div>;
}
export default FlagCounter;