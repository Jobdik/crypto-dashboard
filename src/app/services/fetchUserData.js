import { getFirestore, doc, getDoc } from "firebase/firestore";

export const fetchUserData = async (uid) => {
  const db = getFirestore();

  if (!uid) return null;

  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.warn("No such user document!");
    return null;
  }
};