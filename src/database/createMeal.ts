import { Meal } from "../types";
import { firestore } from "./index";

export const createMeal = async (meal: Meal) => {
  const reportDocRef = firestore.collection("reports").doc(meal.date);

  const docSnapshot = await reportDocRef.get();
  const data = docSnapshot.exists ? docSnapshot.data() : {};

  const updatedMeals = (data?.meals || []).concat(meal);
  await reportDocRef.set({ meals: updatedMeals }, { merge: true });
};
