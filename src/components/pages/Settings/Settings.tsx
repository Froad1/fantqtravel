import { useEffect, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import classes from './Settings.module.css'

const Settings = () => {
    const [user, setUser] = useState<any | null>(null);(null);

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

    return (
        <div className={classes.setting_page_container}>
            <button onClick={signout}>Вийти з аккаунта</button>
        </div>
    );
};

export default Settings;