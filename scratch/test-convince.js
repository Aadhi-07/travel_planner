const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");

// Read .env manually
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      process.env[key.trim()] = vals.join("=").trim();
    }
  });
}

async function testGroqConvince() {
  console.log("Testing Groq API for Convince Your Friends...");
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY missing!");
    return;
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const trip = {
    destination: "Ooty, India",
    overview: "Beautiful hill station with tea plantations, scenic views, and pleasant weather.",
    tripHighlights: "Mountain adventure, local tea tasting, scenic train ride, botanical garden visit.",
    weather: "Cool and pleasant, 15-20°C",
    topActivities: ["Nilgiri Mountain Railway ride", "Trekking to Doddabetta Peak", "Boating in Ooty Lake"],
    topPlaces: ["Doddabetta Peak", "Ooty Botanical Gardens", "Pykara Lake"],
    localCuisines: ["Ooty Homemade Chocolates", "Fresh Nilgiri Tea", "South Indian Thali"],
    bestTimeToVisit: "October to June",
    budget: { totalEstimatedCost: "₹7,000 per person" },
    duration: "3 Days",
    travelers: "Friends",
  };

  const friend = {
    name: "Alex",
    personality: ["Adventurous", "Foodie"],
    interests: ["Food", "Adventure", "Photography"],
    tone: "Savage/Friendly Roast",
    extraInfo: "Always says he has no time to travel.",
  };

  const systemPrompt = `You are a highly creative travel persuasion assistant.

Create a message that convinces the user's friend (${friend.name}) to join the trip.

Use the friend's personality (${friend.personality.join(", ")}) and interests (${friend.interests.join(", ")}) to make the message personally relevant.

Use real details from the supplied trip data.
Do NOT invent trip facts, hotel bookings, ticket prices, restaurant reservations, or attractions that are NOT present in the supplied data.

The message should sound like a real friend sending a WhatsApp/DM message, NOT like an advertisement.
Avoid corporate language.
Avoid generic phrases such as: "Don't miss this amazing opportunity."

Instead, make specific references to the destination, activities, food, itinerary, and budget.

Tone directive: Savage/Friendly Roast - use playful teasing about them always staying home, but keep it warm and non-offensive.

You MUST return strictly a single valid JSON object matching this schema EXACTLY:
{
  "headline": "Short snappy line or title for the pitch",
  "message": "The main multi-paragraph or bulleted WhatsApp style invitation message",
  "whyYouShouldCome": ["Reason 1", "Reason 2", "Reason 3"],
  "tripHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "estimatedCost": "Exact cost from trip or 'We've got a reasonable budget planned.'",
  "closingLine": "A punchy final call to action line"
}

Return ONLY valid JSON. No markdown code fences. No explanation outside JSON.`;

  const userPrompt = `
Friend Information:
- Name: ${friend.name}
- Personality: ${friend.personality.join(", ")}
- Interests: ${friend.interests.join(", ")}
- Requested Tone: ${friend.tone}
- Additional Context/Notes: ${friend.extraInfo}

Supplied Trip Information:
${JSON.stringify(trip, null, 2)}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const raw = completion.choices[0]?.message?.content || "";
    console.log("Raw Response:\n", raw);

    const parsed = JSON.parse(raw);
    console.log("\nParsed JSON successfully!");
    console.log("Headline:", parsed.headline);
    console.log("Message:", parsed.message);
    console.log("Why You Should Come:", parsed.whyYouShouldCome);
    console.log("Highlights:", parsed.tripHighlights);
    console.log("Estimated Cost:", parsed.estimatedCost);
    console.log("Closing Line:", parsed.closingLine);
  } catch (err) {
    console.error("Groq Test Error:", err);
  }
}

testGroqConvince();
