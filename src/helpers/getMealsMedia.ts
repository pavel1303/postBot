import { getMealsInfo } from "../database/getMealsInfo";
import { geminiFlashTextRequest } from "../gpt-api/geminiTextRequest";
import { createPromptForReport } from "../prompt-generate/createPromtForReport";
import { Meal } from "../types";

export const getMealsMedia = async () => {
  const mealsInfo = await getMealsInfo();
  const promtMessages = createPromptForReport(mealsInfo?.meals);
  const description = await geminiFlashTextRequest(promtMessages);
  const allMealsPhoto = mealsInfo?.meals.reduce(
    (acc: string[], meal: Meal) => acc.concat(meal.photoIds),
    []
  );

  const media = allMealsPhoto.map((id: string) => ({
    type: "photo",
    media: id,
    caption: "",
  }));
  return {
    description,
    photos: media,
  };
};
