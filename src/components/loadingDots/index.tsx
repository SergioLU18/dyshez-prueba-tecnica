import React from "react";
import styles from "./component.module.css";

const LoadingDots: React.FC = () => {
  return (
    <div className={styles["loading-dots"]}>
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
};

export default LoadingDots;
