import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Đăng nhập | English App Dashboard"
        description="Đăng nhập vào cổng quản trị English App Dashboard."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
