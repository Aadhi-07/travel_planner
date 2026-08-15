import { NextResponse } from "next/server";
import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY || "",
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return openaiClient;
}

const cleanJsonString = (str: string) => {
  let clean = str.trim();
  // Strip markdown code fences if present
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  const match = clean.match(/\{[\s\S]*\}/);
  if (match) {
    clean = match[0];
  }
  return clean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trip, friend } = body;

    if (!trip) {
      return NextResponse.json(
        { error: "Trip details are required." },
        { status: 400 }
      );
    }

    const friendName = friend?.name || "Bro";
    const personality = (friend?.personality || []).join(", ");
    const interests = (friend?.interests || []).join(", ");
    const tone = friend?.tone || "Casual";
    const extraInfo = friend?.extraInfo || "";

    const systemPrompt = `You are a highly creative travel persuasion assistant.

Create a message that convinces the user's friend (${friendName}) to join the trip.

Use the friend's personality (${personality}) and interests (${interests}) to make the message personally relevant.

Use real details from the supplied trip data.
Do NOT invent trip facts, hotel bookings, ticket prices, restaurant reservations, or attractions that are NOT present in the supplied data.

The message should sound like a real friend sending a WhatsApp/DM message, NOT like an advertisement.
Avoid corporate language.
Avoid generic phrases such as: "Don't miss this amazing opportunity."

Instead, make specific references to the destination, activities, food, itinerary, and budget.
Do NOT use emojis in the message, headline, or closing line.

Tone directives:
- If Funny: Use natural humor and casual banter.
- If Hype: Make the trip exciting and energetic with high hype.
- If Emotional: Emphasize friendship, nostalgia, and making unforgettable memories together.
- If Casual: Make it sound like a chill, normal friend inviting another friend.
- If Savage/Friendly Roast: Use playful teasing and light roasts about them always staying home, but keep it warm and non-offensive.
- If Persuasive: Deliver logical, irresistible reasons why skipping this trip is a bad idea.

Personalization directives:
- If friend is budget-conscious: Emphasize reasonable costs and great value.
- If friend is a foodie: Emphasize local cuisines, food recommendations, and cafes.
- If friend is adventurous: Emphasize top adventure activities and exploration.
- If friend likes photography: Emphasize scenic spots, viewpoints, and photo opportunities.
- If friend likes relaxation: Emphasize peaceful vibes, downtime, and stress-free itinerary items.

Budget directive:
If an exact budget/cost is provided in the trip data, format it nicely (e.g. ₹3,500). If no exact price is present in the trip data, do NOT invent a number — instead set estimatedCost to "We've got a reasonable budget planned."

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
- Name: ${friendName}
- Personality: ${personality || "Friendly"}
- Interests: ${interests || "Travel, Good times"}
- Requested Tone: ${tone}
- Additional Context/Notes: ${extraInfo || "None"}

Supplied Trip Information:
- Destination: ${trip.destination || "Unknown"}
- Overview: ${trip.overview || ""}
- Trip Highlights: ${trip.tripHighlights || ""}
- Weather: ${typeof trip.weather === "string" ? trip.weather : JSON.stringify(trip.weather || "")}
- Top Activities: ${JSON.stringify(trip.topActivities || [])}
- Top Places: ${JSON.stringify(trip.topPlaces || [])}
- Itinerary Summary: ${JSON.stringify(trip.itinerary || [])}
- Local Cuisines: ${JSON.stringify(trip.localCuisines || [])}
- Packing Checklist: ${JSON.stringify(trip.packingChecklist || [])}
- Best Time to Visit: ${trip.bestTimeToVisit || ""}
- Budget Info: ${typeof trip.budget === "object" ? JSON.stringify(trip.budget) : trip.budget || ""}
- Trip Duration: ${trip.duration || ""}
- Travel Style / Companion: ${trip.travelStyle || ""}
- Travelers: ${trip.travelers || ""}
`;

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const rawResponse = completion.choices[0]?.message?.content || "";
    const cleanedJson = cleanJsonString(rawResponse);
    const parsedData = JSON.parse(cleanedJson);

    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error("Error in /api/convince-friends:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate persuasion message." },
      { status: 500 }
    );
  }
}
