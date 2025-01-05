'use client'

import styles from "./page.module.css";
import { Login } from "@/components/login";
import { Welcome } from "@/components/welcome";
import { PageContainer } from "@/components/pageContainer";

export default function LoginPage() {
    return (
        <PageContainer>
            <Welcome />
            <Login />
        </PageContainer>
    );
}
