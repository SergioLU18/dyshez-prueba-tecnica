import * as React from 'react';
import styles from "./login.module.css";
import Image from "next/image";

export const Login: React.FC = () => {

    const [login, setLogin] = React.useState(true);
    const [forgotPassword, setForgotPassword] = React.useState(false);

    const loginRef = React.useRef<HTMLButtonElement>(null);
    const signupRef = React.useRef<HTMLButtonElement>(null);

    const headerMessage = login ? "Ingresa con tu correo electrónico o tu número de teléfono" : "Únete a la revolución, para comenzar a utilizar la plataforma ingresa los siguientes datos y se parte del movimiento de Dyshez."

    return (
        <div className={`${styles["card"]} ${!login ? styles["signup"] : ""}`}>
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

            {/* LOGIN VIEW */}
            <div className={styles["login-form"]}>
                <div className={styles["login-inputs"]}>
                    <div className={styles["input-container"]}>
                        <Image
                            src="/at-regular.svg"
                            alt="At or phone icon"
                            width={18}
                            height={18}
                            priority
                        />
                        <input className={styles.input} type="text" placeholder='Correo o teléfono' />
                    </div>
                    <div className={styles["input-container"]}>
                        <Image
                            src="/password.svg"
                            alt="password icon"
                            width={18}
                            height={18}
                            priority
                        />
                        <input className={styles.input} type="password" placeholder='Contraseña' />
                    </div>
                </div>
                <div className={styles["login-button-container"]}>
                    <div className={styles["login-button-container"]}>
                        <div className={styles["login-button"]}>
                            <p>Continuar</p>
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
                        <p onClick={() => setForgotPassword(true)}>¿Olvidaste tu contraseña?</p>
                    </div>
                </div>
            </div>
            <div className={styles["login-socials"]}>
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
            </div>

        </div>
    );
};