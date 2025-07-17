'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { loginAction, signupAction, forgotPasswordAction } from "@/app/(auth)/login/server/actions/auth"
import Image from "next/image"

type AuthFormType = "login" | "signup" | "forgot-password"

interface AuthFormProps extends React.ComponentProps<"div"> {
  type: AuthFormType
}

export function AuthForm({
  className,
  type,
  ...props
}: AuthFormProps) {
  // Use appropriate action based on form type
  const getAction = () => {
    switch (type) {
      case "login":
        return loginAction;
      case "signup":
        return signupAction;
      case "forgot-password":
        return forgotPasswordAction;
      default:
        return loginAction;
    }
  };

  const [state, action, isPending] = useActionState(getAction(), null);

  const getTitle = () => {
    switch (type) {
      case "login":
        return "Truck Booking Inc."
      case "signup":
        return "Create Account"
      case "forgot-password":
        return "Reset Password"
      default:
        return "Truck Booking Inc."
    }
  }

  const getSubtitle = () => {
    switch (type) {
      case "login":
        return "Login or get started with a new account."
      case "signup":
        return "Create your account to get started."
      case "forgot-password":
        return "Enter your email to receive a password reset link."
      default:
        return "Login or get started with a new account."
    }
  }

  const getButtonText = () => {
    switch (type) {
      case "login":
        return isPending ? "Signing in..." : "Login"
      case "signup":
        return isPending ? "Creating account..." : "Create Account"
      case "forgot-password":
        return isPending ? "Sending..." : "Send Reset Link"
      default:
        return "Submit"
    }
  }

  const getFooterText = () => {
    switch (type) {
      case "login":
        return (
          <>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </>
        )
      case "signup":
        return (
          <>
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4">
              Sign in
            </a>
          </>
        )
      case "forgot-password":
        return (
          <>
            Remember your password?{" "}
            <a href="/login" className="underline underline-offset-4">
              Back to login
            </a>
          </>
        )
      default:
        return null
    }
  }

  const showPasswordField = type !== "forgot-password"
  const showNameFields = type === "signup"
  const showPhoneField = type === "signup"
  const showForgotPasswordLink = type === "login"

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={action} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{getTitle()}</h1>
                <p className="text-muted-foreground text-balance">
                  {getSubtitle()}
                </p>
              </div>

              {/* Show form errors */}
              {state && !state.success && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">
                    {state.message}
                  </div>
                  {state.errors && Object.keys(state.errors).length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm text-red-600">
                      {Object.entries(state.errors).map(([field, messages]) => (
                        messages.map((message, index) => (
                          <li key={`${field}-${index}`}>{field}: {message}</li>
                        ))
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Show success message */}
              {state && state.success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-700">
                    {state.message}
                  </div>
                </div>
              )}

              {/* Name fields for signup */}
              {showNameFields && (
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    disabled={isPending}
                  />
                </div>
              )}

              {/* Email field */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isPending}
                />
              </div>

              {/* Phone field for signup */}
              {showPhoneField && (
                <div className="grid gap-3">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder="+1234567890"
                    required
                    disabled={isPending}
                  />
                </div>
              )}

              {/* Password field */}
              {showPasswordField && (
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {showForgotPasswordLink && (
                      <a
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    )}
                  </div>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required
                    disabled={isPending}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {getButtonText()}
              </Button>

              <div className="text-center text-sm">
                {getFooterText()}
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/truck.jpg"
              alt="Truck booking background"
              fill
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
