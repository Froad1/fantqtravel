import { useLocation, useNavigate } from "react-router-dom";
import classes from './ImageDetail.module.css';
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactLoading from 'react-loading';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

interface ImageData {
    imageMediaMetadata: {
      exposureTime: string;
      aperture: number;
      isoSpeed: number;
    };
    thumbnailLink: string;
  }

const ImageDetail = () => {
    const [user, setUser] = useState<any | null>(null);(null);
    const [id, setId] = useState('');
    const [folder, setFolder] = useState('');
    const [city , setCity] = useState('');
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [exposure, setExposure] = useState('');
    const [liked, setLiked] = useState(false);
    const [countLikes, setCountLikes] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

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
            }
        })
    },[user])

    useEffect(()=>{
        setId(searchParams.get('id') || '');
        setFolder(searchParams.get('folder') || '');
    },[])

    useEffect(()=>{
        if(folder){
            checkNameFolder();
        }
    },[folder])

    useEffect(()=>{
        if(id){
            setLoading(false);
            getImageData();
            getCountLikes();
        }
    },[id])

    useEffect(()=>{
        if(id && user){
            checkLikeStatus();            
        }
    },[id, user])


    const back = () =>{
        navigate(-1);
    }

    const checkNameFolder = async () =>{
        const apiKey = 'AIzaSyAE6LFdYnhSIHffI7_tw7pi1aIf2WK7sEE';
        const apiUrl = `https://www.googleapis.com/drive/v3/files/${folder}?fields=name&key=${apiKey}`;
        
        const response = await axios.get(apiUrl);
        
        if (response.status === 200) {
          const folderName = response.data.name;
          if(folderName != 'mostliked'){
            setCity(folderName)
          }
          else setCity('Відень');
          console.log(folderName);
          
        } else {
          console.error('Помилка отримання назви папки');
          return null;
        }
    };

    const elementRef = useRef<HTMLDivElement | null>(null);

    const followCursor = (e: React.TouchEvent) => {

        if (elementRef.current && e.targetTouches[0].clientY >= window.innerHeight - (window.innerHeight * 0.47) && e.targetTouches[0].clientY <= window.innerHeight - (window.innerHeight * 0.15)) {            
            elementRef.current.style.top = e.targetTouches[0].clientY + 'px';
        }
        else if(elementRef.current &&e.targetTouches[0].clientY < window.innerHeight - (window.innerHeight * 0.47) && parseFloat(elementRef.current.style.top) != parseFloat((window.innerHeight - (window.innerHeight * 0.47)).toFixed(2))){
            elementRef.current.style.top = window.innerHeight - (window.innerHeight * 0.47)+ 'px';
            console.log(parseFloat(elementRef.current.style.top), window.innerHeight - (window.innerHeight * 0.47) );
            
        }

    }

    const followCursorStart = (e: React.TouchEvent) =>{        
        if(elementRef.current && e.targetTouches[0].clientY > window.innerHeight - (window.innerHeight * 0.47) && e.targetTouches[0].clientY < window.innerHeight - (window.innerHeight * 0.41)){
            elementRef.current.style.top = e.targetTouches[0].clientY + 'px';
        }
    }

    const getImageData = async() =>{

        const response = await axios.get(`https://www.googleapis.com/drive/v3/files/${id}`, {
            params: {
              key: 'AIzaSyAE6LFdYnhSIHffI7_tw7pi1aIf2WK7sEE',
              fields: 'id ,webContentLink, imageMediaMetadata, thumbnailLink, parents, imageMediaMetadata',
            },
        });
        console.log(response);
        setImageData(response.data);
        
        function gcd(a: number, b: number): number {
            return (b) ? gcd(b, a % b) : a;
        }
        
        var decimalToFraction = function (_decimal: any) {
            var top		= _decimal.toString().replace(/\d+[.]/, '');
            var bottom	= Math.pow(10, top.length);
            if (_decimal > 1) {
                top	= +top + Math.floor(_decimal) * bottom;
            }
            var x = gcd(top, bottom);
            return (top / x) + '/' + (bottom / x)
            ;
        };
        setExposure(decimalToFraction(response.data.imageMediaMetadata.exposureTime));
        
    }

    const checkLikeStatus = () =>{
            const firestore = firebase.firestore();
            var db = firestore.collection('images').doc('userLikes').collection(user.uid).doc(id);

            db.get()
            .then((doc) => {
                if (doc.exists) {
                    setLiked(true);
                }
            })
            .catch((error) => {
            console.error('Помилка при зверненні до бази даних: ', error);
            });             
    }

    const getCountLikes = () =>{
        const firestore = firebase.firestore();
        var db = firestore.collection('images').doc('mostliked').collection('files').doc(id);

        db.get()
        .then((doc)=>{
            setCountLikes(doc.data()?.likes)
        })

    }

    const addLike = () =>{
        if(user){
            const firestore = firebase.firestore();
            var db = firestore.collection('images').doc('userLikes').collection(user.uid).doc(id);
            db.set({
                folder: folder,
                thumbnailLink: imageData?.thumbnailLink.replace(/s220$/, 's800'),
            })
            .then(()=>{
                setLiked(true);
                setCountLikes(countLikes + 1);
            })

            var dbMost = firestore.collection('images').doc('mostliked').collection('files').doc(id)

            dbMost.get()
            .then((doc)=>{
                if(doc.exists){
                    var likes = doc.data()?.likes
                    dbMost.update({likes: likes + 1})
                    
                }
                else{
                    dbMost.set({
                        folder: folder,
                        likes: 1,
                        thumbnailLink: imageData?.thumbnailLink.replace(/s220$/, 's800'),
                    })
                }
            })
        }
        else navigate('/login')
    }
    const deleteLike = () =>{
        if(user){
            const firestore = firebase.firestore();
            var db = firestore.collection('images').doc('userLikes').collection(user.uid).doc(id);
            db.delete()
            .then(()=>{
                setLiked(false);
                setCountLikes(countLikes - 1);
            })

            var dbMost = firestore.collection('images').doc('mostliked').collection('files').doc(id)

            dbMost.get()
            .then((doc)=>{
                if(doc.exists){
                    var likes = doc.data()?.likes
                    if(likes == 1){
                        dbMost.delete();
                    }
                    else{
                        dbMost.update({likes: likes - 1});
                    }
                    
                }
            })
        }
        else navigate('/login')
    }
        

    return (
        <div className={classes.image_detail_container}>
            <svg onClick={back} className={classes.back_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            <div className={classes.image_container}>
                {loading ?(
                    <div className={classes.loading}>
                        <ReactLoading type='bubbles' color='#E2E2E2' width='30%'/>
                    </div>
                ):(    
                    <img className={classes.image} src={`https://drive.google.com/uc?id=${id}&export=download`} alt="" />
                )}
            </div>
            <div ref={elementRef} className={classes.image_detail} onTouchStart={followCursorStart} onTouchMove={followCursor}>
                <div className={classes.head}>
                    <div className={classes.dragable_icon_container}>
                        <div className={classes.dragable_icon}></div>
                    </div>
                    <div className={classes.head_data}>
                        <h2>{city}</h2>
                        <div className={classes.like_button}>
                            {!liked ? (
                                <>
                                    <svg onClick={addLike} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                                    <div>{countLikes != 0 ? countLikes : '0'}</div>
                                </>
                                
                            ):(
                                <>
                                    <svg onClick={deleteLike} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>
                                    <div>{countLikes != 0 ? countLikes : '0'}</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className={classes.description}>
                    <div className={classes.exposure}>
                        <p>Витримка:</p>
                        <p>{exposure}</p>
                    </div>
                    <div className={classes.aperture}>
                        <p>Діафрагма:</p>
                        <p>{imageData?.imageMediaMetadata.aperture}</p>
                    </div>
                    <div className={classes.iso}>
                        <p>ISO:</p>
                        <p>{imageData?.imageMediaMetadata.isoSpeed}</p>
                    </div>
                </div>
                <a href={`https://drive.google.com/uc?id=${id}&export=download`} target="_blank">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>
                        Завантажити
                    </button>
                </a>
            </div>
        </div>
    );
};

export default ImageDetail;