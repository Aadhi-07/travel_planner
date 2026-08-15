"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  RotateCw,
  AlertCircle,
  Flame,
  ArrowLeft,
  ArrowRight,
  Backpack,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PERSONALITY_OPTIONS = [
  { id: "Adventurous", label: "Adventurous" },
  { id: "Foodie", label: "Foodie" },
  { id: "Photographer", label: "Photographer" },
  { id: "Chill", label: "Chill" },
  { id: "Budget Conscious", label: "Budget Conscious" },
  { id: "Party Lover", label: "Party Lover" },
  { id: "Nature Lover", label: "Nature Lover" },
  { id: "Shopping Lover", label: "Shopping Lover" },
  { id: "Road Trip Lover", label: "Road Trip Lover" },
];

const INTEREST_OPTIONS = [
  "Food",
  "Nature",
  "Adventure",
  "Photography",
  "Shopping",
  "History",
  "Nightlife",
  "Relaxation",
  "Road Trips",
  "Culture",
];

const TONE_OPTIONS = [
  { id: "Funny", label: "Funny" },
  { id: "Hype", label: "Hype" },
  { id: "Emotional", label: "Emotional" },
  { id: "Casual", label: "Casual" },
  { id: "Persuasive", label: "Persuasive" },
  { id: "Savage/Friendly Roast", label: "Savage/Friendly Roast" },
];

const QUICK_STYLES = [
  { id: "Hype", label: "Hype Me Up", tone: "Hype" },
  { id: "Funny", label: "Make It Funny", tone: "Funny" },
  { id: "Emotional", label: "Make It Emotional", tone: "Emotional" },
  { id: "Savage/Friendly Roast", label: "Roast My Friend", tone: "Savage/Friendly Roast" },
  { id: "Budget-Friendly", label: "Make It Budget-Friendly", tone: "Persuasive" },
  { id: "Adventure", label: "Adventure Pitch", tone: "Hype" },
];

type ConvinceResult = {
  headline: string;
  message: string;
  whyYouShouldCome: string[];
  tripHighlights: string[];
  estimatedCost: string;
  closingLine: string;
};

interface ConvinceFriendsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: any;
}

export default function ConvinceFriendsModal({
  isOpen,
  onOpenChange,
  plan,
}: ConvinceFriendsModalProps) {
  const { toast } = useToast();
  const [friendName, setFriendName] = useState("");
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([
    "Adventurous",
    "Foodie",
  ]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Food",
    "Adventure",
  ]);
  const [selectedTone, setSelectedTone] = useState("Funny");
  const [extraInfo, setExtraInfo] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [result, setResult] = useState<ConvinceResult | null>(null);
  const [copied, setCopied] = useState(false);

  const togglePersonality = (id: string) => {
    setSelectedPersonalities((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const constructTripPayload = () => {
    return {
      destination: plan?.nameoftheplace || "Destination",
      overview: plan?.abouttheplace || "",
      tripHighlights: plan?.tripHighlights || "",
      weather: plan?.weatherAnalysis?.expectedConditions || plan?.besttimetovisit || "",
      topActivities: plan?.adventuresactivitiestodo || [],
      topPlaces: (plan?.topplacestovisit || []).map((p: any) =>
        typeof p === "string" ? p : p?.name
      ),
      itinerary: plan?.itinerary || [],
      localCuisines: plan?.localcuisinerecommendations || [],
      packingChecklist: plan?.packingchecklist || [],
      bestTimeToVisit: plan?.besttimetovisit || "",
      budget: plan?.budgetRange?.totalEstimatedCost || plan?.budgetRange || null,
      duration: plan?.itinerary ? `${plan.itinerary.length} Days` : "",
      travelStyle: plan?.activityPreferences?.join(", ") || "",
      travelers: plan?.companion || "",
    };
  };

  const handleGenerate = async (overrideTone?: string) => {
    const toneToUse = overrideTone || selectedTone;
    if (overrideTone) {
      setSelectedTone(overrideTone);
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const payload = {
        trip: constructTripPayload(),
        friend: {
          name: friendName.trim() || "Bro",
          personality: selectedPersonalities,
          interests: selectedInterests,
          tone: toneToUse,
          extraInfo: extraInfo.trim(),
        },
      };

      const res = await fetch("/api/convince-friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to generate invitation");
      }

      const data: ConvinceResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Convince Friends error:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async () => {
    if (!result) return;
    const fullText = `${result.headline ? result.headline + "\n\n" : ""}${result.message}\n\n${
      result.closingLine || ""
    }`.trim();

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Persuasion message copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const destination = plan?.nameoftheplace || "our trip";
    const fullText = `${result.headline ? result.headline + "\n\n" : ""}${result.message}\n\n${
      result.closingLine || ""
    }`.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trip to ${destination}`,
          text: fullText,
        });
        toast({
          title: "Shared successfully!",
          description: "Invitation sent to your friend.",
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          handleCopyMessage();
        }
      }
    } else {
      handleCopyMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-slate-900 border-slate-800 text-slate-100 rounded-2xl shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2">
            <Backpack className="w-6 h-6 text-orange-400" />
            <span>Convince Your Friends</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Tell us what makes your friend tick. We'll make the pitch.
          </DialogDescription>
        </DialogHeader>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin flex items-center justify-center"></div>
              <Sparkles className="w-6 h-6 text-amber-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-lg font-semibold text-amber-300 animate-pulse">
              Cooking up the perfect excuse for your friend...
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Analyzing trip details, local food highlights, activities, and tuning the tone...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {!isLoading && hasError && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 bg-red-950/30 border border-red-800/50 rounded-xl p-6">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-red-200">Couldn't create the pitch.</h3>
              <p className="text-xs text-red-300/80">
                An issue occurred while connecting to the AI generator. Please try again.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="default"
                onClick={() => handleGenerate()}
                className="bg-orange-600 hover:bg-orange-500 text-white font-semibold"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={() => setHasError(false)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* RESULT PITCH CARD VIEW */}
        {!isLoading && !hasError && result && (
          <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                Your Pitch Is Ready
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResult(null)}
                className="text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 h-8 px-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Edit Friend Info
              </Button>
            </div>

            {/* Generated WhatsApp Style Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>

              {result.headline && (
                <h4 className="text-lg font-bold text-amber-300 tracking-tight">
                  "{result.headline}"
                </h4>
              )}

              <div className="text-slate-200 text-sm whitespace-pre-line leading-relaxed font-sans bg-slate-900/90 border border-slate-800/80 p-4 rounded-lg shadow-sm">
                {result.message}
              </div>

              {result.closingLine && (
                <p className="text-sm font-semibold text-orange-400 italic flex items-center gap-1">
                  <ArrowRight className="w-4 h-4 inline shrink-0" />
                  <span>{result.closingLine}</span>
                </p>
              )}
            </div>

            {/* Why You Should Come & Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.whyYouShouldCome && result.whyYouShouldCome.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Why you should come:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.whyYouShouldCome.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.estimatedCost && (
                <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Estimated Share:
                    </h5>
                    <p className="text-lg font-extrabold text-green-400 mt-1">
                      {result.estimatedCost}
                    </p>
                  </div>
                  {result.tripHighlights && result.tripHighlights.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <p className="text-[11px] text-slate-400 font-medium">
                        Highlights: {result.tripHighlights.join(" • ")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MULTIPLE PITCH STYLES */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-400">
                Switch Style & Regenerate:
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_STYLES.map((style) => {
                  const isActive = selectedTone === style.tone;
                  return (
                    <button
                      key={style.id}
                      onClick={() => handleGenerate(style.tone)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 font-medium ${
                        isActive
                          ? "bg-orange-500/20 border-orange-500 text-orange-300 shadow-sm"
                          : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <span>{style.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MAIN ACTIONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleCopyMessage}
                  className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-600/20"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Message
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1 sm:flex-none border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                <Button
                  onClick={async () => {
                    const inviteUrl = `${window.location.origin}/plans/${plan._id}/invite`;
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: `You're invited to ${plan?.nameoftheplace || "a trip"}!`,
                          url: inviteUrl,
                        });
                      } catch (err: any) {
                        if (err.name !== "AbortError") {
                          await navigator.clipboard.writeText(inviteUrl);
                          toast({ title: "Invite Link Copied!", description: inviteUrl });
                        }
                      }
                    } else {
                      await navigator.clipboard.writeText(inviteUrl);
                      toast({ title: "Invite Link Copied!", description: inviteUrl });
                    }
                  }}
                  variant="secondary"
                  className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold"
                >
                  Create Shareable Web Invite
                </Button>
              </div>

              <Button
                onClick={() => handleGenerate()}
                variant="ghost"
                className="w-full sm:w-auto text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs"
              >
                <RotateCw className="w-3.5 h-3.5 mr-1.5" />
                Regenerate Pitch
              </Button>
            </div>
          </div>
        )}

        {/* FORM VIEW */}
        {!isLoading && !hasError && !result && (
          <div className="space-y-6 pt-2">
            {/* Friend's Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Friend's Name
              </label>
              <Input
                placeholder="Bro (Default)"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-orange-500 text-xs"
              />
            </div>

            {/* Friend's Personality */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex justify-between">
                <span>Friend's Personality</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Select multiple
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PERSONALITY_OPTIONS.map((item) => {
                  const isSelected = selectedPersonalities.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePersonality(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-orange-500/15 border-orange-500/80 text-orange-200 shadow-sm"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Friend's Interests */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex justify-between">
                <span>Friend's Interests</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Select multiple
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-500/80 text-amber-200"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TONE_OPTIONS.map((item) => {
                  const isSelected = selectedTone === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTone(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500 text-orange-200 shadow-md"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Context Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Anything you want your friend to know?
              </label>
              <Textarea
                placeholder="Example: He's always saying trips are expensive."
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                rows={2}
                className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-orange-500 text-xs"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <Button
                onClick={() => handleGenerate()}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                Generate Pitch
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
