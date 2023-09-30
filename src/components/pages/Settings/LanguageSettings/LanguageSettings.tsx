import i18next from 'i18next';

import { useNavigate } from 'react-router-dom';
import classes from './LanguageSettings.module.css'
import Flag from 'react-world-flags'
import { useEffect, useState } from 'react';

const LanguageSettings = () => {
    const navigate = useNavigate();
    const [selectedLanguage, setSelectedLanguage] = useState('ua');

    const back = () =>{
        navigate(-1);
    }

    useEffect(()=>{
        checkLanguage();
    },[])

    const checkLanguage = () =>{
        setSelectedLanguage(i18next.language)
    }
    
    const changeLanguage = (language:string) =>{
        const htmlElement = document.querySelector('html');
        if (htmlElement) {
            htmlElement.lang = language;
        }
        i18next.changeLanguage(language);
        setSelectedLanguage(language);
    }

    return (
        <div className={classes.language_page_container}>
            <svg onClick={back} className={classes.back_icon} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            <div className={classes.language_select}>
                <div onClick={()=> changeLanguage('ua')} className={`${classes.language} ${ selectedLanguage == 'ua' && classes.selected}`}>
                    Українська
                    <Flag code='ua' className={classes.language_flag}/>
                </div>
                <div onClick={()=> changeLanguage('en')} className={`${classes.language} ${ selectedLanguage == 'en' && classes.selected}`}>
                    English
                    <Flag code='gb' className={classes.language_flag}/>
                </div>
                <div onClick={()=> changeLanguage('cz')} className={`${classes.language} ${ selectedLanguage == 'cz' && classes.selected}`}>
                    Česky
                    <Flag code='cz' className={classes.language_flag}/>
                </div>
            </div>
        </div>
    );
};

export default LanguageSettings;