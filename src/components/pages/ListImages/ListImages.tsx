import { useNavigate, useParams } from 'react-router-dom';
import classes from './ListImages.module.css'
import { useEffect, useState } from 'react';
import Service from '../../API/Servise';
import ImageCard from '../../UI/ImageCard/ImageCard';
import ReactLoading from 'react-loading';

const ListImages = () => {
    const [imageArray, setImageArray] = useState<any[]>([]);
    const [showUp, setShowUp] = useState(false);
    const [currentPages, setCurrentPages] = useState(0);
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(()=>{
        fetchImage();
    },[])

    const fetchImage = async () => {
        try{
            var imageArray:any[] = [];
            const imagesStart = await Service.get(`https://www.googleapis.com/drive/v3/files?q="${id}"+in+parents&fields=*&key=AIzaSyAE6LFdYnhSIHffI7_tw7pi1aIf2WK7sEE`);
            imageArray.push(imagesStart?.data.files);
            var imagesNext = imagesStart;
            while(imagesNext?.data.nextPageToken){
                const images = await Service.get(`https://www.googleapis.com/drive/v3/files?q="${id}"+in+parents&fields=*&key=AIzaSyAE6LFdYnhSIHffI7_tw7pi1aIf2WK7sEE&pageToken=${imagesNext?.data.nextPageToken}`);
                imagesNext = images;
                imageArray.push(images?.data.files);
            }
            setImageArray(imageArray);
            setLoading(false);
            // console.log(imageArray[currentPages]);

            var pages = [];

            for (let i = 1; i <= imageArray.length; i++) {
              pages.push(<div key={i} className={classes.page_buttons} onClick={()=>{changePage(i)}} style={currentPages + 1 === i ? {transform: 'scale(1.2)'}: {}}>{i}</div>);
            }
            setPages(pages);
            
        }catch (error) {
            console.error('Помилка отримання даних:', error);
        }
    };

    const changePage = (i:number) =>{
        if(i != currentPages){
            setCurrentPages(i-1);            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    useEffect(()=>{
        console.log(currentPages);
        console.log(imageArray[currentPages]);
    },[currentPages])

    const handleScroll = () => {
        if (window.scrollY > 350) {
          setShowUp(true);
        } else {
          setShowUp(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const back = () =>{
        navigate(-1);
    }

    return (
        <div className={classes.listImages_page_container}>
            <svg onClick={back} className={classes.back_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            {loading ?(
                <div className={classes.loading}>
                  <ReactLoading type='bubbles' color='#E2E2E2' width='30%'/>
                </div>
            ):(
                <>
                    <div className={classes.images_container}>
                        {imageArray[currentPages]?.map((image: { name: string, id: string, parents: Array<any>, thumbnailLink: string }) => (
                            <ImageCard src={image.thumbnailLink.slice(0,-3) + '800'} folder={image.parents[0]} key={image.name} id={image.id}/>
                        // <div key={`${index}-${innerIndex}`}>{image.name}</div>
                        ))}
                    </div>
                    <div className={classes.pages}>
                        {pages}
                    </div>
                </>
            )}
            <div onClick={scrollToTop} className={classes.scroll_up_button} style={showUp ? {bottom: '7rem'}: {}}>
                <svg className={classes.scroll_up_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>
            </div>
        </div>
    );
};

export default ListImages;