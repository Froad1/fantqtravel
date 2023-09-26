import { useEffect, useState } from 'react';
import classes from './MostLikedImages.module.css'
import ImageCard from '../../UI/ImageCard/ImageCard';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import axios from 'axios';

interface Image {
    id: string;
    folder: string;
    thumbnailLink: string;
  }
  

const MostLikedImages = () => {
    const [imageArray, setImageArray] = useState<Image[]>([]);

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
        fetchImage();
    },[])

    const fetchImage = async () =>{
        const firestore = firebase.firestore();
        // const db = firestore.collection('images').doc('mostliked');
        // const e = await db.get();
        // const fileArray = e.data()?.files;
        // console.log(fileArray);
        
        // setImageArray(fileArray);

        var db = firestore.collection('images').doc('mostliked').collection('files');
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
        })
    }
    
    return (
        <div className={classes.most_liked_photo_container}>
            {imageArray.map((image)=>(
                <ImageCard key={image.id} src={image.thumbnailLink} id={image.id} folder={image.folder}/>
            ))}
        </div>
    );
};

export default MostLikedImages;