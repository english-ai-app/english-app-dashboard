import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import {
  registerWebAdmin,
  resendOtp,
  verifyEmail,
} from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { RefreshCcw } from "lucide-react";

const usernameFromEmail = (email) => {
  const [localPart] = email.trim().toLowerCase().split("@");
  const username = localPart
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .padEnd(3, "_")
    .slice(0, 48);
  return username || "user";
};

export default function SignUpForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [otp, setOtp] = useState("");
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setNotice("");
    setErrorMessage("");

    if (!isOtpRequired) {
      if (!fullName.trim() || !email.trim() || !inviteCode.trim()) {
        setErrorMessage("Vui lòng nhập đầy đủ họ tên, email và mã mời quản trị.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMessage("Email không đúng định dạng.");
        return;
      }
      if (!isChecked) {
        setTermsError(true);
        return;
      }
      if (password.length < 8 || password.length > 72 ||
          !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
        setErrorMessage("Mật khẩu cần có 8-72 ký tự, chữ hoa, chữ thường và số.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Mật khẩu nhập lại không khớp.");
        return;
      }
    } else if (!/^\d{6}$/.test(otp)) {
      setErrorMessage("Vui lòng nhập mã OTP gồm 6 chữ số.");
      return;
    }

    setIsLoading(true);
    try {
      if (isOtpRequired) {
        const response = await verifyEmail(email, otp);
        if (!response.roles?.includes("ROLE_ADMIN")) {
          setErrorMessage("Tài khoản này không có quyền truy cập trang quản trị.");
          return;
        }
        login(response);
        navigate("/", { replace: true });
        return;
      }

      const response = await registerWebAdmin(
        {
          email: email.trim().toLowerCase(),
          username: usernameFromEmail(email),
          password,
          displayName: fullName.trim(),
        },
        inviteCode.trim()
      );
      setIsOtpRequired(true);
      setNotice(
        response.message ||
          "Tài khoản đã được tạo. Vui lòng nhập mã OTP được gửi đến email."
      );
    } catch (error) {
      console.error("Web admin registration failed:", error);
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
            {isOtpRequired ? "Xác thực email" : "Đăng ký"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isOtpRequired
              ? `Nhập mã OTP 6 chữ số đã gửi đến ${email}.`
              : "Tạo tài khoản quản trị English App bằng mã mời."}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5">
            {!isOtpRequired ? (
              <>
                <div>
                  <Label>
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nhập họ và tên"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <Label>
                    Email <span className="text-red-500">*</span>
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
                    Mã mời quản trị <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    value={inviteCode}
                    onChange={(event) => setInviteCode(event.target.value)}
                    placeholder="Nhập mã mời do quản trị viên cung cấp"
                    autoComplete="off"
                    required
                  />
                </div>
                <div>
                  <Label>
                    Mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={showPassword ? "text" : "password"}
                      className="pr-11"
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
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
                <div>
                  <Label>
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                      className="pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      aria-label={
                        showConfirmPassword
                          ? "Ẩn mật khẩu nhập lại"
                          : "Hiện mật khẩu nhập lại"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div
                  className={`rounded-lg ${
                    termsError ? "ring-1 ring-red-500 ring-offset-2" : ""
                  }`}
                >
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={(checked) => {
                      setIsChecked(checked);
                      if (checked) setTermsError(false);
                    }}
                    label="Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật."
                  />
                </div>
                {termsError && (
                  <p role="alert" className="text-sm text-red-600">
                    Vui lòng tích đồng ý với điều khoản trước khi tạo tài khoản.
                  </p>
                )}
              </>
            ) : (
              <>
                <div>
                  <Label>
                    Mã xác thực email <span className="text-red-500">*</span>
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
                "Xác thực email"
              ) : (
                "Tạo tài khoản ADMIN"
              )}
            </button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Đã có tài khoản?{" "}
            <Link
              to="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
