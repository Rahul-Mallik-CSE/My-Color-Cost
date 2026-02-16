/** @format */

"use client";

import { useState, useMemo } from "react";
import PaymentDetailsTable from "@/components/(Dashboard)/Payments/PaymentDetailsTable";
import DashboardHeader from "@/components/Shared/DashboardHeader";
import { useGetPaymentsQuery } from "@/redux/services/paymentListAPI";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: paymentsResponse, isLoading } = useGetPaymentsQuery();

  // Filter payments based on search query
  const filteredPayments = useMemo(() => {
    if (!paymentsResponse?.data.payments) return [];

    if (!searchQuery.trim()) return paymentsResponse.data.payments;

    const query = searchQuery.toLowerCase();
    return paymentsResponse.data.payments.filter(
      (payment) =>
        payment.customer_name.toLowerCase().includes(query) ||
        payment.customer_email.toLowerCase().includes(query) ||
        payment.transfer_status.toLowerCase().includes(query) ||
        payment.total_transfer_amount.includes(query) ||
        (payment.transfer_id &&
          payment.transfer_id.toLowerCase().includes(query)),
    );
  }, [paymentsResponse, searchQuery]);

  return (
    <>
      <DashboardHeader title="Payment List" onSearch={setSearchQuery} />
      <div className="p-4 md:p-8 flex flex-col gap-4 sm:gap-5">
        <h2 className="text-lg sm:text-xl md:text-4xl font-bold text-foreground">
          Payment List
        </h2>
        <PaymentDetailsTable
          itemsPerPage={12}
          title=""
          payments={filteredPayments}
          totalCount={filteredPayments.length}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
