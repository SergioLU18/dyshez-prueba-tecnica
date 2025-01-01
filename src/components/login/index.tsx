import * as React from 'react';
import styles from "./login.module.css";
import Image from "next/image";

export const Login: React.FC = () => {

    const [login, setLogin] = React.useState(true);
    const [forgotPassword, setForgotPassword] = React.useState(false);

    const loginRef = React.useRef<HTMLButtonElement>(null);
    const signupRef = React.useRef<HTMLButtonElement>(null);

    const headerMessage = login ? "Log in with your e-mail or your phone number." : "Join the revolution! To begin using our services, enter your personal information below and join the Dyshez movement."

    const toggleForgotPassword = () => {
        // TODO: Add logic to remove error messages and reset inputs
        setForgotPassword(!forgotPassword);
    }

    return (
        <div className={`${styles["card"]} ${!login ? styles["signup"] : forgotPassword ? styles["forgot-password"] : ""}`}>

            {/* HEADER */}
            {!forgotPassword && (
                <div className={styles.header}>
                    <div className={styles['header-actions']}>
                        <button ref={loginRef} className={login ? styles['button-active'] : styles.button} onClick={() => setLogin(true)}>
                            Login
                        </button>
                        <button ref={signupRef} className={!login ? styles['button-active'] : styles.button} onClick={() => setLogin(false)}>
                            Sign Up
                        </button>
                    </div>
                    <div 
                        className={`${styles["header-actions-underline"]} ${!login ? styles["move-right"] : ""}`} 
                        style={{width: `${login ? loginRef.current?.offsetWidth : signupRef.current?.offsetWidth}px`}} 
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
            <div className={styles["login-form"]}>
                <div className={styles["login-inputs"]}>
                    <div className={styles["input-container"]}>
                        <Image
                            src={`${!forgotPassword ? "/at-regular.svg" : "/email.svg"}`}
                            alt="At or phone icon"
                            width={18}
                            height={18}
                            priority
                        />
                        <input className={styles.input} type="text" placeholder={`${!forgotPassword ? "E-mail or phone number" : "E-mail*"}`} />
                    </div>
                    {!forgotPassword && (<div className={styles["input-container"]}>
                        <Image
                            src="/password.svg"
                            alt="password icon"
                            width={18}
                            height={18}
                            priority
                        />
                        <input className={styles.input} type="password" placeholder='Password' />
                    </div>)}
                </div>
                <div className={styles["login-button-container"]}>
                    <div className={styles["login-button-container"]}>
                        <div className={styles["login-button"]}>
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
            </div>

            {!forgotPassword && (<div className={styles["login-socials"]}>
                <div className={styles["login-socials-button"]}>
                    <Image
                        src="/apple.svg"
                        alt="apple login icon"
                        width={20}
                        height={24}
                        priority
                    />
                </div>
                <div className={styles["login-socials-button"]}>
                    <Image
                        src="/google.svg"
                        alt="google login icon"
                        width={24}
                        height={24}
                        priority
                    />
                </div>
                <div className={styles["login-socials-button"]}>
                    <Image
                        src="/facebook.svg"
                        alt="facebook login icon"
                        width={24}
                        height={24}
                        priority
                    />
                </div>
            </div>)}

        </div>
    );
};