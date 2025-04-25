import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Loader } from "../../../layouts";
import { sellerlogin } from "../../../features/seller/sellerThunks";
import { TextField } from "@mui/material";

const SellerLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [hover, setHover] = useState(false);

    const { isSellerAuthenticated, sellerLoading } = useSelector(
        (state) => state.seller,
    );

    const handleLoginForm = (event) => {
        event.preventDefault();

        const loginForm = new FormData();

        loginForm.set("email", email);
        loginForm.set("password", password);

        dispatch(sellerlogin(loginForm));
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    useEffect(() => {
        if (isSellerAuthenticated) {
            setEmail("");
            setPassword("");
            navigate("/seller/dashboard");
        }
    }, [isSellerAuthenticated]);

    return (
        <>
            {sellerLoading ? (
                <Loader />
            ) : (
                <div className="z-[5001] fixed left-0 top-0 w-full h-full bg-white">
                    <div className="bg-lightGray4 flex-center w-full h-full">
                        <form onSubmit={handleLoginForm}>
                            <div className="flex flex-row-reverse bg-white max-w-[1000px] w-full rounded-[5px] border-lightGray3 border-[1px] shadow-[0_1px_10px_2px_rgba(0,0,0,0.1)]">
                                <div className="flex-1 relative bg-primary flex flex-col w-full justify-between text-[25px] rounded-[0_5px_5px_0] text-white px-[3rem] py-[5rem] font-bold">
                                    <img
                                        className="w-[280px] self-center"
                                        src="/genie-logo-white.svg"
                                        alt="logo"
                                    />
                                    <p className="text-[13px] font-light text-lightGray4">
                                        By logging into seller account, I accept{" "}
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
                                    <div className="flex justify-between w-full">
                                        <Link
                                            className="btn w-[40%] rounded-[3px] text-[15px] hover:bg-tertiary hover:text-primary"
                                            to="/seller/apply"
                                        >
                                            New Seller?
                                        </Link>
                                        <Link
                                            onMouseOver={() => {
                                                setHover(true);
                                            }}
                                            onMouseLeave={() => {
                                                setHover(false);
                                            }}
                                            className={`text-[15px] text-white flex-center gap-[3px]`}
                                            to="/"
                                        >
                                            Go to Home{" "}
                                            <p
                                                className={`text-[20px] ${hover ? "mr-[-4px] ml-[4px]" : ""} transition-all`}
                                            >
                                                &#10142;
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex-[1.4] flex flex-col gap-[1.5rem] rounded-[5px_0_0_5px] w-full px-[3rem] py-[5rem]">
                                    <h3 className="text-[33px] font-bold text-mediumGray">
                                        Seller Login
                                    </h3>
                                    <div className="flex flex-col gap-[2rem]">
                                        {/* <input
                                    className={`w-full px-[1.2rem] py-[0.8rem] ${email.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-lightGray4"} rounded-[2px] border-lightGray4 border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`}
                                    type="email"
                                    placeholder='Email'
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    />
                                    <input
                                    className={`w-full px-[1.2rem] py-[0.8rem] ${password.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-lightGray4"} rounded-[2px] border-lightGray4 border-[1px] focus:outline-none focus:border-lightGray3 focus:bg-transparent transition-colors duration-200`}
                                    type="password"
                                    placeholder='Password'
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                    /> */}
                                        <TextField
                                            id="outlined"
                                            label="Email"
                                            type="email"
                                            variant="outlined"
                                            size="normal"
                                            InputProps={{
                                                sx: {
                                                    fontFamily:
                                                        "Montserrat, sans-serif",
                                                    "& .MuiOutlinedInput-notchedOutline":
                                                        { borderRadius: "2px" },
                                                },
                                            }}
                                            InputLabelProps={{
                                                sx: {
                                                    fontFamily:
                                                        "Montserrat, sans-serif",
                                                },
                                            }}
                                            fullWidth
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                        />
                                        <TextField
                                            id="outlined"
                                            label="Password"
                                            type="password"
                                            variant="outlined"
                                            size="normal"
                                            InputProps={{
                                                sx: {
                                                    fontFamily:
                                                        "Montserrat, sans-serif",
                                                    "& .MuiOutlinedInput-notchedOutline":
                                                        { borderRadius: "2px" },
                                                },
                                            }}
                                            InputLabelProps={{
                                                sx: {
                                                    fontFamily:
                                                        "Montserrat, sans-serif",
                                                },
                                            }}
                                            fullWidth
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                    </div>
                                    {/* <div className='flex justify-end text-[14px]'>
                                    <Link className='hover:text-primary'>forgot password?</Link>
                                </div> */}
                                    <div className="flex flex-col w-full gap-[1.5rem]">
                                        <button className="btn-fill w-full h-[3.1rem] rounded-[2px] text-[18px]">
                                            Login
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default SellerLogin;
