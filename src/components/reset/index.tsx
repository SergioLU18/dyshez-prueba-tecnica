import * as React from 'react';
import styles from './component.module.css'
import { Button } from '../button';

export const Reset: React.FC = () => {

    return (
        <div className={styles.card}>
            <div className={styles["reset-password-message"]}>
                Reset Password
                <p>Enter new password</p>
            </div>
            <Button primaryAction={() => {console.log("button clicked")}} label={"Continue"} />
        </div>
    )
}