'use client'

import { PageContainer } from "@/components/pageContainer";
import { Welcome } from "@/components/welcome";
import * as React from 'react';
import { redirect, useRouter } from 'next/navigation';
import Image from "next/image";
import styles from './page.module.css'
import { Button } from "@/components/button";
import { updateUserPassword } from "./actions";

export default function LoginPage() {

    const router = useRouter();
    
    const [resetFormData, setResetFormData] = React.useState({
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            if(value[value.length - 1] == " ") return;
            setResetFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
    };

    const handleSubmit = async () => {
        if(resetFormData.password !== resetFormData.confirmPassword) {
            setErrorMessage("Passwords don't match")
        }
        else {
            let error = await updateUserPassword(resetFormData.password)
            setErrorMessage(error);
        }
    }

    const buttonDisabled = !resetFormData.password || !resetFormData.confirmPassword

    return (
        <PageContainer>
            <Welcome />
            <div className={styles.card}>
                <div className={styles["reset-password-message"]}>
                    Reset Password
                    <p>Enter new password</p>
                </div>
                <div className={styles["input-container"]}>
                    <Image
                        src="/password.svg"
                        alt="password icon"
                        width={18}
                        height={18}
                        priority
                    />
                    <input value={resetFormData.password} onChange={handleFormChange} className={styles.input} type={showPassword ? "text" : "password"} placeholder="Password*" name="password" />    
                    <div className={styles["toggle-visibility"]} onClick={() => {setShowPassword(!showPassword)}}>
                        <Image
                            src="/eye.svg"
                            alt="show password icon"
                            width={18}
                            height={18}
                        />
                    </div> 
                </div>
                <div className={styles["input-container"]}>
                    <Image
                        src="/password.svg"
                        alt="confirm password icon"
                        width={18}
                        height={18}
                        priority
                    />
                    <input value={resetFormData.confirmPassword} onChange={handleFormChange} className={styles.input} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password*" name="confirmPassword"/>
                    <div className={styles["toggle-visibility"]} onClick={() => {setShowConfirmPassword(!showConfirmPassword)}}>
                        <Image
                            src="/eye.svg"
                            alt="show password icon"
                            width={18}
                            height={18}
                        />
                    </div> 
                </div>
                <p className={styles["error"]}>{errorMessage}</p>
                <div className={styles["button-container"]}>
                    <Button primaryAction={handleSubmit} label={"Continue"} disabled={buttonDisabled} />
                    <div className={styles["remembered-password"]}>
                        {"Remembered your password? "}
                        <p onClick={() => {router.push("/login")}}>
                            Log in
                        </p>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}