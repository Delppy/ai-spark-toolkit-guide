
import Layout from "@/components/Layout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center w-full min-h-[80vh] py-12 bg-gradient-to-br from-slate-50 to-blue-50">
        <ResetPasswordForm />
      </div>
    </Layout>
  );
};

export default ResetPassword;
