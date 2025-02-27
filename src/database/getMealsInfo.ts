import { firestore } from ".";
export const getMealsInfo = async () => {
  const today = new Date().toISOString().split("T")[0];
  const reportDocRef = firestore.collection("reports").doc(today);

  const data = (await reportDocRef.get())?.data();

  return data || null;
};
