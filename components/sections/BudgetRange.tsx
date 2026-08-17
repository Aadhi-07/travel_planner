"use client";

import React, { useState } from "react";
import SectionWrapper from "./SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, MapPin, Users, Calendar, Bus, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";
import { calculateRealisticBudget, parseTravelersCount } from "@/lib/budgetCalculator";
import { convertCurrencyString, SUPPORTED_CURRENCIES, CurrencyCode } from "@/lib/currency";
import { differenceInDays } from "date-fns";

type BudgetRangeProps = {
  data?: {
    totalEstimatedCost: string;
    perPersonCost?: string;
    essentials: string;
    transport: string;
    accommodation: string;
    food: string;
    insurance: string;
    contingency: string;
  };
  plan?: any;
  isLoading: boolean;
};

const BudgetRange = ({ data, plan, isLoading }: BudgetRangeProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("INR");

  if (!data && !isLoading && !plan) return null;

  // Extract trip metadata
  const origin = plan?.originPlace?.trim() || "Origin not specified";
  const destination = plan?.nameoftheplace || "Destination";
  const fromDate = plan?.fromDate;
  const toDate = plan?.toDate;
  
  let days = 2;
  if (fromDate && toDate) {
    days = Math.max(1, differenceInDays(new Date(toDate), new Date(fromDate)) + 1);
  } else if (plan?.itinerary && plan.itinerary.length > 0) {
    days = plan.itinerary.length;
  }
  const nights = Math.max(1, days - 1);
  const companion = plan?.companion || "2 Travelers";
  const travelers = parseTravelersCount(companion);
  const budgetTier = plan?.budgetTier || "Moderate";

  // Calculate or fallback realistic budget values
  const computed = calculateRealisticBudget({
    originPlace: origin !== "Origin not specified" ? origin : undefined,
    destinationPlace: destination,
    noOfDays: days,
    companion,
    budgetTier,
  });

  const rawTotal = data?.totalEstimatedCost || computed.totalEstimatedCost;
  const rawPerPerson = data?.perPersonCost || computed.perPersonCost;
  const rawTransport = data?.transport || computed.transport;
  const rawAccommodation = data?.accommodation || computed.accommodation;
  const rawFood = data?.food || computed.food;
  const rawEssentials = data?.essentials || computed.essentials;
  const rawInsurance = data?.insurance || computed.insurance;
  const rawContingency = data?.contingency || computed.contingency;

  // Apply currency conversion
  const displayCost = convertCurrencyString(rawTotal, selectedCurrency);
  const displayPerPerson = convertCurrencyString(rawPerPerson, selectedCurrency);
  const transportCost = convertCurrencyString(rawTransport, selectedCurrency);
  const accommodationCost = convertCurrencyString(rawAccommodation, selectedCurrency);
  const foodCost = convertCurrencyString(rawFood, selectedCurrency);
  const essentialsCost = convertCurrencyString(rawEssentials, selectedCurrency);
  const insuranceCost = convertCurrencyString(rawInsurance, selectedCurrency);
  const contingencyCost = convertCurrencyString(rawContingency, selectedCurrency);

  const transportDetails = plan?.transportDetails || computed.transportDetails;

  return (
    <SectionWrapper id="budgetrange">
      <div className="flex flex-col gap-4">
        {/* Title & Currency Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold tracking-wide flex items-center text-slate-100">
            <Wallet className="mr-2.5 w-6 h-6 text-emerald-400" /> Budget Range & Route Estimates
          </h2>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Currency:
            </span>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TRIP SUMMARY BADGES */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 font-medium">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>
              {origin === "Origin not specified" ? (
                <span className="italic text-slate-400">Origin not specified</span>
              ) : (
                origin
              )}{" "}
              → <strong className="text-slate-100">{destination}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#c86d51]" />
            <span>
              {days} Days / {nights} Night{nights > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 font-medium">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{travelers} Traveler{travelers > 1 ? "s" : ""}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>{budgetTier} Budget</span>
          </div>
        </div>

        {/* TRANSPORTATION SECTION CARD */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-indigo-400" />
              Transportation & Transit Route
            </span>
            <span className="text-[11px] text-slate-400">Estimated round-trip</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Route</p>
              <p className="font-semibold text-slate-200 flex items-center gap-1">
                <span>{origin}</span>
                <ArrowRight className="w-3 h-3 text-orange-400" />
                <span>{destination}</span>
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Recommended Option</p>
              <p className="font-semibold text-indigo-300">
                {transportDetails.recommendedMode}
              </p>
              <p className="text-[10px] text-slate-400">Approx. {transportDetails.estimatedDuration}</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Transport Share Cost</p>
              <p className="font-bold text-green-400 text-sm">
                {transportCost}
              </p>
            </div>
          </div>
        </div>

        {/* TOTAL BUDGET & PER PERSON BREAKDOWN */}
        {!isLoading ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-xl gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Estimated Total Trip Cost ({travelers} Traveler{travelers > 1 ? "s" : ""})
                </span>
                <span className="text-2xl font-extrabold text-green-400 tracking-tight">
                  {displayCost}
                </span>
              </div>
              <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Estimated Cost Per Person
                </span>
                <span className="text-lg font-bold text-emerald-300">
                  {displayPerPerson}
                </span>
              </div>
            </div>

            {/* CATEGORY BREAKDOWN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-300 font-medium">Essentials / Activities</span>
                <span className="font-semibold text-slate-100">{essentialsCost}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-300 font-medium">Transport</span>
                <span className="font-semibold text-slate-100">{transportCost}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-300 font-medium">Accommodation ({nights} Night{nights > 1 ? "s" : ""})</span>
                <span className="font-semibold text-slate-100">{accommodationCost}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-300 font-medium">Food</span>
                <span className="font-semibold text-slate-100">{foodCost}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-300 font-medium">Insurance</span>
                <span className="font-semibold text-slate-100">{insuranceCost}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                <span className="text-slate-300 font-medium">Contingency</span>
                <span className="font-semibold text-slate-100">{contingencyCost}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <Skeleton className="w-full h-12 bg-slate-800" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Skeleton className="w-full h-10 bg-slate-800" />
              <Skeleton className="w-full h-10 bg-slate-800" />
              <Skeleton className="w-full h-10 bg-slate-800" />
              <Skeleton className="w-full h-10 bg-slate-800" />
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default BudgetRange;
