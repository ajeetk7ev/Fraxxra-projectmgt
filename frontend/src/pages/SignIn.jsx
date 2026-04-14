import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setLoading, setUser } from "@/store/slices/authSlice";
import authApi from "@/services/auth.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "@/assets/fraxxra.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    const response = await authApi.login(data);
    
    if (response.success) {
      dispatch(setUser(response.data.data.user));
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      dispatch(setLoading(false));
      toast.error(response.message);
    }
  };



  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* Left Side: Branding/Illustration */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="z-10 relative">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Fraxxra Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold">Fraxxra</span>
          </div>
        </div>
        
        <div className="z-10 relative space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Manage your projects with <br />
            <span className="text-white/80">unmatched efficiency.</span>
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-md">
            Join thousands of teams who use Fraxxra to streamline their workflow and deliver results faster.
          </p>
        </div>

        <div className="z-10 relative flex gap-8 py-4 border-t border-white/10">
          <div>
            <p className="text-2xl font-bold">10k+</p>
            <p className="text-sm text-primary-foreground/60">Active Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-sm text-primary-foreground/60">Uptime</p>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full -ml-40 -mb-40 blur-3xl" />
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-8 bg-[#F8FAFC] dark:bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground">Please enter your details to sign in.</p>
          </div>



          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-11 bg-white/50 dark:bg-card border-border/50"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 bg-white/50 dark:bg-card border-border/50 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
