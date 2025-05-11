'use client';
import Image from "next/image";
import styles from "./page.module.css";

import { useContext, useEffect } from 'react';
import { useRouter }          from 'next/navigation';
import { AuthContext }        from '../context/AuthContext';
import DashboardPage from "./pages/DashboardPage";

export default function Home() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return <DashboardPage />;
}
