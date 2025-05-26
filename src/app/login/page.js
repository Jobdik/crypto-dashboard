'use client';
import styles from "./Login.module.css";
import{ useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth} from '@/app/hooks/useAuth';

import { FaEyeSlash, FaRegEye } from "react-icons/fa";

// Login component: handles both login and registration forms
export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { user, loading, login, register } = useAuth(setError);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // only for registration
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isLogin, setIsLogin] = useState(true);

  // Redirect if logged in 
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);


  // Reset form fields and error when toggling between login/register
  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowConfirm(false);
    setShowPassword(false);
    setError(false);
  }, [isLogin]);

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    // Validate matching passwords
    if(!isLogin && password !== confirmPassword) return showError('Passwords do not match');

    if(isLogin){
      await login(email, password);
    } else {
      await register(email, password);
    }

    // Map Firebase error codes to friendly messages
    switch (error) {
        case 'auth/invalid-credential': showError('Invalid email or password'); break;
        case 'auth/too-many-requests': showError('wait for a while'); break;
        case 'auth/user-disabled': showError('This account has been disabled'); break;
        case 'auth/email-already-in-use': showError('This email is already registered'); break;
        case 'auth/network-request-failed': showError('Network error, please check your connection'); break;
        default: showError(e.message || 'An unexpected error occurred'); break;
      }
  };

  // Validate matching passwords
  const handleConfirmBlur = () => {
    if (!password || !confirmPassword) return;
    if ( password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError(false);
    }
  };

  // Clear error after 2 seconds
  useEffect(() => {
    if (error == null) return;
    const timer = setTimeout(() => {
      setError(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [error]);

  // Display an error message temporarily
  const showError = (msg) => {
    setError(msg);
  }


  

  return (
    <>
    <div className={styles.wrapper}>

      {/* Title text slides based on login state */}
      <div className={styles.title_text}>
         <div className={styles.title + ' ' + styles.login_title} style={isLogin ? {} : {transform: "translateX(-100%)"}}>Login Form</div>
         <div className={styles.title + ' ' + styles.register_title} style={isLogin ? {} : {transform: "translateX(-100%)"}}>Sing Up Form</div>
      </div>

      {/* Form container with sliding panels */}
      <div className={styles.form_container}>
        {/* Toggle controls */}
        <div className={styles.slide_controls}>
          <input type = "radio" className={styles.login_btn} id = "login" name="form-btn" checked={isLogin} onChange={()=>setIsLogin(true)}/>
          <input type = "radio" className={styles.register_btn} id = "register" name="form-btn" checked={!isLogin} onChange={()=>setIsLogin(false)}/>
          <label className={styles.slide + ' ' + styles.login} htmlFor="login">Login</label>
          <label className={styles.slide + ' ' + styles.register} htmlFor="register">Register</label>
          <div className={styles.slider_tab}></div>
        </div>

        {/* Inner forms */}
        <div className={styles.form_inner}>

          {/* Login Form */}
          <form className={styles.login_form} onSubmit={handleSubmit} style={isLogin ? {} : {transform: "translateX(-100%)"}}>
            <div className={styles.field}>
              <input className={styles.input} type="email"    placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} style = {error === 'Invalid email or password' ? {borderColor: 'red'} : {}} />
            </div>
            
            {/* Password input with show/hide toggle */}
            <div className={styles.field}>
              <input className={styles.input} type={showPassword ? "text" : "password"} placeholder="Password" required value={password}  onChange={e => setPassword(e.target.value)} style = {error === 'Invalid email or password' ? {borderColor: 'red'} : {}} />
              <span onClick={() => setShowPassword(prev => !prev)} className={styles.eye_icon}>
                {showPassword ? <FaRegEye/> : <FaEyeSlash/>}
              </span>
            </div>
            <a href="#" className={styles.forget}>Forgot password?</a>
            <button className={styles.submitbtn} type="submit">Login</button>
            <div className={styles.text}>Not a member?<a className={styles.text_link} onClick={() => setIsLogin(false)}> Register Now</a></div>
          </form>
          
          {/* Registration Form */}
          <form className={styles.register_form} onSubmit={handleSubmit} style={isLogin ? {} : {transform: "translateX(-100%)"}}>
            <div className={styles.field}>
              <input className={styles.input} type="email"    placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className={styles.field}>
              <input className={styles.input} type={showPassword ? "text" : "password"} placeholder="Password" required value={password}  onChange={e => setPassword(e.target.value)} style = {error === 'Passwords do not match' ? {borderColor: 'red'} : {}}/>
              <span onClick={() => setShowPassword(prev => !prev)} className={styles.eye_icon}>
                {showPassword ? <FaRegEye/> : <FaEyeSlash/>}
              </span>
            </div>
            <div className={styles.field}>
              <input className={styles.input} type={showConfirm ? "text" : "password"} placeholder="Confirm Password" required value={confirmPassword}  onChange={e => setConfirmPassword(e.target.value) } style = {error === 'Passwords do not match' ? {borderColor: 'red'} : {}}  onBlur={handleConfirmBlur}/>
              <span onClick={() => setShowConfirm(prev => !prev)} className={styles.eye_icon}>
                {showConfirm ? <FaRegEye/> : <FaEyeSlash/>}
              </span>
            </div>
            <button className={styles.submitbtn} type="submit">Register</button>
            <div className={styles.text}>Have an account?<a className={styles.text_link} onClick={() => setIsLogin(true)}> Login</a></div>
          </form>
        </div>

        {/* Error message display */}
        {error && <p className={styles.error} >{error}</p>}
      </div>
    </div>
    </>
  );
}