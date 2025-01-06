import * as React from 'react';
import styles from './component.module.css'
import Image from "next/image";

interface FormInputChange {
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    name: string;
    type: 'text' | 'password';
    icon: string;
}

export const FormInput: React.FC<FormInputChange> = ({value, handleChange, placeholder, name, type, icon}) => {

    const showControls = type === "password";
    const [isVisible, setIsVisible] = React.useState(!showControls)

    return (
        <div className={styles["input-container"]}>
            <Image
                src={`/${icon}.svg`}
                alt={`/${icon} form input`}
                width={18}
                height={18}
                priority
            />
            <input value={value} onChange={handleChange} className={styles.input} type={isVisible ? "text" : "password"} placeholder={placeholder} name={name} />    
            {showControls && (<div className={styles["toggle-visibility"]} onClick={() => {setIsVisible(!isVisible)}}>
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