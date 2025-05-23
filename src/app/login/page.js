'use client';
import styles from "./Login.module.css";
import{ useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { getFirestore, doc, setDoc, serverTimestamp} from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FaEyeSlash, FaRegEye } from "react-icons/fa";

// Login component: handles both login and registration forms
export default function Login() {
  // Login form state
  const [Lemail, setLEmail] = useState('');
  const [Lpass,  setLPass]  = useState('');
  const [error, setError] = useState('');

  // Registration form state
  const [Remail, setREmail] = useState('');
  const [Rpass,  setRPass]  = useState('');
  const [RCpass, setRCPass] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [login, isLogin] = useState(true);
  const router = useRouter();

  // Handle login form submission
  const handleSubmitLogin = async e => {
    e.preventDefault();
    try {
      // Attempt Firebase sign-in
      await signInWithEmailAndPassword(auth, Lemail, Lpass);
      router.push('/'); // Redirect on success
    } catch (e) {
      // Map Firebase error codes to friendly messages
      switch(e.code){
        case 'auth/invalid-credential': showError('Invalid email or password'); break;
        case 'auth/too-many-requests': showError('wait for a while'); break;
        default: showError(e.message); break;
      }
    }
  };
  // Handle registration form submission
  const handleSubmitRegister = async e => {
    e.preventDefault();

    // Validate matching passwords
    if(Rpass !== RCpass){
      setError('Passwords do not match');
      setTimeout(() => {
        setError(false);
      }, 2000);
      return;
    }

    try {
      // Create new Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, Remail, Rpass);
      const user = userCredential.user;
      const db = getFirestore();

      // Initialize user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        userName: 'User',
        balance: 0.00,
        isPremium: false,
        createdAt: serverTimestamp(),
        wallet: {},
      },{ merge: true });

      router.push('/'); // Redirect on success
      
    } catch (e){showError(e.message);};
  };

  const handleConfirmBlur = () => {
    if (!Rpass || !RCpass) return;
    if ( Rpass !== RCpass) {
      setError('Passwords do not match');
    } else {
      setError(false);
    }
  };

  // Display an error message temporarily
  const showError = (msg) => {
    setError(msg);
      setTimeout(() => {
        setError(false);
      }, 2000);
  }

  // Reset form fields and error when toggling between login/register
  useEffect (() => {
    setShowConfirm(false);
    setShowPassword(false);

    if (login) {
      setLEmail('');
      setLPass('');
    } else {
      setREmail('');
      setRPass('');
      setRCPass('');
    }
    
    setError(false);
  }, [login]);
  

  return (
    <>
    <div className={styles.wrapper}>

      {/* Title text slides based on login state */}
      <div className={styles.title_text}>
         <div className={styles.title + ' ' + styles.login_title} style={login ? {} : {transform: "translateX(-100%)"}}>Login Form</div>
         <div className={styles.title + ' ' + styles.register_title} style={login ? {} : {transform: "translateX(-100%)"}}>Sing Up Form</div>
      </div>

      {/* Form container with sliding panels */}
      <div className={styles.form_container}>
        {/* Toggle controls */}
        <div className={styles.slide_controls}>
          <input type = "radio" className={styles.login_btn} id = "login" name="form-btn" checked={login} onChange={()=>isLogin(true)}/>
          <input type = "radio" className={styles.register_btn} id = "register" name="form-btn" checked={!login} onChange={()=>isLogin(false)}/>
          <label className={styles.slide + ' ' + styles.login} htmlFor="login">Login</label>
          <label className={styles.slide + ' ' + styles.register} htmlFor="register">Register</label>
          <div className={styles.slider_tab}></div>
        </div>

        {/* Inner forms */}
        <div className={styles.form_inner}>

          {/* Login Form */}
          <form className={styles.login_form} onSubmit={handleSubmitLogin} style={login ? {} : {transform: "translateX(-100%)"}}>
            <div className={styles.field}>
              <input className={styles.input} type="email"    placeholder="Email" required value={Lemail} onChange={e => setLEmail(e.target.value)} style = {error === 'Invalid email or password' ? {borderColor: 'red'} : {}} />
            </div>
            
            {/* Password input with show/hide toggle */}
            <div className={styles.field}>
              <input className={styles.input} type={showPassword ? "text" : "password"} placeholder="Password" required value={Lpass}  onChange={e => setLPass(e.target.value)} style = {error === 'Invalid email or password' ? {borderColor: 'red'} : {}} />
              <span onClick={() => setShowPassword(prev => !prev)} className={styles.eye_icon}>
                {showPassword ? <FaRegEye/> : <FaEyeSlash/>}
              </span>
            </div>
            <a href="#" className={styles.forget}>Forgot password?</a>
            <button className={styles.submitbtn} type="submit">Login</button>
            <div className={styles.text}>Not a member?<a className={styles.text_link} onClick={() => isLogin(false)}> Register Now</a></div>
          </form>
          
          {/* Registration Form */}
          <form className={styles.register_form} onSubmit={handleSubmitRegister} style={login ? {} : {transform: "translateX(-100%)"}}>
            <div className={styles.field}>
              <input className={styles.input} type="email"    placeholder="Email" required value={Remail} onChange={e => setREmail(e.target.value)} />
            </div>
            <div className={styles.field}>
              <input className={styles.input} type={showPassword ? "text" : "password"} placeholder="Password" required value={Rpass}  onChange={e => setRPass(e.target.value)} style = {error === 'Passwords do not match' ? {borderColor: 'red'} : {}}/>
              <span onClick={() => setShowPassword(prev => !prev)} className={styles.eye_icon}>
                {showPassword ? <FaRegEye/> : <FaEyeSlash/>}
              </span>
            </div>
            <div className={styles.field}>
              <input className={styles.input} type={showConfirm ? "text" : "password"} placeholder="Confirm Password" required value={RCpass}  onChange={e => setRCPass(e.target.value) } style = {error === 'Passwords do not match' ? {borderColor: 'red'} : {}}  onBlur={handleConfirmBlur}/>
              <span onClick={() => setShowConfirm(prev => !prev)} className={styles.eye_icon}>
                {showConfirm ? <FaRegEye/> : <FaEyeSlash/>}
              </span>
            </div>
            <button className={styles.submitbtn} type="submit">Register</button>
            <div className={styles.text}>Have an account?<a className={styles.text_link} onClick={() => isLogin(true)}> Login</a></div>
          </form>
        </div>

        {/* Error message display */}
        {error && <p className={styles.error} >{error}</p>}
      </div>
    </div>
    </>
  );
}