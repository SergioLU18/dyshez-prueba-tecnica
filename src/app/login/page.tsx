'use client'

import styles from "./page.module.css";
import Image from "next/image";
import { Welcome } from "@/components/welcome";
import { PageContainer } from "@/components/pageContainer";
import { ThirdPartyLogin, thirdPartyLogins, initialFormData, initialFormErrors } from './constants';
import * as React from 'react';
import { login, resetPassword, signup } from "./actions";
import { Button } from "@/components/button";
import { OTPInput } from "@/components/otpInput";
import { FormInput } from "@/components/formInput";
import { formatPhoneNumber } from "../../../utils/helpers";

export default function LoginPage() {
    
    const [formData, setformData] = React.useState(initialFormData)
    const [formErrors, setFormErrors] = React.useState(initialFormErrors)
    const [isLogin, setIsLogin] = React.useState(true);
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
        setFormErrors(initialFormErrors)
    }
    
    const toggleIsLogin = () => {
        setformData(initialFormData)
        setFormErrors(initialFormErrors)
        setIsLogin(!isLogin);
        setSubmitError("")
        setTermsChecked(false)
    }

    const checkFormErrors = () => {
        const newErrors = {...initialFormErrors};
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if(!emailRegex.test(formData.email)) {
            newErrors.email = "Please, enter a valid eamil"
        }
        if(!formData.password && !forgotPassword) {
            newErrors.password = "Please, enter a password"
        }
        if(!isLogin) {
            if(!formData.names) {
                newErrors.names = "Please, enter your name(s)"
            }
            if(!formData.lastNames) {
                newErrors.lastNames = "Please, enter your last name(s)"
            }
            if(formData.password !== formData.confirmPassword) {
                newErrors.password = newErrors.confirmPassword = "Passwords must match"
            }
            if(formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters"
            }
            if(formData.confirmPassword.length < 6) {
                newErrors.confirmPassword = "Password must be at least 6 characters"
            }
            if(formData.mobile.length < 10) {
                newErrors.mobile = "Please, enter a valid phone number"
            }
            if(formData.phone.length > 0 && formData.phone.length < 10) {
                newErrors.phone = "Please, enter a valid phone number"
            }
            if(!termsChecked) {
                newErrors.terms = "Please, agree to the terms and conditions"
            }
        }
        return newErrors;
    }

    const toggleTermsChecked = () => {
        setTermsChecked(!termsChecked);
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            terms: ""
        }))
    }
    
    const handleSubmit = async () => {
        const newErrors = checkFormErrors();
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            ...newErrors
        }))
        // If any errors were found, prevent submit
        if(Object.values(newErrors).some((value) => value.trim() !== '')) return
        setSubmitError("");
        setLoading(true);
        if(isLogin) {
            const formElement = loginFormRef.current as HTMLFormElement
            const formData = new FormData(formElement);
            if(!forgotPassword) {
                const error = await login(formData);
                if(error) {
                    setSubmitError(error.message);
                }
            }
            else {
                setResetSent(true);
                const error = await resetPassword(formData);
                if(!error) {
                    setResetSent(true);
                }
                else {
                    setSubmitError(error.message);
                }
            }
        }
        else {
            const formElement = signupFormRef.current as HTMLFormElement
            const formData = new FormData(formElement)
            const error = await signup(formData);
            if(error) {
                setSubmitError(error.message)
            }
        }
        setLoading(false)
    }
    
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        let processedValue = value
        // Prevent users from adding spaces to fields that shouldn't have them
        if(name === "password" || name === "confirmPassword" || name === "email") {
            processedValue = processedValue.replace(/\s+/g, '');
        }
        // Remove non numeric characters and limit to 10 numbers
        else if(name === "mobile" || name === "phone") {
            processedValue = value.replace(/\D/g, "").slice(0, 10)
        }
        // Assume user corrected their error and remove it
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ""
        }))
        setformData((prevFormData) => ({
            ...prevFormData,
            [name]: processedValue,
        }));
    };

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

                    {!resetSent && (<div className={styles["login-form"]}>
                        {/* LOGIN VIEW */}
                        {isLogin && (<form className={styles["login-inputs"]} ref={loginFormRef}>
                            <FormInput 
                                value={formData.email} 
                                placeholder={`${!forgotPassword ? "E-mail or phone number" : "E-mail*"}`}
                                name="email"
                                type="text"
                                handleChange={handleFormChange} 
                                icon="email"
                                error={formErrors.email}
                            />
                            {!forgotPassword && (
                                <FormInput 
                                    value={formData.password}
                                    placeholder='Password'
                                    name='password'
                                    type="password"
                                    handleChange={handleFormChange} 
                                    icon="password"
                                    error={formErrors.password}
                                />
                            )}
                        </form>)}
                        {/* SIGNUP VIEW */}
                        {!isLogin && (<form className={styles["signup-inputs"]} ref={signupFormRef}>
                            <FormInput
                                value={formData.names}
                                placeholder="Name(s)*"
                                name="names"
                                type="text"
                                handleChange={handleFormChange}
                                icon="user"
                                error={formErrors.names}
                            />
                            <FormInput
                                value={formData.lastNames}
                                placeholder="Last Name(s)*"
                                name="lastNames"
                                type="text"
                                handleChange={handleFormChange}
                                icon="user"
                                error={formErrors.lastNames}
                            />
                            <FormInput
                                value={formatPhoneNumber(formData.mobile)}
                                placeholder="123 456 7890*"
                                name="mobile"
                                type="tel"
                                handleChange={handleFormChange}
                                icon="mobile"
                                error={formErrors.mobile}
                            />
                            <FormInput
                                value={formatPhoneNumber(formData.phone)}
                                placeholder="123 456 7890"
                                name="phone"
                                type="tel"
                                handleChange={handleFormChange}
                                icon="phone"
                                error={formErrors.phone}
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
                                error={formErrors.email}
                            />
                            <FormInput
                                value={formData.password}
                                placeholder="Password*"
                                name="password"
                                type="password"
                                handleChange={handleFormChange}
                                icon="password"
                                error={formErrors.password}
                            />
                            <FormInput
                                value={formData.confirmPassword}
                                placeholder="Confirm password*"
                                name="confirmPassword"
                                type="password"
                                handleChange={handleFormChange}
                                icon="password"
                                error={formErrors.confirmPassword}
                            />
                        </form>)}
                        {!forgotPassword && (<p className={styles["error-message"]}>{submitError}</p>)}
                        {!isLogin && (
                            <div className={styles["terms"]}>
                                <div className={`${styles["checkbox-container"]} ${termsChecked ? styles["checked"] : formErrors.terms ? styles["error"] : ""}`} onClick={toggleTermsChecked}>
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
                            <Button primaryAction={handleSubmit} label={submitButtonLabel} disabled={loading} />
                            <div className={styles["forgot-password"]}>
                                {subActionLabel}
                                {isLogin && (<p onClick={toggleForgotPassword}>
                                    {!forgotPassword ? "Reset it." : "Log in."}
                                </p>)}
                            </div>
                        </div>
                    </div>)}

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
