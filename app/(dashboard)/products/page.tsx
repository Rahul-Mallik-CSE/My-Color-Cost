/** @format */

"use client";

import { useState } from "react";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { Pagination } from "@/components/Shared/Pagination";
import { DeleteConfirmationModal } from "@/components/Shared/DeleteConfirmationModal";
import GlobalPromoModal from "@/components/(Dashboard)/Products/GlobalPromoModal";
import ProductPromoModal from "@/components/(Dashboard)/Products/ProductPromoModal";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Gift, Pencil, Plus, Star, Tag, Trash2 } from "lucide-react";
import Image from "next/image";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useGetBulkDiscountQuery,
  useApplyBulkDiscountMutation,
  useApplyProductDiscountMutation,
} from "@/redux/services/productsAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promoProduct, setPromoProduct] = useState<Product | null>(null);
  const [discountType, setDiscountType] = useState<"amount" | "percentage">(
    "amount",
  );
  const [discountValue, setDiscountValue] = useState("");
  const [discountProduct, setDiscountProduct] = useState<Product | null>(null);
  const [productDiscountType, setProductDiscountType] = useState<
    "amount" | "percentage"
  >("amount");
  const [productDiscountValue, setProductDiscountValue] = useState("");

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
  const [applyProductDiscount, { isLoading: isApplyingProductDiscount }] =
    useApplyProductDiscountMutation();

  // Get latest discount from history (index 0)
  const latestDiscount = discountData?.history?.[0];

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
  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) =>
      selectedProductIds.includes(product.id),
    );
  const someVisibleSelected =
    !allVisibleSelected &&
    filteredProducts.some((product) => selectedProductIds.includes(product.id));

  const formatMoney = (product: Product, value: number) => {
    return `${product.currency}${value.toFixed(2)}`;
  };

  const getStockBadge = (product: Product) => {
    const stockCount = Number(product.stock) || 0;

    if (stockCount <= 0) {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          Out of stock
        </Badge>
      );
    }

    if (product.stockStatus === "in_stock") {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          In stock ({stockCount})
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-amber-200 text-amber-700">
        {product.stockStatus ?? `Stock: ${stockCount}`}
      </Badge>
    );
  };

  const getPromoBadge = (product: Product) => {
    if (
      product.promoIsActive &&
      product.promoBuyQuantity &&
      product.promoFreeQuantity
    ) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          Buy {product.promoBuyQuantity}, get {product.promoFreeQuantity}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-dashed text-muted-foreground">
        No promo
      </Badge>
    );
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProductIds((currentIds) => {
      if (checked) {
        return currentIds.includes(productId)
          ? currentIds
          : [...currentIds, productId];
      }

      return currentIds.filter((id) => id !== productId);
    });
  };

  const handleSelectAllProducts = (checked: boolean) => {
    if (!checked) {
      setSelectedProductIds((currentIds) =>
        currentIds.filter(
          (id) => !filteredProducts.some((product) => product.id === id),
        ),
      );
      return;
    }

    setSelectedProductIds((currentIds) => {
      const nextIds = new Set(currentIds);
      filteredProducts.forEach((product) => nextIds.add(product.id));
      return Array.from(nextIds);
    });
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap();
        toast.success("Product deleted successfully");
        setSelectedProductIds((currentIds) =>
          currentIds.filter((id) => id !== productToDelete),
        );
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

  const handleOpenProductDiscount = (product: Product) => {
    setDiscountProduct(product);
    setProductDiscountType("amount");
    setProductDiscountValue("");
  };

  const handleApplyProductDiscount = async () => {
    if (!discountProduct) {
      return;
    }

    if (!productDiscountValue || parseFloat(productDiscountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }

    if (
      productDiscountType === "percentage" &&
      parseFloat(productDiscountValue) > 99
    ) {
      toast.error("Percentage discount must be less than 100%");
      return;
    }

    try {
      await applyProductDiscount({
        id: discountProduct.id,
        discount_type: productDiscountType,
        discount_value: parseFloat(productDiscountValue),
      }).unwrap();
      toast.success("Discount applied successfully");
      setDiscountProduct(null);
      setProductDiscountValue("");
    } catch (error) {
      toast.error("Failed to apply discount. Please try again.");
      console.error("Apply product discount error:", error);
    }
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
            onClick={() => setIsPromoModalOpen(true)}
          >
            Global Promo Setup
          </Button>
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
        {data?.apiKey && (!data?.products || data?.products.length === 0) && (
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
          <div className="rounded-2xl border bg-white shadow-sm">
            <TableSkeleton rowCount={ITEMS_PER_PAGE} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-4  px-4 py-3 sm:px-6">
              <div>
                <p className="text-xl md:text-3xl font-semibold text-foreground">
                  Products Table
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedProductIds.length} selected on this page set
                </p>
              </div>
            </div>

            <Table className="min-w-245">
              <TableHeader>
                <TableRow className="border-b-2 border-pink-500 bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-14">
                    <Checkbox
                      checked={
                        allVisibleSelected
                          ? true
                          : someVisibleSelected
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={(checked) =>
                        handleSelectAllProducts(checked === true)
                      }
                      aria-label="Select all visible products"
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Promo</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/20">
                    <TableCell>
                      <Checkbox
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={(checked) =>
                          handleSelectProduct(product.id, checked === true)
                        }
                        aria-label={`Select ${product.title}`}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border bg-muted">
                          <Image
                            src={product.image || "/images/empty-state.webp"}
                            alt={product.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p
                            className="max-w-70 truncate font-semibold text-foreground"
                            title={product.title}
                          >
                            {product.title}
                          </p>
                          <p
                            className="max-w-80 truncate text-sm text-muted-foreground"
                            title={product.description}
                          >
                            {product.description || "No description available"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">
                          {formatMoney(
                            product,
                            product.discountedPrice ?? product.price,
                          )}
                        </p>
                        {product.discountedPrice !== undefined &&
                          product.discountedPrice !== product.price && (
                            <p className="text-sm text-muted-foreground line-through">
                              {formatMoney(product, product.price)}
                            </p>
                          )}
                        <p className="text-xs text-muted-foreground">
                          VAT:{" "}
                          {product.vat !== undefined
                            ? formatMoney(product, product.vat)
                            : "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>{getStockBadge(product)}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="font-medium text-foreground">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewsCount})
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>{getPromoBadge(product)}</TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(product)}
                          className="h-9 rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPromoProduct(product)}
                          className="h-9 w-9 rounded-lg text-emerald-600"
                          title="Apply Promo"
                        >
                          <Gift className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenProductDiscount(product)}
                          className="h-9 w-9 rounded-lg text-primary"
                          title="Apply Discount"
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(product.id)}
                          className="h-9 w-9 rounded-lg text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      {/* Global Promo Modal */}
      <GlobalPromoModal
        isOpen={isPromoModalOpen}
        onOpenChange={setIsPromoModalOpen}
      />

      <ProductPromoModal
        isOpen={!!promoProduct}
        onOpenChange={(open) => {
          if (!open) {
            setPromoProduct(null);
          }
        }}
        productId={promoProduct?.id ?? ""}
        productName={promoProduct?.title ?? ""}
        currentPromoBuyQuantity={promoProduct?.promoBuyQuantity}
        currentPromoFreeQuantity={promoProduct?.promoFreeQuantity}
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

      <Dialog
        open={!!discountProduct}
        onOpenChange={(open) => {
          if (!open) {
            setDiscountProduct(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apply Discount{" "}
              {discountProduct ? `- ${discountProduct.title}` : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discount Type</label>
              <Select
                value={productDiscountType}
                onValueChange={(value: "amount" | "percentage") =>
                  setProductDiscountType(value)
                }
              >
                <SelectTrigger className="h-11 rounded-lg">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount (£)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Discount Value</label>
              <Input
                type="number"
                placeholder={
                  productDiscountType === "percentage"
                    ? "Enter percentage value (max 99)"
                    : "Enter amount value"
                }
                value={productDiscountValue}
                onChange={(e) => setProductDiscountValue(e.target.value)}
                className="h-11 rounded-lg"
                min="0"
                max={productDiscountType === "percentage" ? "99" : undefined}
              />
            </div>

            <Button
              onClick={handleApplyProductDiscount}
              disabled={isApplyingProductDiscount}
              className="mt-2 h-11 rounded-lg"
            >
              {isApplyingProductDiscount ? "Applying..." : "Apply Discount"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
