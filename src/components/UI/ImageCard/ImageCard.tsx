import { useNavigate } from 'react-router-dom';
import classes from './ImageCard.module.css'

interface ImageCardProps {
    src: string,
    folder: string;
    id: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src , folder , id}) => {
    const navigate = useNavigate();


    const redirect = () =>{
        
        navigate('/image?id=' + id +'&folder=' + folder);
    }

    return (
        <img className={classes.image} src={src} alt="Error" onClick={redirect}/>
    );
};

export default ImageCard;