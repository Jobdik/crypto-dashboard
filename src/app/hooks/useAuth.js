import { useState, useEffect, useCallback } from "react";
import { auth } from "@/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";


export function useAuth(onError) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        
        // Attempt Firebase sign-in
        try{
            await signInWithEmailAndPassword(auth, email, password); 
        } catch(e){
            onError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (email, password) => {
        setLoading(true);
        
        try{
            // Create new Firebase auth user
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            
            // Initialize user document in Firestore
            await setDoc(doc(db, "users", cred.user.uid), {
                userName: 'User',
                balance: 0.00,
                isPremium: false,
                createdAt: serverTimestamp(),
                wallet: {},
                favorite: {},
            },{ merge: true });


        } catch(e){
            onError(e.message);
        } finally {
            setLoading(false);
        }
    }, [db]);

    const logout = useCallback(async () => {
        setError(null);
        try{
            await auth.signOut();
        } catch(e){
            onError(e.message);
        }
    }, []);

   return {
    user,
    loading,
    login,
    register,
    logout,
  };
}