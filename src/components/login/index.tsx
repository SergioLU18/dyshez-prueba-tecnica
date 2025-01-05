import * as React from 'react';
import styles from "./component.module.css";
import Image from "next/image";
import { login, resetPassword } from './actions';
import { ThirdPartyLogin, thirdPartyLogins } from './constants';
import { Button } from '../button';

export const Login: React.FC = () => {

    const [isLogin, setIsLogin] = React.useState(true);
    const [forgotPassword, setForgotPassword] = React.useState(false);
    const [resetSent, setResetSent] = React.useState(false);
    const [userFormData, setUserFormData] = React.useState({
        email: "",
        password: ""
    })
    const loginFormRef = React.useRef<HTMLFormElement>(null);
    const [submitError, setSubmitError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const loginRef = React.useRef<HTMLButtonElement>(null);
    const signupRef = React.useRef<HTMLButtonElement>(null);

    const toggleForgotPassword = () => {
        setUserFormData({
            email: "",
            password: ""
        })
        setSubmitError("");
        setForgotPassword(!forgotPassword);
    }
    
    const toggleIsLogin = () => {
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
        setUserFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
        
    const submitButtonDisabled = loading || !userFormData.email || (!forgotPassword && !userFormData.password);
    
    const showThirdPartyLogins = !forgotPassword && !resetSent;
    
    const headerMessage = isLogin ? "Log in with your e-mail or your phone number." : "Join the revolution! To begin using our services, enter your personal information below and join the Dyshez movement."
   
    const resetPasswordMessage = resetSent ? `An email with instructions to reset your password has been sent to ${userFormData.email}` : "Enter the email associated with your account and we will send you an email with instructions for forgetting your password"
    
    return (
        <div className={`${styles["card"]} ${!isLogin ? styles["signup"] : forgotPassword ? styles["forgot-password"] : ""}`}>

            {/* HEADER */}
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

            {/* LOGIN VIEW */}
            {!resetSent && (<form className={styles["login-form"]} onSubmit={handleSubmit} ref={loginFormRef}>
                <div className={styles["login-inputs"]}>
                    <div className={styles["input-container"]}>
                        <Image
                            src={`${!forgotPassword ? "/at-regular.svg" : "/email.svg"}`}
                            alt="At or phone icon"
                            width={18}
                            height={18}
                            priority
                        />
                        <input value={userFormData.email} onChange={handleFormChange} name="email" className={styles.input} type="text" placeholder={`${!forgotPassword ? "E-mail or phone number" : "E-mail*"}`} />
                    </div>
                    {!forgotPassword && (<div className={styles["input-container"]}>
                        <Image
                            src="/password.svg"
                            alt="password icon"
                            width={18}
                            height={18}
                            priority
                        />
                        <input value={userFormData.password} onChange={handleFormChange} name="password" className={styles.input} type="password" placeholder='Password' />
                    </div>)}
                    {!forgotPassword && <p className={styles["login-error-message"]}>{submitError}</p>}
                </div>
                <div className={styles["login-button-container"]}>
                    <Button primaryAction={handleCustomSubmit} label="Continue" disabled={submitButtonDisabled} />
                    <div className={styles["forgot-password"]}>
                        {!forgotPassword ? "Forgot your password? " : "Remembered your password? "}
                        <p onClick={toggleForgotPassword}>
                            {!forgotPassword ? "Reset it." : "Log in."}
                        </p>
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
        </div>
    );
};