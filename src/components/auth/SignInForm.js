import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { loginWithCredentials } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { RefreshCcw } from "lucide-react";

export default function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await loginWithCredentials(username.trim(), password);
      login(response);
      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 text-[36px]">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Đăng nhập bằng email hoặc username của tài khoản English App.
          </p>
        </div>

        <form onSubmit={handleSignIn}>
          <div className="space-y-6">
            <div>
              <Label>
                Email hoặc username <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Email hoặc username"
                required
              />
            </div>
            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
              </div>
              <Link
                to="/reset-password"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
            </div>
            {errorMessage && (
              <p role="alert" className="text-sm text-error-500">
                {errorMessage}
              </p>
            )}
            <Button type="submit" className="w-full" size="sm" disabled={loading}>
              {loading ? <RefreshCcw className="animate-spin" /> : "Sign in"}
            </Button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
