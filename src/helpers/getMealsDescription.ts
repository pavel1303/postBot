import { getMeals } from "../database/getMeals";
import { geminiFlashTextRequest } from "../gpt-api/geminiTextRequest";
import { createPromptForReport } from "../prompt-generate/createPromtForReport";

export const getMealsDescription = async () => {
  const meals = await getMeals();
  const promtMessages = createPromptForReport(meals);
  const description = await geminiFlashTextRequest(promtMessages);

  return description;
};
