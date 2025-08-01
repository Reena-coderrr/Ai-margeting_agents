import React from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 29,
    period: "mo",
    features: [
      "Basic templates",
      "Email support",
      "Up to 1,000 AI generations/mo",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: 79,
    period: "mo",
    features: [
      "All Starter features",
      "Advanced exports",
      "Priority support",
      "Custom templates",
      "Analytics dashboard",
      "Up to 10,000 AI generations/mo",
    ],
    popular: true,
  },
  {
    name: "Agency",
    price: 199,
    period: "mo",
    features: [
      "All Pro features",
      "Custom integrations",
      "Dedicated account manager",
      "Unlimited AI generations",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Pricing</h1>
      <p className="text-lg text-gray-600 mb-12 text-center">
        Choose the plan that fits your needs. Transparent pricing, no hidden fees.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg shadow-lg p-8 flex flex-col items-center bg-white relative transition hover:scale-105 ${plan.popular ? "border-4 border-blue-600 z-10" : "border border-gray-200"}`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow">Most Popular</span>
            )}
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <div className="flex items-end mb-6">
              <span className="text-4xl font-extrabold">${plan.price}</span>
              <span className="text-gray-500 ml-1 mb-1">/{plan.period}</span>
            </div>
            <ul className="mb-8 space-y-3 w-full">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-gray-700">
                  <Check className="text-green-500" /> {feature}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2 rounded font-semibold transition ${plan.popular ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
              {plan.popular ? "Go Pro" : plan.name === "Starter" ? "Get Started" : "Contact Sales"}
            </button>
          </div>
        ))}
      </div>
      <p className="text-center text-gray-500 mt-8">
        All plans include 24/7 support and regular updates. No setup fees or hidden costs.
      </p>
    </div>
  );
} 