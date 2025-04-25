import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import {
    sendotp,
    loginsignup,
    signupuser,
} from "../../../features/user/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { LoginLoader } from "../../../layouts";

const Login = ({ trigger, setTrigger }) => {
    const [Email, setEmail] = useState("");
    const [OTP, setOTP] = useState("");
    const [fullName, setFullName] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [tempEmail, setTempEmail] = useState("");
    const [newUserSignup, setNewUserSignup] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loadingLogin, isAuthenticated, isLoggingIn, newUser, OTPSent } =
        useSelector((state) => state.user);

    const closeLogin = () => {
        setTrigger(false);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleOTPChange = (event) => {
        setOTP(event.target.value);
    };

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();

        dispatch(sendotp(Email));
    };

    const handleOTPSubmit = async (event) => {
        event.preventDefault();

        const verifyForm = new FormData();

        verifyForm.set("email", tempEmail);
        verifyForm.set("otp", OTP);

        dispatch(loginsignup(verifyForm));
    };

    const handleFullNameSubmit = async (event) => {
        event.preventDefault();

        const signupForm = new FormData();

        signupForm.set("email", tempEmail);
        signupForm.set("fullname", fullName);

        dispatch(signupuser(signupForm));

        setFullName("");
    };

    useEffect(() => {
        if (trigger) {
            setEmail("");
            setTempEmail("");
            setOTP("");
            setOtpSent(false);
            setFullName("");
            setNewUserSignup(false);
        }
    }, [trigger]);

    useEffect(() => {
        if (OTPSent) {
            setOtpSent(true);
            setTempEmail(Email);
            setEmail("");
        }

        if (newUser) {
            setNewUserSignup(true);
        }

        if (isAuthenticated && isLoggingIn) {
            setTrigger(false);
            navigate("/");
            window.location.reload();
        }
    }, [OTPSent, newUser, isAuthenticated, isLoggingIn]);

    return (
        <>
            {trigger && (
                <div className="fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.7)] flex-center backdrop-blur-[6px]">
                    <div className="relative w-auto h-auto rounded-[4px] bg-white shadow-[0_4px_30px_-5px_rgba(0,0,0,0.4)]">
                        <FontAwesomeIcon
                            className="z-[100] absolute top-2 right-2 cursor-pointer hover:text-mediumGray2"
                            onClick={closeLogin}
                            icon={faClose}
                        />
                        <div className="flex">
                            <div className="flex justify-between items-center flex-col bg-primary px-[3rem] py-[4rem] rounded-[4px_0_0_4px]">
                                <h2 className="flex-center w-full select-none cursor-default font-extrabold text-[30px] text-white text-center">
                                    <img
                                        className="w-[200px]"
                                        src="/genie-logo-white.svg"
                                        alt=""
                                    />
                                </h2>
                                <p className="max-w-[200px] text-[11px] text-dimWhite">
                                    By creating or logging into account, I
                                    accept{" "}
                                    <Link
                                        className="underline hover:text-white"
                                        to="/terms-and-conditions"
                                    >
                                        Terms & Conditions
                                    </Link>{" "}
                                    &{" "}
                                    <Link
                                        className="underline hover:text-white"
                                        to="/privacy-policy"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>
                            <div className="relative px-[3.5rem] py-[5rem] flex flex-col gap-[3rem]">
                                {loadingLogin && (
                                    <div className="z-[1000] absolute top-0 right-0 w-full h-full rounded-[0_4px_4px_0] flex-center bg-white">
                                        <LoginLoader />
                                    </div>
                                )}
                                <h3 className="font-semibold text-[20px] text-mediumGray">
                                    {otpSent
                                        ? newUserSignup
                                            ? "Enter Full Name"
                                            : "Enter OTP"
                                        : "Login/Signup"}
                                </h3>
                                {otpSent ? (
                                    newUserSignup ? (
                                        <form
                                            onSubmit={handleFullNameSubmit}
                                            encType="multipart/form-data"
                                        >
                                            <div className="flex flex-col gap-[3rem]">
                                                <div className="relative">
                                                    <input
                                                        className="input-theme"
                                                        type="text"
                                                        value={fullName}
                                                        onChange={
                                                            handleFullNameChange
                                                        }
                                                        required
                                                    />
                                                    <div
                                                        className={`placeholder ${
                                                            fullName.length > 0
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        Full Name
                                                    </div>
                                                </div>
                                                <div>
                                                    {loadingLogin ? (
                                                        <button
                                                            disabled
                                                            className="btn-fill rounded-[3px] text-[15px] w-full"
                                                        >
                                                            Confirm
                                                        </button>
                                                    ) : (
                                                        <button className="btn-fill rounded-[3px] text-[15px] w-full">
                                                            Confirm
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <form
                                            onSubmit={handleOTPSubmit}
                                            encType="multipart/form-data"
                                        >
                                            <div className="flex flex-col gap-[3rem]">
                                                <div className="relative">
                                                    <input
                                                        className="input-theme"
                                                        type="text"
                                                        maxLength={6}
                                                        value={OTP}
                                                        onChange={
                                                            handleOTPChange
                                                        }
                                                        required
                                                    />
                                                    <div
                                                        className={`placeholder ${
                                                            OTP.length > 0
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                        OTP
                                                    </div>
                                                </div>
                                                <div>
                                                    {loadingLogin ? (
                                                        <button
                                                            disabled
                                                            className="btn-fill rounded-[3px] text-[15px] w-full"
                                                        >
                                                            Confirm
                                                        </button>
                                                    ) : (
                                                        <button className="btn-fill rounded-[3px] text-[15px] w-full">
                                                            Confirm
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    )
                                ) : (
                                    <form
                                        onSubmit={handleEmailSubmit}
                                        encType="multipart/form-data"
                                    >
                                        <div className="flex flex-col gap-[3rem]">
                                            <div className="relative">
                                                <input
                                                    className="input-theme"
                                                    type="email"
                                                    value={Email}
                                                    onChange={handleEmailChange}
                                                    required
                                                />
                                                <div
                                                    className={`placeholder ${
                                                        Email.length > 0
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    Email
                                                </div>
                                            </div>
                                            <div>
                                                {loadingLogin ? (
                                                    <button
                                                        disabled
                                                        className="btn-fill rounded-[3px] text-[15px] w-full"
                                                    >
                                                        Send OTP
                                                    </button>
                                                ) : (
                                                    <button className="btn-fill rounded-[3px] text-[15px] w-full">
                                                        Send OTP
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
