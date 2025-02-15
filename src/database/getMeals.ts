import { firestore } from ".";
export const getMeals = async () => {
  const today = new Date().toISOString().split("T")[0];
  const reportDocRef = firestore.collection("reports").doc(today);

  const data = (await reportDocRef.get())?.data();

  return data && data.meals ? data.meals : [];
};
