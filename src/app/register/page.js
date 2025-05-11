'use client';
import {useState} from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { useRouter } from 'next/navigation';

export default function Register() {
    const [email, setEmail] = useState('');
    const [pass,  setPass]  = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
  
    const handleSubmit = async e => {
      e.preventDefault();
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
        router.push('/');
      } catch (e) {
        setError(e.message);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input type="email"    placeholder="Email"    value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={pass}  onChange={e => setPass(e.target.value)}  />
        <button type="submit">Sign Up</button>
        {error && <p>{error}</p>}
      </form>
    );
  }