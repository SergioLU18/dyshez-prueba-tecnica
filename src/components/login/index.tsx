import * as React from 'react';
import styles from "./login.module.css";
import Image from "next/image";
import { login } from './actions';
import { ThirdPartyLogin, thirdPartyLogins } from './constants';

export const Login: React.FC = () => {

    const [isLogin, setIsLogin] = React.useState(true);
    const [forgotPassword, setForgotPassword] = React.useState(false);
    const loginFormRef = React.useRef<HTMLFormElement>(null);

    const loginRef = React.useRef<HTMLButtonElement>(null);
    const signupRef = React.useRef<HTMLButtonElement>(null);

    const headerMessage = isLogin ? "Log in with your e-mail or your phone number." : "Join the revolution! To begin using our services, enter your personal information below and join the Dyshez movement."

    const toggleForgotPassword = () => {
        // TODO: Add logic to remove error messages and reset inputs
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

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        const formElement = event.currentTarget as HTMLFormElement;

        const formData = new FormData(formElement);
        const error = await login(formData);
        if(error) {
            // TODO: Handle login credentials error
        }
    }

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
                    Forgot Password
                    <p>Enter the email associated with your account and we will send you an email with instructions for forgetting your password</p>
                </div>
            )}

            {/* LOGIN VIEW */}
            <form className={styles["login-form"]} onSubmit={handleLoginSubmit} ref={loginFormRef}>
                <div className={styles["login-inputs"]}>
                    <div className={styles["input-container"]}>
                        <Image
                            src={`${!forgotPassword ? "/at-regular.svg" : "/email.svg"}`}
                            alt="At or phone icon"
                            width={18}
                            height={18}
                            priority
                        />
                        <input name="email" className={styles.input} type="text" placeholder={`${!forgotPassword ? "E-mail or phone number" : "E-mail*"}`} />
                    </div>
                    {!forgotPassword && (<div className={styles["input-container"]}>
                        <Image
                            src="/password.svg"
                            alt="password icon"
                            width={18}
                            height={18}
                            priority
                        />
                        <input name="password" className={styles.input} type="password" placeholder='Password' />
                    </div>)}
                </div>
                <div className={styles["login-button-container"]}>
                    <div className={styles["login-button-container"]}>
                        <div onClick={handleCustomSubmit} className={styles["login-button"]}>
                            <p>Continue</p>
                            <Image
                                src="/arrow-right.svg"
                                alt="login icon"
                                width={18}
                                height={18}
                                priority
                            />
                        </div>
                    </div>
                    <div className={styles["forgot-password"]}>
                        {!forgotPassword ? "Forgot your password? " : "Remembered your password? "}
                        <p onClick={toggleForgotPassword}>
                            {!forgotPassword ? "Reset it." : "Log in."}
                        </p>
                    </div>
                </div>
            </form>

            {!forgotPassword && (<div className={styles["login-socials"]}>
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