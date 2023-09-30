import {useTranslation } from 'react-i18next';

import { useEffect, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import classes from './Account.module.css'
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const {t} = useTranslation();
    const [user, setUser] = useState<any | null>(null);(null);
    const navigate = useNavigate();

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

    useEffect(()=>{
        firebase.auth().onAuthStateChanged((user) =>{
            if(user){
               setUser(user)
            }
        })
    },[user])

    const signout = () =>{
        if(user){
            firebase.auth().signOut();
        }
    }

    const back = () =>{
        navigate(-1);
    }

    return (
        <div className={classes.account_page_container}>
            <svg onClick={back} className={classes.back_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            <div className={classes.settings_container}>
                <button onClick={signout}>{t('account.signout')}</button>
            </div>
        </div>
    );
};

export default Account;