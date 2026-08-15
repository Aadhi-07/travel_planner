"use client";

import React, { useState } from "react";
import { usePlanContext } from "@/contexts/PlanContextProvider";
import { MapPin, Calendar, Users, Sparkles, Copy, Check, ArrowRight, Backpack, Wallet, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { calculateRealisticBudget } from "@/lib/budgetCalculator";
import { differenceInDays } from "date-fns";

export default function InvitePlanView({ planId }: { planId: string }) {
  const { isLoading, plan } = usePlanContext();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (isLoading || !plan) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin"></div>
        <p className="text-sm text-slate-400">Loading your trip invitation...</p>
      </div>
    );
  }

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
  const companion = plan?.companion || "Friends";
  const budgetTier = (plan as any)?.budgetTier || "Moderate";

  const budget = calculateRealisticBudget({
    originPlace: origin !== "Origin not specified" ? origin : undefined,
    destinationPlace: destination,
    noOfDays: days,
    companion,
    budgetTier,
  });

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invitation link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* INVITATION HEADER HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/50 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-300 border border-orange-500/30">
            <Backpack className="mr-1.5 h-3.5 w-3.5 text-orange-400" /> You're Invited on a Trip!
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Pack Your Bags for <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">{destination}</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {plan.abouttheplace || `Get ready for an exciting ${days}-day getaway to ${destination}.`}
        </p>

        {/* ROUTE & SUMMARY BADGES */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-medium">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>
              {origin} <ArrowRight className="w-3.5 h-3.5 inline text-orange-400 mx-1" /> <strong>{destination}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-medium">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>{days} Days / {nights} Night{nights > 1 ? "s" : ""}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-medium">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{companion}</span>
          </div>
        </div>
      </div>

      {/* ESTIMATED SHARE & HIGHLIGHTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-green-400" /> Estimated Per Person Share
            </span>
            <p className="text-2xl font-extrabold text-green-400 mt-1">
              {budget.perPersonCost}
            </p>
          </div>
          <p className="text-[11px] text-slate-400">
            Total estimated trip cost: {budget.totalEstimatedCost} ({budget.travelersCount} travelers)
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Trip Highlights
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
            {(plan.adventuresactivitiestodo || []).slice(0, 3).map((act: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400">✨</span>
                <span className="line-clamp-1">{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Button
          onClick={handleCopyInviteLink}
          variant="outline"
          className="border-slate-700 text-slate-200 hover:bg-slate-800"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" /> Link Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" /> Copy Invite Link
            </>
          )}
        </Button>

        <Link href={`/plans/${planId}/community-plan`}>
          <Button className="bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-600/20">
            <Globe className="w-4 h-4 mr-2" /> View Full Trip Plan
          </Button>
        </Link>
      </div>
    </div>
  );
}
