import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign In | Ruby AI",
  description: "Sign in to your Ruby AI account",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
