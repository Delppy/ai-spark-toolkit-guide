
import Layout from "@/components/Layout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center w-full min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <ForgotPasswordForm />
      </div>
    </Layout>
  );
};

export default ForgotPassword;
