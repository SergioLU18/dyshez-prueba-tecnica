import * as React from 'react';
import styles from './component.module.css'
import Image from "next/image";

interface FormInputChange {
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    name: string;
    type: 'text' | 'password' | 'tel';
    icon: string;
    error?: string;
}

export const FormInput: React.FC<FormInputChange> = ({value, handleChange, placeholder, name, type, icon, error}) => {

    const isPass = type === "password";
    const isTel = type === 'tel';
    const [isVisible, setIsVisible] = React.useState(!isPass)
    const [showError, setShowError] = React.useState(false)
    const inputType = isPass ? (isVisible ? "text" : "password") : "tel"

    const shouldShowError = showError && error;

    return (
        <div style={{position: "relative"}}>
            <div className={`${styles["input-container"]} ${error ? styles["error"] : ""}`}>
                <Image
                    src={`/${icon}.svg`}
                    alt={`/${icon} form input`}
                    width={18}
                    height={18}
                    priority
                />
                {isTel && (<div className={styles["phone-prefix"]}>
                    +52
                </div>)}
                <input 
                    value={value}
                    onChange={handleChange}
                    className={styles.input}
                    type={inputType}
                    placeholder={placeholder}
                    name={name}
                    onFocus={() => {setShowError(true)}}
                    onBlur={() => {setShowError(false)}}
                />    
                {isPass && (<div className={styles["toggle-visibility"]} onClick={() => {setIsVisible(!isVisible)}}>
                    <Image
                        src="/eye.svg"
                        alt="show password icon"
                        width={18}
                        height={18}
                    />
                </div>)}
            </div>
            <div className={`${styles.tooltip} ${shouldShowError ? styles.visible : ""}`}>
                {error}
            </div>
        </div>
    )
}