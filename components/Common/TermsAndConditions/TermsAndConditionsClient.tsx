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
            Retailer Terms and Conditions and Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last updated: 3 March 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700 dark:text-gray-300">
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-base leading-relaxed md:text-lg">
              At My Colour Cost, support is at the heart of everything we do. We
              are here to champion both sides of the industry by making shopping
              simple and accessible for hairstylists, while helping retailers
              secure consistent, repeat orders. When stylists and retailers
              thrive together, the whole industry moves forward.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              A key focus for us is reducing cart abandonment and increasing
              completed purchases. To support this, we use smart prompts and
              practical guidance designed to keep shoppers confident, informed,
              and ready to check out.
            </p>
            <p className="text-base leading-relaxed md:text-lg">
              By registering for, accessing, or using the My Colour Cost
              platform as a retailer, you agree to the following Terms and
              Conditions and acknowledge the Privacy Policy below.
            </p>
          </section>

          {/* PART 1 */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              TERMS AND CONDITIONS
            </h2>

            {/* Section 1 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                1. Platform Overview and Eligibility
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                My Colour Cost is a B2B/B2C marketplace platform designed
                exclusively for the professional hair and beauty industry.
              </p>
              <p className="mb-3 text-base leading-relaxed">
                By accessing or using the platform, you confirm that:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li className="text-base leading-relaxed">
                  you are at least 18 years of age;
                </li>
                <li className="text-base leading-relaxed">
                  you are a registered business, professional hairstylist, or
                  verified retailer operating within the hair and beauty
                  industry;
                </li>
                <li className="text-base leading-relaxed">
                  all information provided during registration is accurate,
                  complete, and up to date; and
                </li>
                <li className="text-base leading-relaxed">
                  you will comply with all applicable laws and regulations in
                  the United Kingdom.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                2. Account Registration and Security
              </h3>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">2.1</span> Each user may hold
                  only one active account per role, including retailer, owner,
                  staff, or self-employed user.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">2.2</span> You are solely
                  responsible for maintaining the confidentiality of your login
                  credentials and for all activity carried out under your
                  account.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">2.3</span> You must notify us
                  immediately at{" "}
                  <a
                    href="mailto:ops@mycolourcost.com"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    ops@mycolourcost.com
                  </a>{" "}
                  if you suspect or become aware of any unauthorised access to
                  your account.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">2.4</span> My Colour Cost
                  reserves the right to suspend or terminate any account that is
                  found to be in breach of these Terms.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">2.5</span> Retailers must
                  complete OTP email verification before their account becomes
                  active.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">2.6</span> Retailer accounts
                  require admin approval before access to the full platform is
                  granted.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                3. Retailer Responsibilities
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                By registering as a retailer on My Colour Cost, you agree to:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  provide accurate product descriptions, pricing, and stock
                  availability at all times;
                </li>
                <li className="text-base leading-relaxed">
                  update stock levels promptly to avoid overselling;
                </li>
                <li className="text-base leading-relaxed">
                  fulfil all confirmed orders in a timely and professional
                  manner;
                </li>
                <li className="text-base leading-relaxed">
                  maintain a minimum order fulfilment rate of 95%;
                </li>
                <li className="text-base leading-relaxed">
                  respond to customer queries within 24 business hours;
                </li>
                <li className="text-base leading-relaxed">
                  comply with all relevant UK trading standards, consumer
                  protection laws, and any other applicable legal requirements;
                  and
                </li>
                <li className="text-base leading-relaxed">
                  not list counterfeit, prohibited, misleading, or otherwise
                  unlawful products.
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                Failure to comply with these requirements may result in account
                suspension, removal of listings, or permanent termination
                without notice.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                4. Product Listings and Pricing
              </h3>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">4.1</span> All prices must be
                  displayed in British Pounds (£) and must include any
                  applicable VAT.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">4.2</span> Retailers are
                  responsible for ensuring VAT is correctly applied to their
                  products.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">4.3</span> Product images must
                  accurately represent the item being sold. Misleading imagery
                  is not permitted.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">4.4</span> My Colour Cost
                  reserves the right to remove or suspend any listing that
                  breaches platform rules, applicable laws, or these Terms.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">4.5</span> My Colour Cost does
                  not guarantee the accuracy of third-party product information
                  supplied by retailers or other external sources.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                5. Orders and Payments
              </h3>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">5.1</span> All payments are
                  processed securely through Stripe.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">5.2</span> My Colour Cost acts
                  as a payment facilitator. Funds are collected on behalf of
                  retailers and disbursed via Stripe Connect.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">5.3</span> Payments are subject
                  to Stripe&apos;s own terms and conditions.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">5.4</span> My Colour Cost
                  deducts its platform fee from each transaction before
                  transferring funds to the retailer.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">5.5</span> Retailers will
                  receive a breakdown of applicable fees in their payment
                  dashboard.
                </p>
                <p className="mt-4 mb-2 font-semibold text-gray-900 dark:text-white">
                  Stripe Connect Requirement
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">5.6</span> Retailers must
                  complete Stripe Connect onboarding in order to receive
                  payouts.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">5.7</span> Failure to complete
                  Stripe Connect onboarding within 30 days of account approval
                  may result in account restrictions, including limitations on
                  selling or receiving payouts.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                6. Best-Practice Delivery Settings to Boost Conversion
              </h3>
              <p className="mb-4 text-base leading-relaxed">
                To help reduce cart abandonment and improve completed purchases,
                My Colour Cost recommends the following best-practice delivery
                settings.
              </p>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                Delivery Fees
              </p>
              <div className="mb-4 space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">6.1</span> Retailers are
                  strongly encouraged to set their delivery fee at £3 or less.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">6.2</span> Our research
                  indicates that shoppers are generally comfortable paying up to
                  £4.99, but fees above this amount can significantly increase
                  the likelihood of cart abandonment.
                </p>
              </div>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                Free Delivery Threshold
              </p>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">6.3</span> Retailers are
                  strongly encouraged to set their free delivery minimum spend
                  between £50 and £100.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">6.4</span> To support
                  conversions, My Colour Cost may automatically prompt shoppers
                  when they are close to reaching a retailer&apos;s free
                  delivery threshold, encouraging them to increase basket value
                  and complete their purchase.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                7. Delivery Fee Cap for Mixed-Retailer Orders
              </h3>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                Why We Do This
              </p>
              <p className="mb-4 text-base leading-relaxed">
                <span className="font-medium">7.1</span> To reduce cart
                abandonment and improve conversion on mixed-retailer baskets, My
                Colour Cost caps the total delivery fee payable by the customer
                in certain circumstances.
              </p>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                When It Applies
              </p>
              <p className="mb-2 text-base leading-relaxed">
                <span className="font-medium">7.2</span> The delivery fee cap
                applies where:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  a customer checks out with items from multiple retailers; and
                </li>
                <li className="text-base leading-relaxed">
                  the customer does not meet one or more retailers&apos; minimum
                  spend thresholds, meaning multiple delivery fees would
                  otherwise apply.
                </li>
              </ul>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                What the Customer Pays
              </p>
              <p className="mb-4 text-base leading-relaxed">
                <span className="font-medium">7.3</span> In these cases, the
                customer will pay a maximum total delivery fee of £4.99 for that
                order.
              </p>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                How the Delivery Fee Is Shared
              </p>
              <p className="text-base leading-relaxed">
                <span className="font-medium">7.4</span> The £4.99 delivery fee
                will be split equally among all retailers included in the order,
                unless otherwise stated by My Colour Cost in writing.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                8. Delivery and Fulfilment
              </h3>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">8.1</span> Delivery timescales
                  are set and managed by individual retailers.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">8.2</span> My Colour Cost is not
                  responsible for delays caused by third-party couriers or
                  events outside its reasonable control.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">8.3</span> Retailers are
                  responsible for ensuring products are packaged appropriately
                  to prevent damage in transit.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">8.4</span> Any delivery dates or
                  estimates shown on the platform are indicative only and are
                  not guaranteed.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">8.5</span> For mixed-retailer
                  orders, the Delivery Fee Cap terms in Section 7 will apply
                  where relevant.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                9. Cancellations and Refunds
              </h3>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                Customer Cancellations
              </p>
              <div className="mb-4 space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">9.1</span> Orders may be
                  cancelled within 1 hour of placement, provided the retailer
                  has not yet begun processing the order.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">9.2</span> After this period,
                  cancellation requests are at the retailer&apos;s discretion,
                  unless the customer has rights under applicable law.
                </p>
              </div>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                Retailer Cancellations
              </p>
              <div className="mb-4 space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">9.3</span> If a retailer cancels
                  an order, the customer will receive a full refund within 5 to
                  10 business days.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">9.4</span> Repeated retailer
                  cancellations may result in account review, restriction, or
                  suspension.
                </p>
              </div>
              <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                Refunds
              </p>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">9.5</span> Refund requests for
                  damaged, incorrect, or missing items must be reported within
                  48 hours of delivery.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">9.6</span> Supporting evidence,
                  including photographs and delivery confirmation, may be
                  required.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">9.7</span> Approved refunds will
                  be processed within 5 to 10 business days.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">9.8</span> My Colour Cost
                  reserves the right to review and mediate disputes between
                  customers and retailers.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                10. Platform Fees and Commission
              </h3>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">10.1</span> My Colour Cost
                  charges a platform commission on each completed transaction.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">10.2</span> The current
                  commission rate is set out in the Retailer Dashboard under
                  Billing &amp; Fees.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">10.3</span> Fees may be amended
                  by My Colour Cost on 30 days&apos; written notice to
                  registered retailers.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">10.4</span> Fees are
                  non-refundable once a transaction has been completed, except
                  where required by law.
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                11. Intellectual Property
              </h3>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">11.1</span> All content on the
                  My Colour Cost platform, including logos, branding, design,
                  software, text, graphics, and copy, is the intellectual
                  property of My Colour Cost and is protected under UK copyright
                  and intellectual property laws.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">11.2</span> Retailers retain
                  ownership of their own product images, trademarks, and
                  descriptions, but grant My Colour Cost a non-exclusive,
                  royalty-free licence to host, reproduce, display, and promote
                  such content on the platform and in related marketing
                  materials for the purpose of operating and promoting the
                  marketplace.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">11.3</span> You may not
                  reproduce, distribute, copy, exploit, or otherwise use any
                  platform content without prior written consent from My Colour
                  Cost.
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                12. Suspension and Termination
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                My Colour Cost reserves the right to suspend, restrict, or
                permanently terminate retailer accounts for any of the following
                reasons:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  breach of these Terms and Conditions;
                </li>
                <li className="text-base leading-relaxed">
                  fraudulent activity or misrepresentation;
                </li>
                <li className="text-base leading-relaxed">
                  persistent poor performance, including low fulfilment rates or
                  excessive disputes;
                </li>
                <li className="text-base leading-relaxed">
                  failure to maintain accurate stock or pricing information;
                </li>
                <li className="text-base leading-relaxed">
                  failure to complete required onboarding steps, including
                  Stripe Connect;
                </li>
                <li className="text-base leading-relaxed">
                  non-compliance with applicable laws or regulations; or
                </li>
                <li className="text-base leading-relaxed">
                  conduct that may damage the platform, its users, or its
                  reputation.
                </li>
              </ul>
              <p className="mb-3 text-base leading-relaxed font-medium text-gray-900 dark:text-white">
                Upon termination:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li className="text-base leading-relaxed">
                  access to the platform may be revoked immediately;
                </li>
                <li className="text-base leading-relaxed">
                  any outstanding payouts may be held for 14 days for dispute
                  resolution purposes; and
                </li>
                <li className="text-base leading-relaxed">
                  you remain liable for any obligations incurred prior to
                  termination.
                </li>
              </ul>
            </div>

            {/* Section 13 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                13. Limitation of Liability
              </h3>
              <div className="space-y-3">
                <p className="text-base leading-relaxed">
                  <span className="font-medium">13.1</span> To the fullest
                  extent permitted by law, My Colour Cost shall not be liable
                  for any indirect, incidental, special, or consequential loss,
                  including loss of profits, loss of goodwill, loss of
                  opportunity, or loss of data arising out of or in connection
                  with use of the platform.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">13.2</span> My Colour
                  Cost&apos;s total aggregate liability in connection with any
                  claim arising under or in relation to these Terms shall not
                  exceed the total fees paid by you to My Colour Cost in the 3
                  months preceding the event giving rise to the claim.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">13.3</span> My Colour Cost does
                  not guarantee that the platform will always be available,
                  uninterrupted, secure, or error-free.
                </p>
                <p className="text-base leading-relaxed">
                  <span className="font-medium">13.4</span> Nothing in these
                  Terms excludes or limits liability where such exclusion or
                  limitation would be unlawful.
                </p>
              </div>
            </div>

            {/* Section 14 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                14. Governing Law and Jurisdiction
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                These Terms and Conditions are governed by and construed in
                accordance with the laws of England and Wales.
              </p>
              <p className="text-base leading-relaxed">
                Any dispute arising in connection with these Terms shall be
                subject to the exclusive jurisdiction of the courts of England
                and Wales.
              </p>
            </div>
          </section>

          {/* PART 2 */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              PRIVACY POLICY
            </h2>

            {/* Section 15 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                15. Who We Are
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                My Colour Cost (&quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;) operates the My Colour Cost mobile application
                and web platform. We are committed to protecting personal data
                in accordance with the UK General Data Protection Regulation (UK
                GDPR) and the Data Protection Act 2018.
              </p>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-sm space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  Data Controller:
                </p>
                <p>My Colour Cost</p>
                <p>United Kingdom</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:ops@mycolourcost.com"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    ops@mycolourcost.com
                  </a>
                </p>
              </div>
            </div>

            {/* Section 16 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                16. What Data We Collect
              </h3>
              <p className="mb-4 text-base leading-relaxed">
                We may collect and process the following categories of personal
                data:
              </p>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Account and Identity Data
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li className="text-base leading-relaxed">full name;</li>
                    <li className="text-base leading-relaxed">
                      email address;
                    </li>
                    <li className="text-base leading-relaxed">phone number;</li>
                    <li className="text-base leading-relaxed">
                      account role, including retailer, owner, staff, or
                      self-employed;
                    </li>
                    <li className="text-base leading-relaxed">
                      business name and logo (for retailers).
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Transaction and Financial Data
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li className="text-base leading-relaxed">
                      order history and order details;
                    </li>
                    <li className="text-base leading-relaxed">
                      payment amounts and payment method details;
                    </li>
                    <li className="text-base leading-relaxed">
                      Stripe Connect account information for retailers;
                    </li>
                    <li className="text-base leading-relaxed">
                      delivery charges and fees.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Delivery and Location Data
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li className="text-base leading-relaxed">
                      delivery addresses;
                    </li>
                    <li className="text-base leading-relaxed">postal codes;</li>
                    <li className="text-base leading-relaxed">
                      area or region data.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Technical Data
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li className="text-base leading-relaxed">IP address;</li>
                    <li className="text-base leading-relaxed">
                      device type and operating system;
                    </li>
                    <li className="text-base leading-relaxed">
                      app usage and session data;
                    </li>
                    <li className="text-base leading-relaxed">
                      login timestamps.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Communications Data
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li className="text-base leading-relaxed">
                      customer support enquiries;
                    </li>
                    <li className="text-base leading-relaxed">
                      missing product requests;
                    </li>
                    <li className="text-base leading-relaxed">
                      notification and communication preferences.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 17 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                17. How We Use Your Data
              </h3>
              <p className="mb-4 text-base leading-relaxed">
                We process personal data for the following purposes and legal
                bases:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li className="text-base leading-relaxed">
                  Account registration and authentication — performance of a
                  contract
                </li>
                <li className="text-base leading-relaxed">
                  Processing and fulfilling orders — performance of a contract
                </li>
                <li className="text-base leading-relaxed">
                  Payment processing via Stripe — performance of a contract
                </li>
                <li className="text-base leading-relaxed">
                  Sending order confirmations and updates — performance of a
                  contract
                </li>
                <li className="text-base leading-relaxed">
                  Improving platform features and performance — legitimate
                  interests
                </li>
                <li className="text-base leading-relaxed">
                  Detecting and preventing fraud — legitimate interests and/or
                  legal obligation
                </li>
                <li className="text-base leading-relaxed">
                  Sending marketing communications — consent, where required
                </li>
                <li className="text-base leading-relaxed">
                  Complying with legal and regulatory obligations — legal
                  obligation
                </li>
                <li className="text-base leading-relaxed">
                  Customer support and dispute resolution — legitimate interests
                </li>
              </ul>
            </div>

            {/* Section 18 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                18. Data Sharing and Third Parties
              </h3>
              <p className="mb-3 text-base leading-relaxed font-medium text-gray-900 dark:text-white">
                We do not sell personal data.
              </p>
              <p className="mb-3 text-base leading-relaxed">
                We may share personal data with:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  Stripe, for payment processing and retailer payouts;
                </li>
                <li className="text-base leading-relaxed">
                  cloud hosting providers, for secure data storage and
                  infrastructure;
                </li>
                <li className="text-base leading-relaxed">
                  email and SMS providers, for OTP verification and
                  notifications;
                </li>
                <li className="text-base leading-relaxed">
                  analytics providers, to help us understand platform usage,
                  using anonymised or aggregated data where possible; and
                </li>
                <li className="text-base leading-relaxed">
                  law enforcement bodies, regulators, courts, or government
                  authorities where required by law.
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                All third-party processors are required to process personal data
                in accordance with applicable data protection laws and
                appropriate contractual safeguards.
              </p>
            </div>

            {/* Section 19 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                19. Data Retention
              </h3>
              <p className="mb-4 text-base leading-relaxed">
                We retain personal data only for as long as necessary for the
                purposes set out in this Privacy Policy, including to satisfy
                legal, tax, accounting, and regulatory requirements.
              </p>
              <p className="mb-3 text-base leading-relaxed">
                Typical retention periods are:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  Account data — duration of account plus 2 years
                </li>
                <li className="text-base leading-relaxed">
                  Transaction records — 7 years
                </li>
                <li className="text-base leading-relaxed">
                  Support communications — 2 years from last contact
                </li>
                <li className="text-base leading-relaxed">
                  Technical and log data — 90 days
                </li>
                <li className="text-base leading-relaxed">
                  Marketing preferences — until consent is withdrawn or
                  preferences are updated
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                When an account is deleted, personal data will be deleted or
                anonymised unless retention is required by law.
              </p>
            </div>

            {/* Section 20 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                20. Cookies and Tracking Technologies
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                Our platform uses cookies and similar technologies to:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  maintain user sessions;
                </li>
                <li className="text-base leading-relaxed">
                  remember preferences;
                </li>
                <li className="text-base leading-relaxed">
                  support platform functionality; and
                </li>
                <li className="text-base leading-relaxed">
                  analyse platform usage.
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                You may manage cookie preferences through your device settings
                or in-app preferences where available. Please note that
                disabling essential cookies may affect platform functionality.
              </p>
            </div>

            {/* Section 21 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                21. Your Rights Under UK GDPR
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                Subject to applicable law, you have the right to:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  request access to the personal data we hold about you;
                </li>
                <li className="text-base leading-relaxed">
                  request correction of inaccurate or incomplete data;
                </li>
                <li className="text-base leading-relaxed">
                  request deletion of your personal data;
                </li>
                <li className="text-base leading-relaxed">
                  request restriction of processing;
                </li>
                <li className="text-base leading-relaxed">
                  request transfer of your data in a portable format;
                </li>
                <li className="text-base leading-relaxed">
                  object to processing based on legitimate interests or for
                  direct marketing; and
                </li>
                <li className="text-base leading-relaxed">
                  withdraw consent at any time where processing is based on
                  consent.
                </li>
              </ul>
              <p className="mb-3 text-base leading-relaxed">
                To exercise your rights, please contact:{" "}
                <a
                  href="mailto:ops@mycolourcost.com"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  ops@mycolourcost.com
                </a>
              </p>
              <p className="mb-3 text-base leading-relaxed">
                We will normally respond within 30 days of receiving your
                request.
              </p>
              <p className="text-base leading-relaxed">
                You also have the right to lodge a complaint with the
                Information Commissioner&apos;s Office (ICO) if you believe your
                data protection rights have been infringed.
              </p>
            </div>

            {/* Section 22 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                22. Data Security
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                We implement appropriate technical and organisational measures
                to protect personal data, including:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  encryption of data in transit using TLS/SSL;
                </li>
                <li className="text-base leading-relaxed">
                  encrypted storage of sensitive data where appropriate;
                </li>
                <li className="text-base leading-relaxed">
                  role-based access controls;
                </li>
                <li className="text-base leading-relaxed">
                  regular security assessments and vulnerability testing; and
                </li>
                <li className="text-base leading-relaxed">
                  OTP-based email verification for account access.
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                While we take security seriously, no system is completely
                secure. If we become aware of a personal data breach that is
                likely to result in a risk to your rights and freedoms, we will
                notify affected users and the ICO as required by law.
              </p>
            </div>

            {/* Section 23 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                23. International Data Transfers
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                Where personal data is transferred outside the United Kingdom,
                we will ensure appropriate safeguards are in place, such as:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li className="text-base leading-relaxed">
                  UK adequacy regulations;
                </li>
                <li className="text-base leading-relaxed">
                  International Data Transfer Agreements or Standard Contractual
                  Clauses; or
                </li>
                <li className="text-base leading-relaxed">
                  transfers to jurisdictions recognised as providing an adequate
                  level of data protection.
                </li>
              </ul>
            </div>

            {/* Section 24 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                24. Children&apos;s Privacy
              </h3>
              <p className="text-base leading-relaxed">
                My Colour Cost is not intended for use by individuals under the
                age of 18. We do not knowingly collect personal data from
                children. If you believe that a child has provided personal data
                to us, please contact us immediately so that appropriate action
                can be taken.
              </p>
            </div>

            {/* Section 25 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                25. Changes to This Policy
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                We may update these Terms and this Privacy Policy from time to
                time.
              </p>
              <p className="mb-3 text-base leading-relaxed">
                Where we make material changes, we may:
              </p>
              <ul className="ml-6 list-disc space-y-2 mb-4">
                <li className="text-base leading-relaxed">
                  update the &quot;Last updated&quot; date;
                </li>
                <li className="text-base leading-relaxed">
                  notify registered users by email or in-app notification; and
                </li>
                <li className="text-base leading-relaxed">
                  request renewed consent where required by law.
                </li>
              </ul>
              <p className="text-base leading-relaxed">
                Continued use of the platform after any updates take effect
                constitutes acceptance of the revised Terms and Privacy Policy.
              </p>
            </div>

            {/* Section 26 */}
            <div className="mb-8">
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                26. Contact and Complaints
              </h3>
              <p className="mb-3 text-base leading-relaxed">
                For any questions about these Terms, your account, or this
                Privacy Policy, please contact:
              </p>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-sm space-y-1">
                <p>
                  Email:{" "}
                  <a
                    href="mailto:ops@mycolourcost.com"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    ops@mycolourcost.com
                  </a>
                </p>
                <p className="mt-2 font-medium text-gray-900 dark:text-white">
                  My Colour Cost
                </p>
                <p className="italic text-gray-500 dark:text-gray-400">
                  Empowering the hair and beauty industry, one order at a time.
                </p>
              </div>
            </div>
          </section>

          {/* Last Updated Footer */}
          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: 3 March 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
