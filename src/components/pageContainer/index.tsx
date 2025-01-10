import * as React from 'react';
import styles from './component.module.css'

interface ContainerProps {
    children: React.ReactNode
    flexDirection?: 'row' | 'column'
}

export const PageContainer: React.FC<ContainerProps> = ({children, flexDirection = 'row'}) => {
    return (
        <div className={`${styles.container} ${flexDirection === 'column' ? styles.column : ""}`}>
            {children}
        </div>
    )
}