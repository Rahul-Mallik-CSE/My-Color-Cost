/** @format */

"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import ProductCard from "@/components/(Dashboard)/Products/ProductCard";
import { Pagination } from "@/components/Shared/Pagination";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";
import { ProductGridSkeleton } from "@/components/Skeleton/ProductGridSkeleton";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useGetBulkDiscountQuery,
  useApplyBulkDiscountMutation,
} from "@/redux/services/productsAPI";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountType, setDiscountType] = useState<"amount" | "percentage">(
    "amount",
  );
  const [discountValue, setDiscountValue] = useState("");

  // Fetch products from API
  const { data, isLoading, isFetching, error } = useGetAllProductsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Fetch bulk discount history
  const { data: discountData } = useGetBulkDiscountQuery();

  // Delete mutation
  const [deleteProduct] = useDeleteProductMutation();

  // Apply bulk discount mutation
  const [applyBulkDiscount, { isLoading: isApplying }] =
    useApplyBulkDiscountMutation();

  // Get latest discount from history (index 0)
  const latestDiscount = discountData?.history?.[0];

  // Set initial values from latest discount when modal opens
  useEffect(() => {
    if (isModalOpen && latestDiscount) {
      setDiscountType(latestDiscount.discount_type);
      setDiscountValue(parseFloat(latestDiscount.discount_value).toString());
    } else if (isModalOpen) {
      setDiscountType("amount");
      setDiscountValue("");
    }
  }, [isModalOpen, latestDiscount]);

  // Format discount display
  const getDiscountDisplay = () => {
    if (!latestDiscount) return "No discount applied";
    const value = parseFloat(latestDiscount.discount_value);
    if (latestDiscount.discount_type === "percentage") {
      return `${value}% discount applied on all products`;
    }
    return `$${value} discount applied on all products`;
  };

  // Filter products based on search query
  const filteredProducts =
    data?.products.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap();
        toast.success("Product deleted successfully");
        setProductToDelete(null);
      } catch (error) {
        toast.error("Failed to delete product. Please try again.");
        console.error("Delete error:", error);
      }
    }
  };

  const handleEditClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  const handleApplyDiscount = async () => {
    if (!discountValue || parseFloat(discountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }

    if (discountType === "percentage" && parseFloat(discountValue) > 99) {
      toast.error("Percentage discount must be less than 100%");
      return;
    }

    try {
      await applyBulkDiscount({
        discount_type: discountType,
        discount_value: parseFloat(discountValue),
      }).unwrap();
      toast.success("Discount applied successfully");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to apply discount. Please try again.");
      console.error("Apply discount error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Product List" onSearch={handleSearch} />

      <div className="p-4 md:p-8 flex flex-col gap-4 sm:gap-6">
        {/* Header Actions */}
        <div className="flex  justify-end gap-4">
          <Button
            className="h-13 rounded-xl"
            onClick={() => setIsModalOpen(true)}
          >
            Global Deal Setup
          </Button>
          <Link
            href="/products/add"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </Link>
        </div>

        {/* API Key Warning */}
        {data?.apiKey && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-600">
              Api key is not correct. Please add product manually
            </p>
          </div>
        )}

        {/* Discount Headline */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Current Discount
          </p>
          <p className="text-lg font-semibold">{getDiscountDisplay()}</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-red-500">
            Failed to load products. Please try again.
          </div>
        )}

        {/* Product Grid */}
        {isLoading || isFetching ? (
          <ProductGridSkeleton count={ITEMS_PER_PAGE} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-20 text-gray-500 flex flex-col items-center gap-4">
            <Image
              src="/images/empty-state.webp"
              alt="Empty State"
              width={200}
              height={200}
            />
            No products found.
          </div>
        )}

        {/* Pagination */}
        {!isLoading &&
          !isFetching &&
          (data?.totalCount || 0) > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={data?.totalCount || 0}
              itemsPerPage={ITEMS_PER_PAGE}
              currentItemsCount={filteredProducts.length}
              className="mt-4 bg-white rounded-xl shadow-sm border-none"
            />
          )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />

      {/* Global Deal Setup Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Global Deal Setup</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discount Type</label>
              <Select
                value={discountType}
                onValueChange={(value: "amount" | "percentage") =>
                  setDiscountType(value)
                }
              >
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount ($)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discount Value</label>
              <Input
                type="number"
                placeholder={
                  discountType === "percentage"
                    ? "Enter percentage value (max 99)"
                    : "Enter amount value"
                }
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="h-11 rounded-lg"
                min="0"
                max={discountType === "percentage" ? "99" : undefined}
              />
            </div>

            <Button
              onClick={handleApplyDiscount}
              disabled={isApplying}
              className="h-11 rounded-lg mt-2"
            >
              {isApplying ? "Applying..." : "Apply Discount"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
