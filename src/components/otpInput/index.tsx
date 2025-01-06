import * as React from 'react';
import styles from './component.module.css'
import Image from "next/image";
import LoadingDots from '../loadingDots';

interface OTPInputProps {
    length: number;
}

const allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

export const OTPInput: React.FC<OTPInputProps> = ({length}) => {

    const [otp, setOtp] = React.useState(new Array(length).fill(""))
    const [timer, setTimer] = React.useState<number | null>(null)
    const [loading, setLoading] = React.useState(false)
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

    React.useEffect(() => {
        if(inputsRef.current[0]) {
            inputsRef.current[0].focus()
        }
    }, [])

    React.useEffect(() => {
        let tempTimer: NodeJS.Timeout;
    
        if (timer !== null && timer > 0) {
          tempTimer = setInterval(() => {
            setTimer((prevTime) => (prevTime !== null ? prevTime - 1 : null));
          }, 1000);
        } else if (timer === 0) {
          setTimer(null);
        }
    
        return () => clearInterval(tempTimer);
    }, [timer]);
    
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
            setLoading(true)
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

    const handleResendOtp = () => {
        if(!canResendMessage) return
        setTimer(30);
    }

    const canResendMessage = timer === null
    const resendMessage = canResendMessage ? "Resend it." : `Try again in ${timer}s.`

    return (
        <div className={styles["otp-container"]}>
            <div className={styles["header"]}>
                <Image
                    src="/mobile.svg"
                    alt="otp icon"
                    width={58}
                    height={58}
                    priority
                />
                OTP Verification
                <p>Please, enter the OTP sent to your phone number</p>
            </div>
            {loading ? (<LoadingDots />) : (
                <div className={styles["main-content"]}>
                    <div className={styles["otp-inputs"]}>
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
                    <div className={`${styles["resend"]} ${!canResendMessage ? styles["locked"] : ""}`}>
                        {"Didn't get a code? "}
                        <p onClick={handleResendOtp}>
                            {resendMessage}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}