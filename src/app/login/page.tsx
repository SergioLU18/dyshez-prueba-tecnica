'use client'

import styles from "./page.module.css";
import { Login } from "@/components/login";
import { Welcome } from "@/components/welcome";

export default function LoginPage() {
    return (
        <div className={styles.page}>
            <Welcome />
            <Login />
        </div>
    );
}
