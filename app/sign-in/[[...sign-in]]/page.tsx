import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="-mt-12 flex items-center justify-center min-h-screen bg-slate-100">
      <SignIn />
    </div>
  );
}
