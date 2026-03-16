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
  useGetStripeStatusQuery,
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useGetBulkDiscountQuery,
  useApplyBulkDiscountMutation,
  useApplyProductDiscountMutation,
  useApplySelectedProductsPromoMutation,
  useRemoveSelectedProductsPromoMutation,
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
  const [isSelectedPromoModalOpen, setIsSelectedPromoModalOpen] =
    useState(false);
  const [selectedPromoBuyQuantity, setSelectedPromoBuyQuantity] = useState("");
  const [selectedPromoFreeQuantity, setSelectedPromoFreeQuantity] =
    useState("");

  // Fetch products from API
  const { data, isLoading, isFetching, error } = useGetAllProductsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const { data: stripeStatus } = useGetStripeStatusQuery();

  // Fetch bulk discount history
  const { data: discountData } = useGetBulkDiscountQuery();

  // Delete mutation
  const [deleteProduct] = useDeleteProductMutation();

  // Apply bulk discount mutation
  const [applyBulkDiscount, { isLoading: isApplying }] =
    useApplyBulkDiscountMutation();
  const [applyProductDiscount, { isLoading: isApplyingProductDiscount }] =
    useApplyProductDiscountMutation();
  const [applySelectedProductsPromo, { isLoading: isApplyingSelectedPromo }] =
    useApplySelectedProductsPromoMutation();
  const [removeSelectedProductsPromo, { isLoading: isRemovingSelectedPromo }] =
    useRemoveSelectedProductsPromoMutation();

  // Get latest discount from history (index 0)
  const latestDiscount = discountData?.history?.[0];
  const hasProducts = (data?.products?.length || 0) > 0;

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
  const selectedProductCount = selectedProductIds.length;
  const isStripeConnected = stripeStatus?.stripe_connected !== false;
  const isStripeDisconnected = !isStripeConnected;

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

  const handleOpenSelectedPromoModal = () => {
    if (isStripeDisconnected) {
      toast.error("Connect Stripe to manage product promos");
      return;
    }

    if (selectedProductCount === 0) {
      toast.error("Please select at least one product");
      return;
    }
    setSelectedPromoBuyQuantity("");
    setSelectedPromoFreeQuantity("");
    setIsSelectedPromoModalOpen(true);
  };

  const handleApplySelectedPromo = async () => {
    if (!selectedPromoBuyQuantity || !selectedPromoFreeQuantity) {
      toast.error("Please enter both buy and free quantities");
      return;
    }

    const buyQty = parseInt(selectedPromoBuyQuantity, 10);
    const freeQty = parseInt(selectedPromoFreeQuantity, 10);

    if (buyQty <= 0 || freeQty <= 0) {
      toast.error("Quantities must be greater than 0");
      return;
    }

    if (freeQty >= buyQty) {
      toast.error(
        "Free quantity must be less than buy quantity. Example: buy 5 get 1 free.",
      );
      return;
    }

    const productIds = selectedProductIds
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (productIds.length === 0) {
      toast.error("Selected products are invalid");
      return;
    }

    try {
      await applySelectedProductsPromo({
        promo_buy_quantity: buyQty,
        promo_free_quantity: freeQty,
        product_ids: productIds,
      }).unwrap();
      toast.success("Promo applied to selected products");
      setIsSelectedPromoModalOpen(false);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to apply promo for selected products. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleRemoveSelectedPromo = async () => {
    const productIds = selectedProductIds
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (productIds.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    try {
      await removeSelectedProductsPromo({ product_ids: productIds }).unwrap();
      toast.success("Promo removed from selected products");
      setIsSelectedPromoModalOpen(false);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to remove promo for selected products. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleApplyDiscount = async () => {
    if (isStripeDisconnected) {
      toast.error("Connect Stripe to apply discounts");
      return;
    }

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
            disabled={isStripeDisconnected}
            onClick={() => setIsPromoModalOpen(true)}
          >
            Global Promo Setup
          </Button>
          <Button
            className="h-13 rounded-xl"
            disabled={isStripeDisconnected}
            onClick={() => setIsModalOpen(true)}
          >
            Global Deal Setup
          </Button>
          {isStripeDisconnected ? (
            <Button
              className="h-13 rounded-xl"
              onClick={() => router.push("/settings")}
            >
              Connect with Stripe
            </Button>
          ) : (
            <Link
              href="/products/add"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </Link>
          )}
        </div>

        {isStripeDisconnected && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              Stripe connection required to activate retail operations.
            </p>
          </div>
        )}

        {/* API Key Warning */}
        {data?.apiKey && (!data?.products || data?.products.length === 0) && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-600">
              Api key is not correct. Please add product manually
            </p>
          </div>
        )}

        {/* Discount Headline */}
        {hasProducts && (
          <div className="rounded-2xl border border-pink-300 bg-white px-5 py-4 shadow-sm sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Discount
                </p>
                <p className="text-lg font-semibold text-foreground sm:text-xl">
                  {getDiscountDisplay()}
                </p>
              </div>
              <Badge
                variant={latestDiscount ? "default" : "outline"}
                className="w-fit"
              >
                {latestDiscount ? "Active" : "No Active Discount"}
              </Badge>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-red-500">
            Failed to load products. Please try again.
          </div>
        )}

        {/* Product Table */}
        {isLoading || isFetching ? (
          <div className="rounded-2xl border bg-white shadow-sm">
            <TableSkeleton rowCount={ITEMS_PER_PAGE} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-xl md:text-3xl font-semibold text-foreground">
                  Products Table
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedProductCount} selected
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <Input
                  placeholder="Search products in table..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-10 w-full sm:w-72"
                />
                <Button
                  onClick={handleOpenSelectedPromoModal}
                  disabled={selectedProductCount === 0 || isStripeDisconnected}
                  className="h-10 rounded-lg whitespace-nowrap"
                >
                  Selected Promo Setup ({selectedProductCount})
                </Button>
              </div>
            </div>

            <Table className="min-w-245">
              <TableHeader>
                <TableRow className="border-b-2 border-pink-500 bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-14">
                    <Checkbox
                      disabled={isStripeDisconnected}
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
                        disabled={isStripeDisconnected}
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
                          disabled={isStripeDisconnected}
                          onClick={() => handleEditClick(product)}
                          className="h-9 rounded-lg"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isStripeDisconnected}
                          onClick={() => setPromoProduct(product)}
                          className="h-9 w-9 rounded-lg text-emerald-600"
                          title="Apply Promo"
                        >
                          <Gift className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isStripeDisconnected}
                          onClick={() => handleOpenProductDiscount(product)}
                          className="h-9 w-9 rounded-lg text-primary"
                          title="Apply Discount"
                        >
                          <Tag className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isStripeDisconnected}
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
        isOpen={isStripeDisconnected ? false : isPromoModalOpen}
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
              disabled={isApplying || isStripeDisconnected}
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
              disabled={isApplyingProductDiscount || isStripeDisconnected}
              className="mt-2 h-11 rounded-lg"
            >
              {isApplyingProductDiscount ? "Applying..." : "Apply Discount"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSelectedPromoModalOpen}
        onOpenChange={setIsSelectedPromoModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Selected Promo Setup ({selectedProductCount} products)
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Buy Quantity</label>
              <Input
                type="number"
                placeholder="e.g., 3"
                value={selectedPromoBuyQuantity}
                onChange={(e) => setSelectedPromoBuyQuantity(e.target.value)}
                className="h-11 rounded-lg"
                min="1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Free Quantity</label>
              <Input
                type="number"
                placeholder="e.g., 1"
                value={selectedPromoFreeQuantity}
                onChange={(e) => setSelectedPromoFreeQuantity(e.target.value)}
                className="h-11 rounded-lg"
                min="1"
              />
            </div>

            <div className="mt-2 flex gap-3">
              <Button
                onClick={handleApplySelectedPromo}
                disabled={
                  isApplyingSelectedPromo ||
                  isRemovingSelectedPromo ||
                  isStripeDisconnected
                }
                className="h-11 flex-1 rounded-lg"
              >
                {isApplyingSelectedPromo ? "Applying..." : "Apply Promo"}
              </Button>
              <Button
                variant="outline"
                onClick={handleRemoveSelectedPromo}
                disabled={
                  isApplyingSelectedPromo ||
                  isRemovingSelectedPromo ||
                  isStripeDisconnected
                }
                className="h-11 flex-1 rounded-lg"
              >
                {isRemovingSelectedPromo ? "Removing..." : "Remove Promo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
