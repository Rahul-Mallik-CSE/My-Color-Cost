/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsAndConditionsClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Terms and Conditions
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          {/* Introduction */}
          <section>
            <p className="text-base leading-relaxed md:text-lg">
              At My Colour Cost, support is at the heart of everything we do.
              We&apos;re here to champion both sides of the industry—making
              shopping simple and accessible for hairstylists, while helping
              retailers secure consistent, repeat orders. When stylists and
              retailers thrive together, the whole industry moves forward.
            </p>
          </section>

          <section>
            <p className="text-base leading-relaxed md:text-lg">
              A key focus for us is helping you reduce cart abandonment and
              increase completed purchases. To support this, we&apos;ve put
              smart prompts and practical guidance in place—designed to keep
              shoppers confident, informed, and ready to check out.
            </p>
          </section>

          {/* Best Practice Tips */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Best-practice tips to boost conversions
            </h2>

            {/* Delivery Fees */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Delivery fees
              </h3>
              <p className="text-base leading-relaxed">
                We recommend setting your delivery fee at £3 or less. Our
                research shows shoppers are generally comfortable paying up to
                £4.99, but fees above this can significantly increase the chance
                of customers leaving their cart before completing their order.
              </p>
            </div>

            {/* Free Delivery Threshold */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Free delivery threshold
              </h3>
              <p className="text-base leading-relaxed">
                We strongly suggest setting your free delivery minimum spend
                between £50–£100. To help you convert more baskets into
                purchases, My Colour Cost will automatically prompt shoppers
                when they&apos;re close to reaching your free delivery
                threshold—encouraging them to add a little more and complete
                their order.
              </p>
            </div>
          </section>

          {/* Delivery Fee Cap */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Delivery Fee Cap (Mixed-Retailer Orders)
            </h2>

            {/* Why We Do This */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                Why we do this
              </h3>
              <p className="text-base leading-relaxed">
                To reduce cart abandonment and increase conversion on
                mixed-retailer baskets, we cap the total delivery fee paid by
                the customer.
              </p>
            </div>

            {/* When It Applies */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                When it applies
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                The delivery fee cap applies when:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li className="text-base leading-relaxed">
                  A customer checks out with items from multiple retailers, and
                </li>
                <li className="text-base leading-relaxed">
                  The customer doesn&apos;t meet one or more retailers&apos;
                  minimum spend thresholds, meaning multiple delivery fees would
                  usually be charged.
                </li>
              </ul>
            </div>

            {/* What the Customer Pays */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                What the customer pays
              </h3>
              <p className="text-base leading-relaxed">
                The customer will pay a maximum total delivery fee of £4.99 for
                that order.
              </p>
            </div>

            {/* How the Delivery Fee is Shared */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                How the delivery fee is shared
              </h3>
              <p className="text-base leading-relaxed">
                The £4.99 is split equally among all retailers included in the
                order.
              </p>
            </div>
          </section>

          {/* Last Updated */}
          <section className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: February 21, 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
