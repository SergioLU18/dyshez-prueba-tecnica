import * as React from 'react'
import Image from "next/image";
import styles from "./component.module.css";

export const Welcome: React.FC = () => {
    return (
        <div className={styles.main}>
            <Image
                src="/logo.svg"
                alt="Dyshez logo"
                width={194}
                height={48}
                priority
            />
            <div className={styles.welcome}>!Bienvenido de vuelta!</div>
        </div>

    )
}
