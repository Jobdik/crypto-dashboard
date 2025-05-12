'use client';
import Image from "next/image";
import styles from "./page.module.css";

import { useContext, useEffect } from 'react';
import { useRouter }          from 'next/navigation';
import { AuthContext }        from '../context/AuthContext';

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
  if (!loading) {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }
}, [loading, user, router]);

  return <div>Loading...</div>;
}
