"use client";

import React, { useState } from "react";
import { Sparkles, Backpack, ArrowRight } from "lucide-react";
import ConvinceFriendsModal from "./ConvinceFriendsModal";

interface ConvinceFriendsCardProps {
  plan: any;
}

export default function ConvinceFriendsCard({ plan }: ConvinceFriendsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 p-5 sm:p-6 shadow-xl transition-all duration-300 hover:border-orange-500/60 hover:shadow-orange-500/10 hover:shadow-2xl"
      >
        {/* Decorative background glow */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl group-hover:bg-orange-500/20 transition-all duration-500"></div>
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-amber-500/10 blur-3xl group-hover:bg-amber-500/20 transition-all duration-500"></div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
              <Backpack className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-100 group-hover:text-orange-400 transition-colors">
                  Convince Your Friends
                </h3>
                <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-semibold text-orange-400 border border-orange-500/20">
                  <Sparkles className="mr-1 h-3 w-3" /> AI Persuader
                </span>
              </div>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                Turn your trip into an irresistible invite.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-600/20 group-hover:bg-orange-500 transition-all">
              <span>Make The Pitch</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      <ConvinceFriendsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        plan={plan}
      />
    </>
  );
}
