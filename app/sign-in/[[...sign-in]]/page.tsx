import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login, signup } from "./actions";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-start pt-40 min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader className="space-y-2">
          <CardTitle>Welcome to Yet Another Finance App</CardTitle>
          <CardDescription>Sign in or sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-4">
            <div className="space-y-2">
              <Input placeholder="email" name="email" type="email" required />
              <Input
                placeholder="****"
                name="password"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Button formAction={login} className="w-full">
                Sign In
              </Button>
              <Button formAction={signup} className="w-full">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
