import { ProductForm } from "@/components/dashboard/product-form";
import { ProductsTable } from "@/components/dashboard/products-table";

export default function DashboardProductsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1f4122]">Manajemen Produk</h1>
        <p className="text-sm text-slate-600">Tambah produk baru atau perbarui data produk yang sudah ada.</p>
      </div>
      <ProductForm mode="create" />
      <ProductsTable />
    </section>
  );
}

