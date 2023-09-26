import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import classes from './Likes.module.css'
import ImageCard from '../../UI/ImageCard/ImageCard';
import ReactLoading from 'react-loading';
import axios from 'axios';

interface Image {
    id: string;
    folder: string;
    thumbnailLink: string;
  }


const Likes = () => {
    const [loggined, setLoggined] = useState(false);
    const [user, setUser] = useState<any | null>(null);(null);
    const [imageArray, setImageArray] = useState<Image[]>([]);
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
        firebase.auth().onAuthStateChanged((user) =>{
            if(user){
                setUser(user);
                setLoggined(true);
            }
            else navigate('/login')
        })
    },[user])

    useEffect(()=>{
        if(loggined){
            fetchImage();
        }
        else console.log('no login');
        
    },[loggined])

    const fetchImage = async () =>{
        const firestore = firebase.firestore();
        var db = firestore.collection('images').doc('userLikes').collection(user.uid);
        db.get()
        .then(async(e)=>{
            const promise = e.docs.map(async (doc) => {                
                const response = await axios.get(`https://www.googleapis.com/drive/v3/files/${doc.id}`, {
                    params: {
                      key: 'AIzaSyAE6LFdYnhSIHffI7_tw7pi1aIf2WK7sEE',
                      fields: 'id ,webContentLink, imageMediaMetadata, thumbnailLink, parents, imageMediaMetadata',
                    },
                });
                return {
                    folder: doc.data().folder,
                    id: response.data.id,
                    thumbnailLink: response.data.thumbnailLink.replace("s220", "s800"),
                }
            });
            const data = await Promise.all(promise);

            console.log(data);
            setImageArray(data);
            setLoading(false);
        })
    }

    return (
        <div className={classes.likes_page_container}>
            <h3>Мої лайкнуті зображення:</h3>
            {loading ? (
                <div className={classes.loading}>
                    <ReactLoading type='bubbles' color='#E2E2E2' width='30%'/>
                </div>
            ):(
                <div className={classes.likes_container}>
                    {imageArray.map((image)=>(
                        <ImageCard key={image.id} src={image.thumbnailLink} id={image.id} folder={image.folder}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Likes;