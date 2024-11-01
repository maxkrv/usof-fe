import RegisterForm from './components/register-form/register-form';
import AuthLayout from './layout/auth-layout';

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};
