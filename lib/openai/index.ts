import {
  batch1Schema,
  batch2Schema,
  batch3Schema,
  singleDaySchema,
  fullPlanSchema
} from "./schemas";

import OpenAI from "openai";

let openai: OpenAI;
const getOpenAIClient = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY || "dummy_key",
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return openai;
};

const promptSuffix = `generate travel data according to the schema and in json format,
                     do not return anything in your response outside of curly braces, 
                     generate response as per the functin schema provided. Dates given,
                     activity preference and travelling with may influence likw 50% while generating plan.`;

const callOpenAIApi = (prompt: string, schema: any, description: string) => {
  console.log({ prompt, schema });
  return getOpenAIClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a helpful travel assistant. You must respond ONLY with valid JSON matching the exact schema. Do not wrap the JSON in markdown fences. Do not add explanations before or after the JSON." },
      { role: "user", content: `${prompt}\n\nSchema:\n${JSON.stringify(schema)}\n\n${description}` },
    ],
    response_format: { type: "json_object" },
  });
};

export const generatebatch1 = (promptText: string) => {
  const prompt = `${promptText}, ${promptSuffix}`;
  const description = `Generate a description of information about a place or location according to the following schema:

  - About the Place:
    - A string containing information about the place, comprising at least 50 words.
  
  - Best Time to Visit:
    - A string specifying the best time to visit the place.
    
  - Trip Highlights:
    - A narrative story highlighting the journey and experiences.
    
  - Weather Analysis:
    - Expected conditions and best time to visit based on weather.
  
  Ensure that the function response adheres to the schema provided and is in JSON format. The response should not contain anything outside of the defined schema.
  `;
  return callOpenAIApi(prompt, batch1Schema, description);
}

type OpenAIInputType = {
  userPrompt: string;
  originPlace?: string | undefined;
  activityPreferences?: string[] | undefined;
  fromDate?: number | undefined;
  toDate?: number | undefined;
  companion?: string | undefined;
  budgetTier?: string | undefined;
};

export const generatebatch2 = (inputParams: OpenAIInputType) => {
  const description = `Generate a description of recommendations for an adventurous trip according to the following schema:
  - Top Adventures Activities:
    - An array listing top adventure activities to do, including at least 5 activities.
    - Each activity should be specified along with its location.
  
  - Local Cuisine Recommendations:
    - An array providing recommendations for local cuisine to try during the trip.
  
  - Packing Checklist:
    - An array containing items that should be included in the packing checklist for the trip.
    
  - Budget Range:
    - Total estimated cost range in INR and a detailed breakdown for essentials, transport, accommodation, food, insurance, and contingency.
  
  Ensure that the function response adheres to the schema provided and is in JSON format. The response should not contain anything outside of the defined schema.`;
  return callOpenAIApi(getPropmpt(inputParams), batch2Schema, description);
}

export const generatebatch3 = (inputParams: OpenAIInputType) => {
  const description = `Generate a description of a travel itinerary and top places to visit according to the following schema:
  - Itinerary:
    - An array containing details of the itinerary for the specified number of days.
    - Day 1 morning MUST include departure from origin (${inputParams.originPlace || "origin"}), travel/transit, and arrival at destination.
    - The final day MUST include return journey to origin (${inputParams.originPlace || "origin"}).
    - Each day's itinerary includes a title, detailed activities for morning, afternoon, evening, and night.
    - Includes food recommendations, stay options, optional activities, quick bookings, and tips for the day.
  
  - Top Places to Visit:
    - An array listing the top places to visit along with their coordinates.
    - Each place includes a name and coordinates (latitude and longitude).
  
  Ensure that the function response adheres to the schema provided and is in JSON format. The response should not contain anything outside of the defined schema.`;
  return callOpenAIApi(getPropmpt(inputParams), batch3Schema, description);
}

export const generateFullPlan = (inputParams: OpenAIInputType) => {
  const description = `Generate a complete and comprehensive travel plan according to the full schema provided. 
  It must include about the place, best time to visit, trip highlights, weather analysis, top adventures, local cuisine, packing checklist, budget range, itinerary, and top places to visit.
  Important: Day 1 itinerary must include departure from origin (${inputParams.originPlace || "origin"}), and the final day must include return to origin (${inputParams.originPlace || "origin"}).
  Ensure that the function response adheres to the schema provided and is in JSON format. The response should not contain anything outside of the defined schema.`;
  return callOpenAIApi(getPropmpt(inputParams), fullPlanSchema, description);
}

const getPropmpt = ({ userPrompt, originPlace, activityPreferences, companion, fromDate, toDate, budgetTier }: OpenAIInputType) => {
  let prompt = `${userPrompt}`;

  if (originPlace && originPlace.length > 0) {
    prompt += `, starting travel from ${originPlace}`;
  }
  if (fromDate && toDate) {
    prompt += `, from date-${fromDate} to date-${toDate}`;
  }
  if (companion && companion.length > 0) prompt += `, travelling with-${companion}`;
  if (activityPreferences && activityPreferences.length > 0) prompt += `, activity preferences-${activityPreferences.join(",")}`;
  if (budgetTier && budgetTier.length > 0) prompt += `, budget tier-${budgetTier}`;

  prompt = `${prompt}, ${promptSuffix}`;
  return prompt;
}

export const generateSingleDayItinerary = (inputParams: OpenAIInputType, dayIndex: number) => {
  const description = `Generate a description of a travel itinerary for a single day (Day ${dayIndex + 1}) according to the following schema:
  - Day Itinerary:
    - Include a title, detailed activities for morning, afternoon, evening, and night.
    - Include food recommendations, stay options, optional activities, quick bookings, and tips for this specific day.
  
  Ensure that the function response adheres to the schema provided and is in JSON format. The response should not contain anything outside of the defined schema.`;
  return callOpenAIApi(getPropmpt(inputParams) + `, specifically generate a brand new and different plan for Day ${dayIndex + 1}`, singleDaySchema, description);
}