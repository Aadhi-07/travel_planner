require("dotenv").config({ path: ".env" });
const { OpenAI } = require("openai");

async function test() {
  console.log("Using API Key:", process.env.GROQ_API_KEY ? "Found" : "Missing");
  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || "dummy_key",
    baseURL: "https://api.groq.com/openai/v1",
  });

  try {
    const res = await openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are a helpful travel assistant. You must respond ONLY with valid JSON." },
        { role: "user", content: "Generate a trip to Ooty for 3 days. Return JSON with 'destination', 'overview', and 'tripHighlights' array." },
      ],
      response_format: { type: "json_object" },
    });
    console.log("Raw Response:");
    console.log(res.choices[0].message.content);
  } catch (e) {
    console.error("GROQ API ERROR:", e);
  }
}
test();
