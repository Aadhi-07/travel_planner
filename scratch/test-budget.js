function parseTravelersCount(companion) {
  if (!companion) return 2;
  const lower = companion.toLowerCase();
  if (lower.includes("solo") || lower.includes("single") || lower.includes("myself")) return 1;
  if (lower.includes("partner") || lower.includes("couple") || lower.includes("spouse") || lower.includes("duo")) return 2;
  if (lower.includes("family")) return 4;
  if (lower.includes("friends") || lower.includes("group")) return 3;
  return 2;
}

function estimateRouteDistanceScale(origin, destination) {
  if (!origin || !destination) return "MEDIUM";
  const o = origin.toLowerCase().trim();
  const d = destination.toLowerCase().trim();

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

  const longCities = ["kashmir", "leh", "ladakh", "srinagar", "goa", "kerala", "andaman", "thailand", "bali"];
  for (const city of longCities) {
    if (d.includes(city) && !o.includes(city)) {
      return "LONG";
    }
  }

  return "MEDIUM";
}

function calculateRealisticBudget(input) {
  const origin = input.originPlace?.trim() || "Origin not specified";
  const destination = input.destinationPlace.trim();
  const days = Math.max(1, input.noOfDays || 1);
  const nights = Math.max(1, days - 1);
  const travelers = parseTravelersCount(input.companion);
  const roomsNeeded = Math.ceil(travelers / 2);
  const tier = input.budgetTier || "Moderate";

  const routeScale = estimateRouteDistanceScale(input.originPlace, input.destinationPlace);

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
  }

  let roomMin = 2000;
  let roomMax = 3500;
  if (tier === "Budget") {
    roomMin = 1000;
    roomMax = 2000;
  } else if (tier === "Luxury") {
    roomMin = 5000;
    roomMax = 12000;
  }

  let foodRateMin = 600;
  let foodRateMax = 1000;
  let activityRateMin = 300;
  let activityRateMax = 700;
  let insuranceMin = 0;
  let insuranceMax = 300;

  let transportMin = transportRateMin * travelers;
  let transportMax = transportRateMax * travelers;
  let accommodationMin = roomMin * roomsNeeded * nights;
  let accommodationMax = roomMax * roomsNeeded * nights;
  let foodMin = foodRateMin * travelers * days;
  let foodMax = foodRateMax * travelers * days;
  let activitiesMin = activityRateMin * travelers * days;
  let activitiesMax = activityRateMax * travelers * days;
  let insuranceMinVal = insuranceMin * travelers;
  let insuranceMaxVal = insuranceMax * travelers;

  const subtotalMin = transportMin + accommodationMin + foodMin + activitiesMin + insuranceMinVal;
  const subtotalMax = transportMax + accommodationMax + foodMax + activitiesMax + insuranceMaxVal;
  const contingencyMin = Math.round(subtotalMin * 0.05);
  const contingencyMax = Math.round(subtotalMax * 0.08);

  const totalMin = subtotalMin + contingencyMin;
  const totalMax = subtotalMax + contingencyMax;

  const perPersonMin = Math.round(totalMin / travelers);
  const perPersonMax = Math.round(totalMax / travelers);

  const formatINR = (val) => `₹${val.toLocaleString("en-IN")}`;

  return {
    totalEstimatedCost: `${formatINR(totalMin)} — ${formatINR(totalMax)}`,
    perPersonCost: `${formatINR(perPersonMin)} — ${formatINR(perPersonMax)} per person`,
    essentials: `${formatINR(activitiesMin)} — ${formatINR(activitiesMax)}`,
    transport: `${formatINR(transportMin)} — ${formatINR(transportMax)}`,
    accommodation: `${formatINR(accommodationMin)} — ${formatINR(accommodationMax)}`,
    food: `${formatINR(foodMin)} — ${formatINR(foodMax)}`,
    insurance: `${formatINR(insuranceMinVal)} — ${formatINR(insuranceMaxVal)}`,
    contingency: `${formatINR(contingencyMin)} — ${formatINR(contingencyMax)}`,
    transportDetails: {
      origin,
      destination,
      recommendedMode,
      estimatedDuration,
    },
  };
}

console.log("==================================================");
console.log("RUNNING BUDGET CALCULATOR TEST SUITE FOR 5 SCENARIOS");
console.log("==================================================\n");

// TEST 1: Chennai -> Ooty (2 days, 2 travelers, Moderate)
const test1 = calculateRealisticBudget({
  originPlace: "Chennai",
  destinationPlace: "Ooty",
  noOfDays: 2,
  companion: "Couple (2)",
  budgetTier: "Moderate",
});

console.log("[TEST 1: Chennai → Ooty (2 Days, 2 Travelers, Moderate)]");
console.log("Total Estimated Cost:", test1.totalEstimatedCost);
console.log("Per Person Cost:    ", test1.perPersonCost);
console.log("Transport:          ", test1.transport);
console.log("Accommodation:      ", test1.accommodation);
console.log("Food:               ", test1.food);
console.log("Essentials:         ", test1.essentials);
console.log("--------------------------------------------------\n");

// TEST 2: Coimbatore -> Ooty (2 days, 2 travelers, Moderate)
const test2 = calculateRealisticBudget({
  originPlace: "Coimbatore",
  destinationPlace: "Ooty",
  noOfDays: 2,
  companion: "Couple (2)",
  budgetTier: "Moderate",
});

console.log("[TEST 2: Coimbatore → Ooty (Short distance test)]");
console.log("Total Estimated Cost:", test2.totalEstimatedCost);
console.log("Transport Cost:     ", test2.transport);
console.log("Comparison vs Test1 : Transport for Coimbatore (", test2.transport, ") vs Chennai (", test1.transport, ")");
console.log("--------------------------------------------------\n");

// TEST 3: Chennai -> Ooty (5 days, 2 travelers, Moderate)
const test3 = calculateRealisticBudget({
  originPlace: "Chennai",
  destinationPlace: "Ooty",
  noOfDays: 5,
  companion: "Couple (2)",
  budgetTier: "Moderate",
});

console.log("[TEST 3: Chennai → Ooty (5 Days vs 2 Days test)]");
console.log("Total Estimated Cost (5 days):", test3.totalEstimatedCost);
console.log("Accommodation (4 nights):     ", test3.accommodation);
console.log("Food (5 days):                ", test3.food);
console.log("Comparison vs Test1 (2 days): ", test1.totalEstimatedCost, " -> ", test3.totalEstimatedCost);
console.log("--------------------------------------------------\n");

// TEST 4: Chennai -> Goa (2 days, 2 travelers, Moderate)
const test4 = calculateRealisticBudget({
  originPlace: "Chennai",
  destinationPlace: "Goa",
  noOfDays: 2,
  companion: "Couple (2)",
  budgetTier: "Moderate",
});

console.log("[TEST 4: Chennai → Goa (Flight/Long route test)]");
console.log("Total Estimated Cost:", test4.totalEstimatedCost);
console.log("Transport Cost:     ", test4.transport);
console.log("Recommended Mode:   ", test4.transportDetails.recommendedMode);
console.log("--------------------------------------------------\n");

// TEST 5: Chennai -> Ooty (2 days, 4 travelers, Moderate)
const test5 = calculateRealisticBudget({
  originPlace: "Chennai",
  destinationPlace: "Ooty",
  noOfDays: 2,
  companion: "Family (4)",
  budgetTier: "Moderate",
});

console.log("[TEST 5: Chennai → Ooty (4 Travelers vs 2 Travelers test)]");
console.log("Total Estimated Cost (4 travelers):", test5.totalEstimatedCost);
console.log("Per Person Cost (4 travelers):    ", test5.perPersonCost);
console.log("Accommodation (4 travelers):      ", test5.accommodation);
console.log("Food (4 travelers):               ", test5.food);
console.log("==================================================");
