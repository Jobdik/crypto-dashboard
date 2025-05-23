import { getFirestore, doc, getDoc } from "firebase/firestore";

export const fetchUserData = async (uid) => {
  // Initialize Firestore instance
  const db = getFirestore();

  // Guard against missing UID
  if (!uid) return null;
  try{
    // Reference the 'users' collection document for this UID
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Document exists: return the stored data
      return docSnap.data();
    } else {
      // Document does not exist: warn and return null
      console.warn("No such user document!");
      return null;
    }
  }
  catch(error){
    // Log any errors during fetch
    console.error('fetchUserData: Error fetching user data', error);
    return null;
  }

};