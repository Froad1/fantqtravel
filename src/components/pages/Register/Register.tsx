import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import classes from './Register.module.css'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [loggined, setLoggined] = useState(false);
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState('');
    const {t} = useTranslation();
    const navigate = useNavigate();


    useEffect(()=>{
        firebase.auth().onAuthStateChanged((user) =>{
            if(user){
                setLoggined(true);
            }
        })
    },[])

    useEffect(()=>{
        loggined ? navigate('/') : '';
    },[loggined])

    const signUpEmail = (e:any) => {
        e.preventDefault()
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                if(user){
                    setLoggined(true);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                setErrorMessages(errorCode);
                // ..
            });
    }

    const signUpGoogle = () =>{
        const authProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(authProvider)
          .then(() => {
            setLoggined(true);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrorMessages(errorCode);
            console.log(errorCode, errorMessage)
          });
    }


    return (
        <div className={classes.register_page_container}>
            <div className={classes.register_container}>
                <div className={classes.register_box}>
                    <form onSubmit={(e)=>{signUpEmail(e)}}>
                        <input type="email" placeholder='E-mail' value={inputEmail} onChange={(e)=>{setInputEmail(e.target.value)}} required/>
                        <input type="password" placeholder={t('register.password')} value={inputPassword} onChange={(e)=>{setInputPassword(e.target.value)}} required/>
                        <button>{t('register.sign_up')}</button>
                        {errorMessages && (
                            <p style={{color:'red'}}>{errorMessages}</p>
                        )}
                    </form>
                    <p>{t('register.or_sign_with')}</p>
                    <button className={classes.signInGoogle} onClick={signUpGoogle}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">    <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z" /></svg>
                        Google
                    </button>
                    <p>{t('register.have_account')} <Link to='/login'>{t('register.sign_in')}</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;