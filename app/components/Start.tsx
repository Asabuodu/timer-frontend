

"use client";
import React from "react";
import Splash from "../components/Splash";
import Image from "next/image";


const StartPage = () => {

    return (
        
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white border-2 border-white shadow-lg rounded-xl p-6">
            <Splash show={true} onClose={() => {}} /> 

        <div className="flex flex-col items-center justify-center border-2 border-white min-h-screen      
            bg-gradient-to-r from-white via-blue-100 to-white-100 p-6">
                <div className="text-6xl md:text-8xl items-center w-40 mb-4 mx-auto text-amber-500 font-bold">

                    <Image src="/vector.png" alt="logo" width={120} height={120} className="mx-auto mb-2"/>
                </div>

                <h1 className="text-5xl md:text-5xl font-light text-black">Simp</h1>
                
                <p className="mt-10 text-gray-600 text-md md:text-xl font-medium text-center">
                    Your personal time schedule <br /> Any Where,  Any Time.
                </p>

            <div className="flex flex-col items-center justify-center mt-8">
            <button onClick={
                () => {
                    window.location.href = "/home";
                }
            } className="bg-amber-500 text-white px-6 py-3 rounded-full mt-6 hover:bg-amber-600 transition-all duration-300 font-semibold" style={{ fontSize: "1.2rem" }
            }>Quick Schedule</button>

            <p className="text-gray-900 font-sans  mt-2 ">OR</p>

            <button onClick={
                () => {
                    window.location.href = "/signup";
                }
            } className="bg-gray-400 text-white px-6 py-3 rounded-full mt-2 hover:bg-gray-700 transition-all duration-300 font-semibold" style={{ fontSize: "1.2rem" }
            }>Signup</button>

            </div>

                <p className="text-gray-950 text-center mt-10">
                    A simple and intuitive timer app to help you manage your time effectively.
                </p>

            </div>
        </div>
    );
};

export default StartPage;