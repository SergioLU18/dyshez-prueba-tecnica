import * as React from 'react';
import styles from './component.module.css'
import Image from "next/image";

interface ButtonProps {
    label: string;
    primaryAction: () => void;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({label, primaryAction, disabled}) => {

    const handleClick = () => {
        if(disabled) return;
        primaryAction()
    }

    return (
        <div onClick={handleClick} className={`${styles["button"]} ${disabled ? styles["disabled"] : ""}`}>
            <p>{label}</p>
            <Image
                src="/arrow-right.svg"
                alt="login icon"
                width={18}
                height={18}
                priority
            />
        </div>
    )
}