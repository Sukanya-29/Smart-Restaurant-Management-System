"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat } from "lucide-react";

export default function CustomerAuthPage() {
  const router = useRouter();

  // Dummy OTP pre-filled in boxes so time waste na ho
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = () => {
    const enteredOTP = otp.join("");

    if (enteredOTP.length !== 6) {
      alert("Please enter the complete 6-digit OTP");
      return;
    }

    // Dummy Verification - koi bhi 6 digit daalo ya 123456 chalega
    alert("OTP Verified Successfully!");
    router.push("/");
  };

  const resendOTP = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
    setTimer(30);
    alert("Dummy OTP Sent: 123456");
  };

  return (
    <main className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-5">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-5">
          <div className="bg-[#3F6B63] w-20 h-20 rounded-full flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center text-[#3F6B63]">
          OTP Verification
        </h1>

        <p className="text-center text-gray-500 mt-3">
          (Dummy Mode) Enter the 6-digit code. Default is <span className="font-bold text-[#F97316]">123456</span>
        </p>

        <div className="flex justify-center gap-3 mt-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl border rounded-xl outline-none focus:border-orange-500 text-black font-semibold"
            />
          ))}
        </div>

        <button
          onClick={verifyOTP}
          className="w-full bg-[#F97316] text-white py-4 rounded-xl text-lg font-semibold mt-10 hover:bg-orange-600 transition shadow-md"
        >
          Verify & Continue
        </button>

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-gray-500">
              Resend Code in{" "}
              <span className="font-semibold text-[#F97316]">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={resendOTP}
              className="text-[#F97316] font-semibold hover:underline"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </main>
  );
}