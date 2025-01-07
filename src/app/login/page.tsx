'use client'

import styles from "./page.module.css";
import Image from "next/image";
import { Welcome } from "@/components/welcome";
import { PageContainer } from "@/components/pageContainer";
import { ThirdPartyLogin, thirdPartyLogins, initialFormData } from './constants';
import * as React from 'react';
import { login, resetPassword } from "./actions";
import { Button } from "@/components/button";
import { OTPInput } from "@/components/otpInput";
import { FormInput } from "@/components/formInput";
import { isNumber } from "../../../utils/helpers";

export default function LoginPage() {

    const [isLogin, setIsLogin] = React.useState(false);
    const [forgotPassword, setForgotPassword] = React.useState(false);
    const [resetSent, setResetSent] = React.useState(false);
    const [formData, setformData] = React.useState(initialFormData)
    const loginFormRef = React.useRef<HTMLFormElement>(null);
    const [submitError, setSubmitError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const loginRef = React.useRef<HTMLButtonElement>(null);
    const signupRef = React.useRef<HTMLButtonElement>(null);
    const [otpActive, setOtpActive] = React.useState(false);

    const toggleForgotPassword = () => {
        setformData(initialFormData)
        setSubmitError("");
        setForgotPassword(!forgotPassword);
    }
    
    const toggleIsLogin = () => {
        setformData(initialFormData)
        setIsLogin(!isLogin);
    }
    
    const handleCustomSubmit = () => {
        if (loginFormRef.current) {
            loginFormRef.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError("");
        setLoading(true);
        const formElement = event.currentTarget as HTMLFormElement;
        const formData = new FormData(formElement);
        if(!forgotPassword) {
            const error = await login(formData);
            if(error) {
                setSubmitError("We couldn't find an account with the provided credentials. Please try again.");
            }
            setLoading(false);
        }
        else {
            setResetSent(true);
            const error = await resetPassword(formData);
            if(!error) {
                setResetSent(true);
            }
            else {
                setSubmitError("Sorry, something went wrong. Please try again.");
            }
        }
    }
    
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(value);
        if(name === "password" && value[value.length - 1] == " ") return;
        setformData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
        
    const submitButtonDisabled = loading || !formData.email || (!forgotPassword && !formData.password);
    
    const showThirdPartyLogins = !forgotPassword && !resetSent && isLogin;
    
    const headerMessage = isLogin ? "Log in with your e-mail or your phone number." : "Join the revolution! To begin using our services, enter your personal information below and join the Dyshez movement."
    
    const resetPasswordMessage = resetSent ? `An email with instructions to reset your password has been sent to ${formData.email}` : "Enter the email associated with your account and we will send you an email with instructions for forgetting your password"
    
    const submitButtonLabel = isLogin ? "Continue" : "Create account"

    return (
        <PageContainer>
            <Welcome />
            <div className={`${styles["card"]} ${!isLogin ? styles["signup"] : forgotPassword ? styles["forgot-password"] : ""}`}>
                {/* HEADER */}
                {!otpActive && (<>
                    {!forgotPassword && (
                        <div className={styles.header}>
                            <div className={styles['header-actions']}>
                                <button ref={loginRef} className={isLogin ? styles['button-active'] : styles.button} onClick={toggleIsLogin}>
                                    Login
                                </button>
                                <button ref={signupRef} className={!isLogin ? styles['button-active'] : styles.button} onClick={toggleIsLogin}>
                                    Sign Up
                                </button>
                            </div>
                            <div 
                                className={`${styles["header-actions-underline"]} ${!isLogin ? styles["move-right"] : ""}`} 
                                style={{width: `${isLogin ? loginRef.current?.offsetWidth : signupRef.current?.offsetWidth}px`}} 
                            />
                            <div className={styles.instruction}>{headerMessage}</div>
                        </div>
                    )}

                    {forgotPassword && (
                        <div className={styles["forgot-password-message"]}>
                            Reset Password
                            <p>{resetPasswordMessage}</p>
                        </div>
                    )}

                    {!resetSent && (<form className={styles["login-form"]} onSubmit={handleSubmit} ref={loginFormRef}>
                        {/* LOGIN VIEW */}
                        {isLogin && (<div className={styles["login-inputs"]}>
                            <FormInput 
                                value={formData.email} 
                                placeholder={`${!forgotPassword ? "E-mail or phone number" : "E-mail*"}`}
                                name="email"
                                type="text"
                                handleChange={handleFormChange} 
                                icon="email"
                            />
                            {!forgotPassword && (
                                <FormInput 
                                    value={formData.password}
                                    placeholder='Password'
                                    name='password'
                                    type="password"
                                    handleChange={handleFormChange} 
                                    icon="password"
                                />
                            )}
                            {!forgotPassword && <p className={styles["login-error-message"]}>{submitError}</p>}
                        </div>)}
                        {/* SIGNUP VIEW */}
                        {!isLogin && (<div>
                            <FormInput
                                value={formData.names}
                                placeholder="Name(s)*"
                                name="names"
                                type="text"
                                handleChange={handleFormChange}
                                icon="user"
                            />
                            <FormInput
                                value={formData.lastNames}
                                placeholder="Last Name(s)*"
                                name="lastNames"
                                type="text"
                                handleChange={handleFormChange}
                                icon="user"
                            />
                            <FormInput
                                value={formData.mobile}
                                placeholder="123 456 7890*"
                                name="mobile"
                                type="tel"
                                handleChange={handleFormChange}
                                icon="mobile"
                            />
                            <FormInput
                                value={formData.phone}
                                placeholder="123 456 7890"
                                name="phone"
                                type="tel"
                                handleChange={handleFormChange}
                                icon="phone"
                            /> 
                            <FormInput
                                value={formData.website}
                                placeholder="Website"
                                name="website"
                                type="text"
                                handleChange={handleFormChange}
                                icon="website"
                            />
                            <FormInput
                                value={formData.email}
                                placeholder="Email*"
                                name="email"
                                type="text"
                                handleChange={handleFormChange}
                                icon="email"
                            />
                            <FormInput
                                value={formData.password}
                                placeholder="Password(s)*"
                                name="password"
                                type="password"
                                handleChange={handleFormChange}
                                icon="password"
                            />
                            <FormInput
                                value={formData.confirmPassword}
                                placeholder="Confirm password(s)*"
                                name="confirmPassword"
                                type="password"
                                handleChange={handleFormChange}
                                icon="password"
                            />
                        </div>)}
                        <div className={styles["login-button-container"]}>
                            <Button primaryAction={handleCustomSubmit} label={submitButtonLabel} disabled={submitButtonDisabled} />
                            {isLogin && <div className={styles["forgot-password"]}>
                                {!forgotPassword ? "Forgot your password? " : "Remembered your password? "}
                                <p onClick={toggleForgotPassword}>
                                    {!forgotPassword ? "Reset it." : "Log in."}
                                </p>
                            </div>}
                        </div>
                    </form>)}

                    {showThirdPartyLogins && (<div className={styles["login-socials"]}>
                        {thirdPartyLogins.map((thirdParty: ThirdPartyLogin, index: number) => (
                            <div key={index} className={styles["login-socials-button"]}>
                                <Image
                                    src={thirdParty.icon}
                                    alt={thirdParty.altText}
                                    width={24}
                                    height={24}
                                    priority
                                />
                            </div>
                        ))}
                    </div>)}
                </>)}
                {otpActive && <OTPInput length={6} />}
            </div>
        </PageContainer>
    );
}
