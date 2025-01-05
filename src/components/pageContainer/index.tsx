import * as React from 'react';
import styles from './pageContainer.module.css'

interface ContainerProps {
    children: React.ReactNode
}

export const PageContainer: React.FC<ContainerProps> = ({children}) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}