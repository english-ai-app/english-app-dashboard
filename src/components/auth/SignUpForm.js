import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { register, resendOtp, verifyEmail } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { RefreshCcw } from "lucide-react";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setNotice("");
    setErrorMessage("");
    try {
      if (isOtpRequired) {
        const response = await verifyEmail(email, otp);
        login(response);
        navigate("/", { replace: true });
        return;
      }

      if (!isChecked) {
        setErrorMessage("Bạn cần đồng ý với điều khoản trước khi đăng ký.");
        return;
      }

      const response = await register({
        email: email.trim(),
        username: username.trim(),
        password,
      });
      setIsOtpRequired(true);
      setNotice(
        response.message ||
          "Tài khoản đã được tạo. Vui lòng nhập mã OTP được gửi đến email."
      );
    } catch (error) {
      setErrorMessage(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setNotice("");
    setErrorMessage("");
    try {
      const response = await resendOtp(email);
      setNotice(response.message || "Mã OTP mới đã được gửi.");
    } catch (error) {
      setErrorMessage(error.message || "Không thể gửi lại mã OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to sign in
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 text-[36px]">
            {isOtpRequired ? "Verify email" : "Sign Up"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isOtpRequired
              ? `Nhập mã OTP 6 chữ số đã gửi đến ${email}.`
              : "Tạo tài khoản quản trị cho English App."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {!isOtpRequired ? (
              <>
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Choose a username"
                    minLength={3}
                    maxLength={64}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={showPassword ? "text" : "password"}
                      minLength={8}
                      maxLength={72}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-[14px] text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the Terms and
                    Conditions and our Privacy Policy.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>
                    Email verification code{" "}
                    <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="6-digit OTP"
                    minLength={6}
                    maxLength={6}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Gửi lại mã OTP
                </button>
              </>
            )}

            {notice && (
              <p role="status" className="text-sm text-success-500">
                {notice}
              </p>
            )}
            {errorMessage && (
              <p role="alert" className="text-sm text-error-500">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-60"
            >
              {isLoading ? (
                <RefreshCcw className="animate-spin" />
              ) : isOtpRequired ? (
                "Verify email"
              ) : (
                "Create Admin account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
