import { initializeApp, ServiceAccount, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../fbsettings.json";

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const firestore = getFirestore();
