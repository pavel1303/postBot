import { GeminiSuccessResponse } from "../types";

export const getGeminiResponseText = (data: GeminiSuccessResponse) => {
  return data.choices[0]?.message.content || null;
};
