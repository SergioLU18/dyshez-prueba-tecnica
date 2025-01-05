'use client'

import Image from "next/image";
import styles from "../page.module.css";

export default function LoginPage() {
    return (
        <div className={styles.page}>
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
        This is the reset page
        </div>
    );
}