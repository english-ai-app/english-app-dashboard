import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link
                to="/signin"
                className="mb-4 flex items-center gap-3"
                aria-label="English App Dashboard"
              >
                <img
                  width={48}
                  height={48}
                  src="/images/logo/logo-icon.svg"
                  alt="Logo"
                />
                <span className="text-2xl font-semibold text-white">
                  English App
                </span>
              </Link>
              <p className="max-w-sm text-center text-gray-400 dark:text-white/60">
                Nền tảng quản trị English App: quản lý người dùng, nội dung học
                tập và hoạt động trên ứng dụng.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
