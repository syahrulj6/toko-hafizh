"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/validators/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductFormProps = {
  mode: "create" | "edit";
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number;
    stock: number;
    isActive: boolean;
  };
};

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      image: product?.image ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      isActive: product?.isActive ?? true,
    },
  });

  const endpoint = mode === "create" ? "/api/products" : `/api/products/${product?.id}`;
  const method = mode === "create" ? "POST" : "PUT";

  const mutation = useMutation({
    mutationFn: async (values: ProductInput) => {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Failed to save product");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      router.refresh();

      if (mode === "create") {
        form.reset({
          name: "",
          slug: "",
          description: "",
          image: "",
          price: 0,
          stock: 0,
          isActive: true,
        });
      }
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError("");
    await mutation.mutateAsync(values);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-[#346739]/20 bg-white p-4">
      <h2 className="text-lg font-semibold text-[#1f4122]">
        {mode === "create" ? "Create Product" : "Edit Product"}
      </h2>

      <Input placeholder="Name" {...form.register("name")} />
      <Input placeholder="Slug" {...form.register("slug")} />
      <Input placeholder="Image URL" {...form.register("image")} />
      <Input
        type="number"
        placeholder="Price"
        {...form.register("price", { valueAsNumber: true })}
      />
      <Input
        type="number"
        placeholder="Stock"
        {...form.register("stock", { valueAsNumber: true })}
      />
      <textarea
        className="min-h-28 w-full rounded-lg border border-[#346739]/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#346739]/45"
        placeholder="Description"
        {...form.register("description")}
      />
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...form.register("isActive")} />
        Active product
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={mutation.isPending || form.formState.isSubmitting}>
        {mutation.isPending || form.formState.isSubmitting ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}

