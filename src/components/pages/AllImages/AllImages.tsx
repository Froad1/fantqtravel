import '../../../assets/locales/config';
import {useTranslation } from 'react-i18next';

import { useEffect, useState } from 'react';
import Service from '../../API/Servise';
import classes from './AllImages.module.css'
import ImageCard from '../../UI/ImageCard/ImageCard';
import ReactLoading from 'react-loading';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

interface Image{
  name: string, 
  id: string, 
  parents: Array<any>, 
  thumbnailLink: string 
}

const AllImages = () => {
  const {t} = useTranslation();
    const [imageArray, setImageArray] = useState<any[]>([]);
    const [showUp, setShowUp] = useState(false);
    const [loading, setLoading] = useState(true);

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

    const fetchImage = async () => {
      try {
        const firestore = firebase.firestore();
        const db = firestore.collection('images').doc('folderArray');
        const e = await db.get();
        const folderArray = e.data()?.folders;
        
        if (folderArray) {
          const imagesArray: any[] = [];
    
          for (const e of folderArray) {
            const imagesStart = await Service.get(`https://www.googleapis.com/drive/v3/files?q="${e}"+in+parents&fields=*&key=AIzaSyAE6LFdYnhSIHffI7_tw7pi1aIf2WK7sEE`);
            imagesArray.push(imagesStart?.data.files);
            var imagesNext = imagesStart;
            while(imagesNext?.data.nextPageToken){
              const images = await Service.get(`https://www.googleapis.com/drive/v3/files?q="${e}"+in+parents&fields=*&key=AIzaSyAE6LFdYnhSIHffI7_tw7pi1aIf2WK7sEE&pageToken=${imagesNext?.data.nextPageToken}`);
              imagesNext = images;
              imagesArray.push(images?.data.files);
          }
            // imagesArray.push(images?.data.files);
          }
    
          setImageArray(imagesArray);
          setLoading(false);
        }
      } catch (error) {
        console.error('Помилка отримання даних:', error);
      }
    };
    

    const handleScroll = () => {
        if (window.scrollY > 500) {
          setShowUp(true);
        } else {
          setShowUp(false);
        }
      };
    
      useEffect(() => {
        // Додаємо обробник прокрутки при монтуванні компонента
        window.addEventListener('scroll', handleScroll);
    
        // При демонтажі компонента видаляємо обробник прокрутки
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
    
      // Функція для перемотування на початок сторінки
      const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

    return (
        <div className={classes.all_photo_container}>
            <p>{t('allphotos')}</p>
            {loading ? (
              <div className={classes.loading}>
                <ReactLoading type='bubbles' color='#E2E2E2' width='30%'/>
              </div>
            ):(
              <div className={classes.all_images_container}>
                {imageArray.map((e, index) => (
                  <div key={index}>
                    {/* {index} */}
                    {e.map((image: Image) => (
                      <ImageCard src={image.thumbnailLink.slice(0,-3) + '800'} folder={image.parents[0]} key={image.id} id={image.id}/>
                      // <div key={`${index}-${innerIndex}`}>{image.name}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div onClick={scrollToTop} className={classes.scroll_up_button} style={showUp ? {bottom: '7rem'}: {}}>
                <svg className={classes.scroll_up_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>
            </div>
        </div>
    );
};

export default AllImages;