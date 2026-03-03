import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { authApi } from "../../features/auth/auth.api";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError("");
    setLoading(true);
    try {
      const { access_token } = await authApi.login(data.email, data.password);
      const user = await authApi.me(access_token);
      setAuth(access_token, user);

      if (user.role === "ADMIN" || user.role === "SELLER") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch {
      setServerError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <Link to="/" className="font-serif text-2xl text-foreground">
            URBN
          </Link>
          <h1 className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
            Sign In
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              className="border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              placeholder="your@email.com"
            />
            {errors.email && (
              <span className="text-[10px] text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              className="border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="text-[10px] text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {serverError && (
            <p className="text-[11px] text-red-500">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-foreground py-3.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-foreground underline underline-offset-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
