'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { Login } from "@/components/login";

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
        <Login />
        </div>
    );
}
