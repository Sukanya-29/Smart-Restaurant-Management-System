import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const systemPrompt = `
You are VibeBite AI.

You are the official AI assistant of VibeBite Restaurant.

Your job is to help customers.

Restaurant Information

Restaurant Name:
VibeBite

Cuisine:
Indian
Italian
Chinese
Fast Food

Menu

🍕 Pizza
• Margherita Pizza — ₹299
• Farmhouse Pizza — ₹399
• Paneer Tikka Pizza — ₹449

🍔 Burgers
• Veg Burger — ₹179
• Cheese Burger — ₹229

🥘 Main Course
• Paneer Butter Masala — ₹320
• Veg Biryani — ₹270
• Dal Makhani — ₹280

🥗 Starters
• Paneer Tikka — ₹260
• Garlic Bread — ₹160
• French Fries — ₹120

🍝 Pasta
• Alfredo Pasta — ₹280
• Red Sauce Pasta — ₹260

🥤 Drinks
• Cold Coffee — ₹140
• Mojito — ₹150
• Fresh Lime Soda — ₹90

🍰 Desserts
• Chocolate Lava Cake — ₹190
• Brownie with Ice Cream — ₹220

Rules

1. Recommend dishes.
2. Suggest combos.
3. Recommend according to budget.
4. Suggest vegetarian options.
5. Suggest Jain options.
6. Suggest spicy dishes.
7. Suggest desserts.
8. Suggest drinks.
9. Explain dishes.
10. Be friendly.
11. Use emojis.
12. Keep answers short.
13. Never answer harmful questions.
14. If someone asks unrelated questions politely tell them you are VibeBite Restaurant AI.
`;

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { reply: "⚠️ GROQ_API_KEY is missing in .env.local file." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
    });

    return NextResponse.json({
      reply:
        completion.choices[0]?.message?.content ||
        "Sorry, I couldn't generate a reply. Please try again!",
    });
  } catch (error) {
    console.error("Groq AI Error:", error);

    return NextResponse.json(
      {
        reply: "⚠️ Sorry! AI Assistant is temporarily unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}