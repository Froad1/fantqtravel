import { Link, useNavigate } from 'react-router-dom';
import classes from './Lists.module.css'
import ReactLoading from 'react-loading';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Service from '../../API/Servise';

const Lists = () => {
    const [foldersArray, setFoldersArray] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
        getIdFolders();
    },[])

    const getIdFolders = async() =>{
        const firestore = firebase.firestore();
        const db = firestore.collection('images').doc('folderArray');
        const e = await db.get();
        const foldersId = e.data()?.folders;
        getNameFolders(foldersId);
    }

    const getNameFolders = async (foldersId: Array<string>) => {
        const apiKey = 'AIzaSyAE6LFdYnhSIHffI7_tw7pi1aIf2WK7sEE';
        const folderRequests = foldersId.map(async (e) => {
            const apiUrl = `https://www.googleapis.com/drive/v3/files/${e}?fields=name&key=${apiKey}`;
            const response = await axios.get(apiUrl);
            const responseFiles = await Service.get(`https://www.googleapis.com/drive/v3/files?q="${e}"+in+parents&fields=*&key=${apiKey}`);
    
            if (response.status === 200 || responseFiles?.status === 200) {
                const folderName = response.data.name;
                const firstImage = responseFiles?.data.files[0].thumbnailLink.slice(0,-3) + '500';
                const listLength = responseFiles?.data.files?.length || 0;
                console.log(firstImage);
                
                return {
                    id: e,
                    name: folderName,
                    firstImage: firstImage,
                    listLength: listLength,
                };
            } else {
                console.error('Помилка отримання назви папки');
                return null;
            }
        });
    
        const resolvedFolders = await Promise.all(folderRequests);
        const filteredFolders = resolvedFolders.filter((folder) => folder !== null);
    
        console.log(filteredFolders);
        setFoldersArray(filteredFolders);
        setLoading(false);
    }

    const back = () =>{
        navigate(-1);
    }

    return (
        <div className={classes.lists_page_container}>
            <svg onClick={back} className={classes.back_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            {loading ? (
                <div className={classes.loading}>
                    <ReactLoading type='bubbles' color='#E2E2E2' width='30%'/>
                </div>
            ):(    
                <div className={classes.lists_container}>
                    {foldersArray.map((e)=>(
                        <Link to={`/list/${e.id}`} key={e.id} className={classes.list}>
                            <img src={e.firstImage} alt="" />
                            <div className={classes.list_description}>
                                <p className={classes.list_title}>{e.name}</p>
                                <p className={classes.list_length}>{e.listLength} фотографій</p>
                            </div>
                        </Link>
                    ))

                    }
                </div>
            )}
        </div>
    );
};

export default Lists;