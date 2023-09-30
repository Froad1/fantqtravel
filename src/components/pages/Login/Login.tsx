import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import classes from './Login.module.css'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {

    const firebaseConfig = {
        apiKey: "AIzaSyB1z8SO5WAUdLe_1qu8nyOP5-A8xy4yyfM",
        authDomain: "fantqtravel.firebaseapp.com",
        projectId: "fantqtravel",
        storageBucket: "fantqtravel.appspot.com",
        messagingSenderId: "682251622555",
        appId: "1:682251622555:web:eff3fc46bfe07275c38e3e",
        measurementId: "G-Y1RX9J6CR1"
      };
       
      firebase.initializeApp(firebaseConfig);
    
      const [loggined, setLoggined] = useState(false);
      // const [user, setUser] = useState<any | null>(null);(null);
      const [inputEmail, setInputEmail] = useState('');
      const [inputPassword, setInputPassword] = useState('');
      const [errorMessages, setErrorMessages] = useState('');
      const { t } = useTranslation();
      const navigate = useNavigate();
    
    
      useEffect(() => {
        firebase.auth().onAuthStateChanged(() => {
        //   console.log(user);
        // //   user ? setLoggined(true) : '';
        //   user ? setUser(user) : null; // Здесь используем null, так как user может быть null
        });
      }, []);
    
      useEffect(()=>{
        loggined ? navigate('/') : '';
      },[loggined])
    
      const signInGoogle = () =>{
        const authProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(authProvider)
          .then(() => {
            setLoggined(true);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
          });
      }
    
      const signInEmail = () => {
        const auth = getAuth();
        console.log('email');
        signInWithEmailAndPassword(auth, inputEmail , inputPassword)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            if(user){
              // setUser(user);
              setLoggined(true);
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrorMessages(errorMessage);
            console.log(errorCode, errorMessage);
          });
        };
    return (
        <div className={classes.loginPage_container}>
        <div className={classes.login_container}>
          <div className={classes.login_box}>
            <form onSubmit={(e)=>{e.preventDefault(); signInEmail()}}>
              {/* <NotAvailible/> */}
              <input type="text" placeholder='E-mail' value={inputEmail} onChange={(e)=>{setInputEmail(e.target.value)}} required/>
              <input type="password" placeholder={t('login.password')} value={inputPassword} onChange={(e)=>{setInputPassword(e.target.value)}} required/>
              {errorMessages && (
                <p style={{color:'red'}}>{errorMessages}</p>
              )}
              <button className={classes.button}>{t('login.sign_in')}</button>
            </form>
            <p>{t('login.or_sign_with')}</p>
            <button className={`${classes.button} ${classes.signInGoogle}`} onClick={signInGoogle}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">    <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z" /></svg>
              Google
            </button>
            <p>{t('login.dont_have_account')} <Link to='/register'>{t('login.sign_up')}</Link></p>
          </div>
        </div>
      </div>
    );
};

export default Login;