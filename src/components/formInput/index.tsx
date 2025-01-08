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
}

export const FormInput: React.FC<FormInputChange> = ({value, handleChange, placeholder, name, type, icon}) => {

    const isPass = type === "password";
    const isTel = type === 'tel';
    const [isVisible, setIsVisible] = React.useState(!isPass)
    const inputType = isPass ? (isVisible ? "text" : "password") : "tel" 

    return (
        <div className={styles["input-container"]}>
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
    )
}