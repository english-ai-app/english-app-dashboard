import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Đăng ký | English App Dashboard"
        description="Tạo tài khoản quản trị English App Dashboard."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
