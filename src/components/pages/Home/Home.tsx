import { Link, useNavigate } from 'react-router-dom';
import MostLikedImages from '../../modules/MostLikedImages/MostLikedImages';
import classes from './Home.module.css'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useEffect, useState } from 'react';

const Home = () => {
    const [loggined, setLoggined] = useState(false);
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
            user ? setLoggined(true): '';
            user ? setUser(user): '';
            console.log(user);
            
        })
    },[user])

    const changeTheme = ()=>{
        var root = document.documentElement;

        if (root.getAttribute('data-color-scheme') === 'dark') {
          root.setAttribute('data-color-scheme', 'light');
        } else {
          root.setAttribute('data-color-scheme', 'dark');
        }
    }

    const loginNavigate = () =>{
        navigate('/login')
    }

    return (
        <div className={classes.home_container}>
            <header className={classes.header}>
                <Link to='/all' className={classes.all_photo_button}>
                    <svg className={classes.all_photo_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/></svg>
                </Link>
                <div className={classes.account_button}>
                    {user ? (
                        <div>
                            {user && user.photoURL ? (
                                <img src={user.photoURL} className={classes.user} />
                            ) : (
                                <svg className={classes.account_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" /></svg>
                            )}
                        </div>
                    ) : (
                        <svg className={classes.account_icon} onClick={loginNavigate} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" /></svg>
                    )}
                    {/* <svg className={classes.account_icon} onClick={changeTheme} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg> */}
                </div>
            </header>
            <div className={classes.about_site}>
                <p className={classes.text_one}>На цьому сайті зібрані всі фото з наших <span className={classes.text_two}>поїздок</span></p>
            </div>
            {/* <div className={classes.search_container}>
                <i className={classes.search_icon}><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg></i>
                <input placeholder='Пошук' type="search" className={classes.search_input}/>
                <div className={classes.filter}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/></svg>
                </div>
            </div> */}
            <p>Найбільш уподобані:</p>
            <MostLikedImages/>
        </div>
    );
};

export default Home;