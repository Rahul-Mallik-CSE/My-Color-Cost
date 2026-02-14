/** @format */

"use client";

import { use } from "react";
import ProductForm from "@/components/(Dashboard)/Products/ProductForm";
import { useGetProductQuery } from "@/redux/services/productsAPI";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useGetProductQuery(id);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error || !product) return <div className="p-8">Product not found</div>;

  return (
    <div className="p-4 md:p-8">
      <ProductForm initialData={product} isEditing={true} />
    </div>
  );
}
