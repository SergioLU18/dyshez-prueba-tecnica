import * as React from 'react';
import styles from './component.module.css'
import Image from "next/image";
import LoadingDots from '../loadingDots';
import { AuthError } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface OTPInputProps {
    length: number;
    onSubmit: (otp: string) => Promise<AuthError | undefined>;
    handleResend: () => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({length, onSubmit, handleResend}) => {

    const [otp, setOtp] = React.useState(new Array(length).fill(""))
    const [timer, setTimer] = React.useState<number | null>(10)
    const [loading, setLoading] = React.useState(false)
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

    const router = useRouter()

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
        const phoneRegex = /^\d+$/;
        if(!phoneRegex.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value;
        setOtp(newOtp);
        if(!value) return
        if(index < length - 1) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleOtpComplete = async () => {
        setLoading(true)
        const error = await onSubmit(otp.join(""))
        if(error) {
            setLoading(false)
            toast.error(error.message)
            setOtp(new Array(length).fill(""))
        }
        else {
            router.push('/')
        }
    }

    React.useEffect(() => {
        if(otp.join("").length === 6) {
            handleOtpComplete()
        }
    }, [otp])

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
        handleResend()
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
                <p>Please, enter the OTP sent to your pimary phone number</p>
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