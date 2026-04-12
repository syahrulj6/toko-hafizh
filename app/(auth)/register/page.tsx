"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? "Failed to register");
      return;
    }

    router.push("/login");
  });

  return (
    <section className="rounded-xl border border-[#346739]/20 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-[#1f4122]">Create Account</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input placeholder="Name" {...form.register("name")} />
        <Input placeholder="Email" {...form.register("email")} />
        <Input type="password" placeholder="Password" {...form.register("password")} />
        <Input placeholder="Phone" {...form.register("phone")} />
        <textarea
          className="min-h-24 w-full rounded-lg border border-[#346739]/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
          placeholder="Address"
          {...form.register("address")}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#346739]">
          Login
        </Link>
      </p>
    </section>
  );
}

