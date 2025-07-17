import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthFormType = "login" | "signup" | "forgot-password"

interface AuthFormProps extends React.ComponentProps<"div"> {
  type: AuthFormType
}

export function AuthForm({
  className,
  type,
  ...props
}: AuthFormProps) {
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
        return "Login"
      case "signup":
        return "Create Account"
      case "forgot-password":
        return "Send Reset Link"
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
  const showConfirmPasswordField = type === "signup"
  const showNameFields = type === "signup"
  const showGoogleAuth = type !== "forgot-password"
  const showForgotPasswordLink = type === "login"

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{getTitle()}</h1>
                <p className="text-muted-foreground text-balance">
                  {getSubtitle()}
                </p>
              </div>

              {/* Name fields for signup */}
              {showNameFields && (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </>
              )}

              {/* Email field */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

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
                  <Input id="password" type="password" required />
                </div>
              )}

              {/* Confirm Password field for signup */}
              {/* {showConfirmPasswordField && (
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" required />
                </div>
              )} */}

              <Button type="submit" className="w-full">
                {getButtonText()}
              </Button>

              {/* Google Auth for login and signup */}
              {showGoogleAuth && (
                <>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" type="button" className="w-24">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Google</span>
                    </Button>
                  </div>
                </>
              )}

              <div className="text-center text-sm">
                {getFooterText()}
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20230524/pngtree-shipment-of-trailer-or-truck-sitting-on-a-dark-background-with-image_2611130.jpg"
              alt="Truck booking background"
              className="absolute inset-0 h-full w-full object-cover"
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
