import * as React from 'react';
import styles from './component.module.css'

interface OTPInputProps {
    length: number;
}

const allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

export const OTPInput: React.FC<OTPInputProps> = ({length}) => {

    const [otp, setOtp] = React.useState(new Array(length).fill(""))
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

    React.useEffect(() => {
        if(inputsRef.current[0]) {
            inputsRef.current[0].focus()
        }
    }, [])
    
    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if(!allowedKeys.includes(value)) return
        const newOtp = [...otp]
        newOtp[index] = value;
        setOtp(newOtp);
        if(!value) return
        if(index < length - 1) {
            inputsRef.current[index + 1]?.focus()
        }
        if(index === length - 1) {
            // TODO: Add logic for autosubmit after OTP entered
        }
    }

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Backspace") {
            const newOtp = [...otp]
            if(index > 0 && newOtp[index] === "") {
                newOtp[index - 1] = "";
            }
            newOtp[index] = "";
            setOtp(newOtp);
            inputsRef.current[index - 1]?.focus()
        }
    }

    const handleClick = (index: number) => {
        const firstEmtpyInput = otp.findIndex(value => value === "");
        inputsRef.current[firstEmtpyInput]?.focus()
    }

    const handleFocus = (index: number) => {
        inputsRef.current[index]?.select()
    }

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
    };

    return (
        <div className={styles.container}>
            {otp.map((value, index) =>
                <input 
                    key={`otp-${index}`}
                    ref={(e) => { inputsRef.current[index] = e }}
                    type="text"
                    value={value}
                    className={styles.input}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onClick={() => {handleClick(index)}}
                    onFocus={() => {handleFocus(index)}}
                    onContextMenu={handleContextMenu}
                />
            )}
        </div>
    )
}