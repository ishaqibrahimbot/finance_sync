import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="-mt-12 flex items-center justify-center min-h-screen bg-slate-100">
      <SignUp />
    </div>
  );
}
