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
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import Logo from "@/assets/fraxxra.png";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    const response = await authApi.register(data);
    
    if (response.success) {
      dispatch(setLoading(false));
      toast.success("Account created successfully! Please sign in.");
      navigate("/signin");
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
            The platform for <br />
            <span className="text-white/80">modern teams.</span>
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-md">
            Create your account in seconds and start collaborating with your team members in a beautifully unified workspace.
          </p>
        </div>

        <div className="z-10 relative flex gap-8 py-4 border-t border-white/10">
          <div>
            <p className="text-2xl font-bold">50k+</p>
            <p className="text-sm text-primary-foreground/60">Projects Built</p>
          </div>
          <div>
            <p className="text-2xl font-bold">4.9/5</p>
            <p className="text-sm text-primary-foreground/60">User Rating</p>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -ml-64 -mt-64 blur-3xl shadow-primary" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -mr-40 -mb-40 blur-3xl" />
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-8 bg-[#F8FAFC] dark:bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
            <p className="text-muted-foreground">Join us today and boost your productivity.</p>
          </div>



          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="h-11 bg-white/50 dark:bg-card border-border/50"
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

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
              <Label htmlFor="password">Password</Label>
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
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline font-semibold">Sign in</Link>
          </p>
          
          <p className="text-center text-[10px] text-muted-foreground pt-4">
            By joining, you agree to our <Link to="#" className="underline">Terms of Service</Link> and <Link to="#" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
