import { generatebatch1, generatebatch2, generatebatch3 } from "../lib/openai/index";
import { config } from "dotenv";

config({ path: "../.env" });

async function run() {
  try {
    console.log("Starting batch 1...");
    const b1 = await generatebatch1("3 days trip to Thailand");
    console.log("Batch 1:", b1?.choices[0]?.message?.content);

    console.log("Starting batch 2...");
    const b2 = await generatebatch2({
      userPrompt: "3 days trip to Thailand",
    });
    console.log("Batch 2:", b2?.choices[0]?.message?.content);

    console.log("Starting batch 3...");
    const b3 = await generatebatch3({
      userPrompt: "3 days trip to Thailand",
    });
    console.log("Batch 3:", b3?.choices[0]?.message?.content);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
