import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SellerHeader } from "../../../layouts";
import { TextField } from "@mui/material";

const sellerInstructions = [
    {
        heading: "Apply",
        text: "Apply for a seller account and wait until your application gets accepted.",
        image: "apply.svg",
    },
    {
        heading: "Onboarding",
        text: "Login to your account and complete the onboarding after the approval of your application.",
        image: "onboarding.svg",
    },
    {
        heading: "List Products",
        text: "List your products and make everyone know you sell.",
        image: "products.svg",
    },
    {
        heading: "Orders & Payments",
        text: "Complete the orders and get paid within 7 days from the date of dispatch.",
        image: "orders.svg",
    },
];

const MainPage = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className={`z-[5100] fixed top-0 left-0 right-0 bg-white`}>
                <SellerHeader />
            </div>
            <div className="flex-center flex-col bg-white w-full">
                <div className="flex max-w-[1280px] w-full h-[80vh] justify-between items-center">
                    <div className="flex flex-col gap-[2rem]">
                        <h2 className="text-[60px] font-extrabold text-mediumGray leading-tight">
                            Become a seller
                            <br />
                            on Genie
                        </h2>
                        <Link
                            className="btn-fill shadow-lg w-[200px] h-[2.7rem] rounded-[3px]"
                            to="/seller/apply"
                        >
                            Start Selling
                        </Link>
                    </div>
                    <img
                        className="relative w-[500px] z-1"
                        src="/sell.svg"
                        alt="sell on genie image"
                    />
                </div>
                <img src="/wave-3.svg" />
                <div className="flex-center flex-col w-full gap-[5rem] pb-[4rem] bg-primary px-[0.5rem]">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.2 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="text-white text-[50px] font-bold"
                    >
                        How to Sell on Genie?
                    </motion.h2>
                    <div className="grid grid-cols-4 justify-items-center w-full">
                        {sellerInstructions.map((i, key) => (
                            <motion.div
                                initial={{ opacity: 0, y: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: key * 0.25,
                                }}
                                viewport={{ once: true, amount: 0.5 }}
                                key={key}
                                className="flex shadow-xl flex-col gap-y-[2rem] rounded-[4px] w-[335px] bg-white p-[2.5rem]"
                            >
                                <img
                                    className="self-center max-h-[185px]"
                                    src={`/${i.image}`}
                                    alt={i.heading}
                                />
                                <div className="flex flex-col gap-[1.2rem]">
                                    <h4 className="text-[25px] text-mediumGray font-bold">
                                        {i.heading}
                                        <div className="w-[40px] h-[3px] bg-primary"></div>
                                    </h4>
                                    <p className="text-[13px] text-mediumGray1 font-light">
                                        {i.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <img className="rotate-180" src="/wave-3.svg" />
                <div className="flex pb-[5rem] max-w-[1280px] w-full justify-between items-center">
                    <div className="w-full flex flex-col gap-[2rem]">
                        <div className="flex flex-col">
                            <motion.h2
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: 0.15 }}
                                viewport={{ once: true, amount: 0.5 }}
                                className="text-mediumGray text-[50px] font-bold"
                            >
                                Having doubts?
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: 0.3 }}
                                viewport={{ once: true, amount: 0.5 }}
                                className="text-[14px] text-mediumGray1 font-normal"
                            >
                                Ask Genie and will get back to you
                            </motion.p>
                        </div>
                        <motion.form
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: 0.45 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="flex flex-col gap-y-[2rem] w-[70%]"
                        >
                            <TextField
                                id="outlined"
                                label="Full Name"
                                type="text"
                                variant="outlined"
                                size="normal"
                                InputProps={{
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: "2px",
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                    },
                                }}
                                fullWidth
                                value={fullName}
                                onChange={handleFullNameChange}
                                required
                            />
                            <TextField
                                id="outlined"
                                label="Email"
                                type="email"
                                variant="outlined"
                                size="normal"
                                InputProps={{
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: "2px",
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                    },
                                }}
                                fullWidth
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                            <TextField
                                id="outlined"
                                label="Phone"
                                type="tel"
                                variant="outlined"
                                size="normal"
                                inputProps={{ maxLength: 10 }}
                                InputProps={{
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: "2px",
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                    },
                                }}
                                fullWidth
                                value={phone}
                                onChange={handlePhoneChange}
                                required
                            />
                            <TextField
                                id="outlined"
                                label="Type your Message"
                                type="text"
                                multiline
                                rows={4}
                                variant="outlined"
                                size="normal"
                                InputProps={{
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: "2px",
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontFamily: "Montserrat, sans-serif",
                                    },
                                }}
                                fullWidth
                                value={message}
                                onChange={handleMessageChange}
                                required
                            />

                            {/* <input
                        className={`w-full px-[1.2rem] py-[0.6rem] ${fullName.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-white"} rounded-[2px] border-mediumGray2 border-[1px] focus:outline-none focus:border-primary focus:bg-transparent transition-colors duration-200`}                         type="text"
                        placeholder='Full Name *'
                        value={fullName}
                        onChange={handleFullNameChange}
                        required
                    /> */}

                            {/* <input
                        className={`w-full px-[1.2rem] py-[0.6rem] ${email.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-white"} rounded-[2px] border-mediumGray2 border-[1px] focus:outline-none focus:border-primary focus:bg-transparent transition-colors duration-200`}
                        type="email"
                        placeholder='Email *'
                        value={email}
                        onChange={handleEmailChange}
                        required
                    /> */}
                            {/* <input
                        className={`w-full px-[1.2rem] py-[0.6rem] ${phone.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-white"} rounded-[2px] border-mediumGray2 border-[1px] focus:outline-none focus:border-primary focus:bg-transparent transition-colors duration-200`}
                        type="tel"
                        placeholder='Phone *'
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                    />
                    <textarea
                        className={`w-full resize-none px-[1.2rem] py-[0.6rem] ${message.length > 0 ? "border-mediumGray2 border-[1px]" : "bg-white"} rounded-[2px] border-mediumGray2 border-[1px] focus:outline-none focus:border-primary focus:bg-transparent transition-colors duration-200`}
                        placeholder='Type your Message *'
                        value={message}
                        onChange={handleMessageChange}
                        rows={4}
                        required
                    >
                    </textarea> */}
                            <button className="btn-fill shadow-lg w-[40%] h-[2.8rem] rounded-[4px]">
                                Send to Genie
                            </button>
                        </motion.form>
                    </div>
                    <motion.img
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: 0.6 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="w-[500px]"
                        src="/help.svg"
                    />
                </div>
            </div>
        </>
    );
};

export default MainPage;
