"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    const callbackUrl = searchParams.get("callbackUrl") ?? "/products";
    const result = await signIn("credentials", {
      ...values,
      callbackUrl,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  });

  return (
    <section className="rounded-xl border border-[#346739]/20 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1f4122]">Login</h1>
      <p className="mt-1 text-sm text-slate-600">Sign in with your credentials.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input placeholder="Email" {...form.register("email")} />
        <Input type="password" placeholder="Password" {...form.register("password")} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        No account?{" "}
        <Link href="/register" className="font-semibold text-[#346739]">
          Register
        </Link>
      </p>
    </section>
  );
}
