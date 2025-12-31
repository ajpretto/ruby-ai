import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign Up | Ruby AI",
  description: "Create your Ruby AI account",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
