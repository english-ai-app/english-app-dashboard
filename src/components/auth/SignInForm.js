import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import {
  loginWithCredentials,
  resendOtp,
  verifyEmail,
} from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { RefreshCcw } from "lucide-react";

export default function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    try {
      if (isOtpRequired) {
        const response = await verifyEmail(otpEmail || email, otp);
        if (!response.roles?.includes("ROLE_ADMIN")) {
          setErrorMessage("Tài khoản này không có quyền truy cập trang quản trị.");
          return;
        }
        login(response);
        navigate("/", { replace: true });
        return;
      }

      const response = await loginWithCredentials(email.trim(), password);
      if (!response.roles?.includes("ROLE_ADMIN")) {
        setErrorMessage("Tài khoản này không có quyền truy cập trang quản trị.");
        return;
      }
      login(response);
      navigate("/", { replace: true });
    } catch (error) {
      if (
        error.code === "EMAIL_VERIFICATION_REQUIRED" ||
        error.code === "OTP_EXPIRED"
      ) {
        setIsOtpRequired(true);
        setOtpEmail(error.data?.email || email.trim());
        setErrorMessage(error.message || "Vui lòng xác thực email bằng mã OTP.");
        return;
      }
      setErrorMessage(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    try {
      await resendOtp(otpEmail || email);
      setErrorMessage("Mã OTP mới đã được gửi đến email.");
    } catch (error) {
      setErrorMessage(error.message || "Không thể gửi lại mã OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 text-[36px]">
            {isOtpRequired ? "Xác thực email" : "Đăng nhập"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isOtpRequired
              ? `Nhập mã OTP đã gửi đến ${otpEmail || email}.`
              : "Đăng nhập bằng email và mật khẩu tài khoản quản trị English App."}
          </p>
        </div>

        <form onSubmit={handleSignIn}>
          <div className="space-y-6">
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
                    placeholder="Nhập email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <Label>
                    Mật khẩu <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Nhập mật khẩu"
                      autoComplete="current-password"
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
                <div className="flex justify-end">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>
                    Mã OTP <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Mã OTP gồm 6 chữ số"
                    minLength={6}
                    maxLength={6}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 disabled:opacity-60"
                >
                  Gửi lại mã OTP
                </button>
              </>
            )}
            {errorMessage && (
              <p role="alert" className="text-sm text-error-500">
                {errorMessage}
              </p>
            )}
            <Button type="submit" className="w-full" size="sm" disabled={loading}>
              {loading ? (
                <RefreshCcw className="animate-spin" />
              ) : isOtpRequired ? (
                "Xác thực"
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
