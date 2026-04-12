import { ProductForm } from "@/components/dashboard/product-form";
import { ProductsTable } from "@/components/dashboard/products-table";

export default function DashboardProductsPage() {
  return (
    <section className="space-y-6">
      <ProductForm mode="create" />
      <ProductsTable />
    </section>
  );
}

