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
import { isNumber, formatPhoneNumber } from "../../../utils/helpers";

export default function LoginPage() {
    
    const [formData, setformData] = React.useState(initialFormData)
    const [isLogin, setIsLogin] = React.useState(false);
    const [forgotPassword, setForgotPassword] = React.useState(false);
    const [resetSent, setResetSent] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [otpActive, setOtpActive] = React.useState(false);
    const [termsChecked, setTermsChecked] = React.useState(false)
    const [submitError, setSubmitError] = React.useState("");
    
    const loginFormRef = React.useRef<HTMLFormElement>(null);
    const signupFormRef = React.useRef<HTMLFormElement>(null);
    const loginRef = React.useRef<HTMLButtonElement>(null);
    const signupRef = React.useRef<HTMLButtonElement>(null);

    const toggleForgotPassword = () => {
        setformData(initialFormData)
        setSubmitError("");
        setForgotPassword(!forgotPassword);
    }
    
    const toggleIsLogin = () => {
        setformData(initialFormData)
        setIsLogin(!isLogin);
    }
    
    const handleSubmit = async () => {
        setSubmitError("");
        setLoading(true);
        const formElement = loginFormRef.current as HTMLFormElement
        const formData = new FormData(formElement);
        if(isLogin) {
            if(!forgotPassword) {
                const error = await login(formData);
                if(error) {
                    setSubmitError("We couldn't find an account with the provided credentials. Please try again.");
                }
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
        else {
            // TODO: Signup logic will go here
        }
        setLoading(false)
    }
    
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        const n = value.length
        let processedValue = value
        // Prevent users from adding spaces to fields that shouldn't have them
        if(name === "password" || name === "confirmPassword" || name === "email") {
            processedValue = processedValue.replace(/\s+/g, '');
        }
        // Remove non numeric characters and limit to 10 numbers
        else if(name === "mobile" || name === "phone") {
            processedValue = value.replace(/\D/g, "").slice(0, 10)
        }
        setformData((prevFormData) => ({
            ...prevFormData,
            [name]: processedValue,
        }));
    };
        
    const submitButtonDisabled = loading || !formData.email || (!forgotPassword && !formData.password);
    const showThirdPartyLogins = !forgotPassword && !resetSent && isLogin;
    
    const headerMessage = isLogin ? "Log in with your e-mail or your phone number." : "Join the revolution! To begin using our services, enter your personal information below and join the Dyshez movement."
    const resetPasswordMessage = resetSent ? `An email with instructions to reset your password has been sent to ${formData.email}` : "Enter the email associated with your account and we will send you an email with instructions for forgetting your password"
    const submitButtonLabel = isLogin ? "Continue" : "Create account"
    const subActionLabel = !isLogin ? "If you already have a dyshez account and want to add a new branch, learn how to do it" : !forgotPassword ? "Forgot your password? " : "Remembered your password? "

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

                    {!resetSent && (<form className={styles["login-form"]} ref={loginFormRef}>
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
                        {!isLogin && (<form className={styles["signup-inputs"]} ref={signupFormRef}>
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
                                value={formatPhoneNumber(formData.mobile)}
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
                                placeholder="Password*"
                                name="password"
                                type="password"
                                handleChange={handleFormChange}
                                icon="password"
                            />
                            <FormInput
                                value={formData.confirmPassword}
                                placeholder="Confirm password*"
                                name="confirmPassword"
                                type="password"
                                handleChange={handleFormChange}
                                icon="password"
                            />
                        </form>)}
                        {!isLogin && (
                            <div className={styles["terms"]}>
                                <div className={`${styles["checkbox-container"]} ${termsChecked ? styles["checked"] : ""}`} onClick={() => {setTermsChecked(!termsChecked)}}>
                                    {termsChecked && (<Image
                                        src="./check.svg"
                                        alt="check icon"
                                        width={12}
                                        height={12}
                                        priority
                                    />)}
                                </div>
                                <p>I agree to the terms and conditions</p>
                            </div>
                        )}
                        <div className={styles["login-button-container"]}>
                            <Button primaryAction={handleSubmit} label={submitButtonLabel} disabled={submitButtonDisabled} />
                            <div className={styles["forgot-password"]}>
                                {subActionLabel}
                                {isLogin && (<p onClick={toggleForgotPassword}>
                                    {!forgotPassword ? "Reset it." : "Log in."}
                                </p>)}
                            </div>
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
