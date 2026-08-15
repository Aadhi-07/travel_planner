export type BudgetTier = "Budget" | "Moderate" | "Luxury" | "Premium";

export interface BudgetInput {
  originPlace?: string;
  destinationPlace: string;
  noOfDays: number;
  companion?: string;
  budgetTier?: string;
  aiEstimates?: {
    transportMin?: number;
    transportMax?: number;
    accommodationMin?: number;
    accommodationMax?: number;
    foodMin?: number;
    foodMax?: number;
    activitiesMin?: number;
    activitiesMax?: number;
    insuranceMin?: number;
    insuranceMax?: number;
    contingencyMin?: number;
    contingencyMax?: number;
    recommendedMode?: string;
    estimatedDuration?: string;
  };
}

export interface CalculatedBudgetResult {
  totalEstimatedCost: string;
  perPersonCost: string;
  essentials: string;
  transport: string;
  accommodation: string;
  food: string;
  insurance: string;
  contingency: string;
  travelersCount: number;
  noOfDays: number;
  nightsCount: number;
  transportDetails: {
    origin: string;
    destination: string;
    recommendedMode: string;
    estimatedDuration: string;
    estimatedCostRange: string;
  };
  rawTotals: {
    totalMin: number;
    totalMax: number;
    perPersonMin: number;
    perPersonMax: number;
  };
}

export function parseTravelersCount(companion?: string): number {
  if (!companion) return 2; // Default to 2 travelers (couple/friends)
  const lower = companion.toLowerCase();
  if (lower.includes("solo") || lower.includes("single") || lower.includes("myself")) return 1;
  if (lower.includes("partner") || lower.includes("couple") || lower.includes("spouse") || lower.includes("duo")) return 2;
  if (lower.includes("family")) return 4;
  if (lower.includes("friends") || lower.includes("group")) return 3;
  return 2;
}

export function estimateRouteDistanceScale(origin?: string, destination?: string): "SHORT" | "MEDIUM" | "LONG" {
  if (!origin || !destination) return "MEDIUM";
  const o = origin.toLowerCase().trim();
  const d = destination.toLowerCase().trim();

  // Known short routes (< 150 km)
  const shortPairs = [
    ["chennai", "pondicherry"],
    ["coimbatore", "ooty"],
    ["mumbai", "lonavala"],
    ["mumbai", "pune"],
    ["bangalore", "mysore"],
    ["delhi", "agra"],
  ];

  for (const [p1, p2] of shortPairs) {
    if ((o.includes(p1) && d.includes(p2)) || (o.includes(p2) && d.includes(p1))) {
      return "SHORT";
    }
  }

  // Known long/flight routes (> 800 km)
  const longCities = ["kashmir", "leh", "ladakh", "srinagar", "goa", "kerala", "andaman", "thailand", "bali"];
  for (const city of longCities) {
    if (d.includes(city) && !o.includes(city)) {
      return "LONG";
    }
  }

  return "MEDIUM";
}

export function calculateRealisticBudget(input: BudgetInput): CalculatedBudgetResult {
  const origin = input.originPlace?.trim() || "Origin not specified";
  const destination = input.destinationPlace.trim();
  const days = Math.max(1, input.noOfDays || 1);
  const nights = Math.max(1, days - 1);
  const travelers = parseTravelersCount(input.companion);
  const roomsNeeded = Math.ceil(travelers / 2);

  const tier: BudgetTier =
    (input.budgetTier as BudgetTier) || "Moderate";

  const routeScale = estimateRouteDistanceScale(input.originPlace, input.destinationPlace);

  // Base transport rates per traveler round-trip (INR)
  let transportRateMin = 1500;
  let transportRateMax = 3000;
  let recommendedMode = "Bus / Train";
  let estimatedDuration = "4–6 hours";

  if (routeScale === "SHORT") {
    transportRateMin = 500;
    transportRateMax = 1500;
    recommendedMode = "Bus / Car / Local Train";
    estimatedDuration = "2–3 hours";
  } else if (routeScale === "LONG") {
    transportRateMin = 4500;
    transportRateMax = 9000;
    recommendedMode = "Flight / Express Train";
    estimatedDuration = "6–10 hours";
  } else {
    // Medium distance
    if (tier === "Luxury" || tier === "Premium") {
      transportRateMin = 3000;
      transportRateMax = 6000;
      recommendedMode = "Private Cab / Flight";
    }
  }

  // Accommodation rate per room per night (INR)
  let roomMin = 2000;
  let roomMax = 3500;
  if (tier === "Budget") {
    roomMin = 1000;
    roomMax = 2000;
  } else if (tier === "Luxury" || tier === "Premium") {
    roomMin = 5000;
    roomMax = 12000;
  }

  // Food rate per person per day (INR)
  let foodRateMin = 600;
  let foodRateMax = 1000;
  if (tier === "Budget") {
    foodRateMin = 350;
    foodRateMax = 600;
  } else if (tier === "Luxury" || tier === "Premium") {
    foodRateMin = 1500;
    foodRateMax = 3000;
  }

  // Activities / Essentials rate per person per day (INR)
  let activityRateMin = 300;
  let activityRateMax = 700;
  if (tier === "Budget") {
    activityRateMin = 150;
    activityRateMax = 400;
  } else if (tier === "Luxury" || tier === "Premium") {
    activityRateMin = 1000;
    activityRateMax = 2500;
  }

  // Insurance per person (INR)
  let insuranceMin = 0;
  let insuranceMax = 300;
  if (tier === "Luxury" || tier === "Premium") {
    insuranceMin = 300;
    insuranceMax = 800;
  }

  // Override with AI estimates if present and within reasonable bounds
  const ai = input.aiEstimates;
  let transportMin = ai?.transportMin ?? transportRateMin * travelers;
  let transportMax = ai?.transportMax ?? transportRateMax * travelers;
  let accommodationMin = ai?.accommodationMin ?? roomMin * roomsNeeded * nights;
  let accommodationMax = ai?.accommodationMax ?? roomMax * roomsNeeded * nights;
  let foodMin = ai?.foodMin ?? foodRateMin * travelers * days;
  let foodMax = ai?.foodMax ?? foodRateMax * travelers * days;
  let activitiesMin = ai?.activitiesMin ?? activityRateMin * travelers * days;
  let activitiesMax = ai?.activitiesMax ?? activityRateMax * travelers * days;
  let insuranceMinVal = ai?.insuranceMin ?? insuranceMin * travelers;
  let insuranceMaxVal = ai?.insuranceMax ?? insuranceMax * travelers;

  // SANITY CHECK LAYER: Prevent inflated budget numbers
  // Maximum expected budget cap for short domestic trips (e.g. 2 days, moderate, 2 travelers)
  const maxSanityCapPerPersonPerDay = tier === "Luxury" ? 12000 : tier === "Budget" ? 2500 : 5000;
  const maxSanityTotalMax = maxSanityCapPerPersonPerDay * travelers * days + (routeScale === "LONG" ? 12000 : 4000);

  let rawTotalMin = transportMin + accommodationMin + foodMin + activitiesMin + insuranceMinVal;
  let rawTotalMax = transportMax + accommodationMax + foodMax + activitiesMax + insuranceMaxVal;

  if (rawTotalMax > maxSanityTotalMax && routeScale !== "LONG") {
    // Scale down category values proportionally to stay realistic
    const scaleFactor = maxSanityTotalMax / rawTotalMax;
    transportMin = Math.round(transportMin * scaleFactor);
    transportMax = Math.round(transportMax * scaleFactor);
    accommodationMin = Math.round(accommodationMin * scaleFactor);
    accommodationMax = Math.round(accommodationMax * scaleFactor);
    foodMin = Math.round(foodMin * scaleFactor);
    foodMax = Math.round(foodMax * scaleFactor);
    activitiesMin = Math.round(activitiesMin * scaleFactor);
    activitiesMax = Math.round(activitiesMax * scaleFactor);
    insuranceMinVal = Math.round(insuranceMinVal * scaleFactor);
    insuranceMaxVal = Math.round(insuranceMaxVal * scaleFactor);
  }

  // Contingency = 5-10% of subtotal
  const subtotalMin = transportMin + accommodationMin + foodMin + activitiesMin + insuranceMinVal;
  const subtotalMax = transportMax + accommodationMax + foodMax + activitiesMax + insuranceMaxVal;
  const contingencyMin = Math.round(subtotalMin * 0.05);
  const contingencyMax = Math.round(subtotalMax * 0.08);

  const totalMin = subtotalMin + contingencyMin;
  const totalMax = subtotalMax + contingencyMax;

  const perPersonMin = Math.round(totalMin / travelers);
  const perPersonMax = Math.round(totalMax / travelers);

  const formatINR = (val: number) => `₹${val.toLocaleString("en-IN")}`;

  return {
    totalEstimatedCost: `${formatINR(totalMin)} — ${formatINR(totalMax)}`,
    perPersonCost: `${formatINR(perPersonMin)} — ${formatINR(perPersonMax)} per person`,
    essentials: `${formatINR(activitiesMin)} — ${formatINR(activitiesMax)}`,
    transport: `${formatINR(transportMin)} — ${formatINR(transportMax)}`,
    accommodation: `${formatINR(accommodationMin)} — ${formatINR(accommodationMax)}`,
    food: `${formatINR(foodMin)} — ${formatINR(foodMax)}`,
    insurance: `${formatINR(insuranceMinVal)} — ${formatINR(insuranceMaxVal)}`,
    contingency: `${formatINR(contingencyMin)} — ${formatINR(contingencyMax)}`,
    travelersCount: travelers,
    noOfDays: days,
    nightsCount: nights,
    transportDetails: {
      origin,
      destination,
      recommendedMode: ai?.recommendedMode || recommendedMode,
      estimatedDuration: ai?.estimatedDuration || estimatedDuration,
      estimatedCostRange: `${formatINR(transportMin)} — ${formatINR(transportMax)}`,
    },
    rawTotals: {
      totalMin,
      totalMax,
      perPersonMin,
      perPersonMax,
    },
  };
}
