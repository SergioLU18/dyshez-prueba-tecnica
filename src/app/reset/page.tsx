'use client'

import { PageContainer } from "@/components/pageContainer";
import { Welcome } from "@/components/welcome";
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css'
import { Button } from "@/components/button";
import { exchangeCodeSession, updateUserPassword } from "./actions";
import { Toaster, toast } from 'sonner'
import { FormInput } from "@/components/formInput";

export default function ResetPage() {

    const router = useRouter();
    const searchParams = useSearchParams()
    const code = searchParams.get('code');

    const [resetFormData, setResetFormData] = React.useState({
        password: "",
        confirmPassword: ""
    })
    const [errorMessage, setErrorMessage] = React.useState("");
    const [passwordUpdated, setPasswordUpdated] = React.useState(false)

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            if(value[value.length - 1] == " ") return;
            setResetFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
    };

    const handleSubmit = async () => {
        if(passwordUpdated) {
            router.push('/login')
        }
        else {
            if(resetFormData.password !== resetFormData.confirmPassword) {
                setErrorMessage("Passwords don't match")
            }
            else {
                let error = await updateUserPassword(resetFormData.password)
                if(error) {
                    toast.error(error.message)
                }
                else {
                    toast.success("Your password was updated successfully!")
                    setPasswordUpdated(true)
                }
            }
        }
    }

    const handleCode = async () => {
        // Blocks reset page if no code is present
        if(!code) {
            router.push('/login')
        }
        else {
            const error = await exchangeCodeSession(code);
            if(error) {
                toast.error(error.message)
            }
        }
    }

    React.useEffect(() => {
        if(code) {
            handleCode()
        }
    }, [code])

    const buttonDisabled = (!resetFormData.password || !resetFormData.confirmPassword) && !passwordUpdated

    return (
        <PageContainer>
            <Welcome />
            <div className={styles.card}>
                <div className={styles["reset-password-message"]}>
                    {passwordUpdated ? "Success!" : "Create new password"}
                    {!passwordUpdated && <p>Enter new password</p>}
                </div>
                {!passwordUpdated && (<FormInput 
                    value={resetFormData.password} 
                    placeholder="New password"
                    name="password"
                    type="password"
                    handleChange={handleFormChange} 
                    icon="password"
                />)}
                {!passwordUpdated && (<FormInput 
                    value={resetFormData.confirmPassword} 
                    placeholder="Confirm new password"
                    name="confirmPassword"
                    type="password"
                    handleChange={handleFormChange} 
                    icon="password"
                />)}
                <p className={styles["error"]}>{errorMessage}</p>
                <div className={styles["button-container"]}>
                    <Button primaryAction={handleSubmit} label={passwordUpdated ? "Back to login" : "Continue"} disabled={buttonDisabled} />
                    {!passwordUpdated && (<div className={styles["remembered-password"]}>
                        {"Remembered your password? "}
                        <p onClick={() => {router.push("/login")}}>
                            Log in
                        </p>
                    </div>)}
                </div>
                <Toaster richColors/>
            </div>
        </PageContainer>
    );
}