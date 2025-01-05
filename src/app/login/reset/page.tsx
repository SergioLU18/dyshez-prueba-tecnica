'use client'

import { PageContainer } from "@/components/pageContainer";
import { Reset } from "@/components/reset";
import { Welcome } from "@/components/welcome";

export default function LoginPage() {
    return (
        <PageContainer>
            <Welcome />
            <Reset />
        </PageContainer>
    );
}