import styles from "../styles/topPanel.module.css";

export default function TopPanel({ flagsLeft, timer, onRestart, status }) {

    const btnClass = status === "lost"
        ? styles.lost
        : status === "won"
        ? styles.won
        : styles.normal;

    return (
        <div className={styles.topPanel}>
            <div className={styles.counter}>{String(flagsLeft).padStart(3, "0")}</div>

            <button className={btnClass} onClick={onRestart}></button>

            <div className={styles.counter}>{String(timer).padStart(3, "0")}</div>
        </div>
    );
}