import { getGeminiResponseText } from "../helpers/getResponseText";
import { GeminiSuccessResponse, Message } from "../types/index";

export const geminiFlashRequest = async (messages: Message[]) => {
  try {
    const response = await fetch("https://api.vsegpt.ru/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VSEGPT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "vis-google/gemini-flash-1.5",
        messages,
      }),
    });

    const data = (await response.json()) as GeminiSuccessResponse;
    console.log(data);
    return getGeminiResponseText(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
