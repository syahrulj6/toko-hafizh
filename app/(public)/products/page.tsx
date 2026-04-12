import { ProductsCatalog } from "@/components/product/products-catalog";

export default function ProductsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-[#1f4122]">Products</h1>
      <ProductsCatalog />
    </section>
  );
}

