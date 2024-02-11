import i18n from "i18next";
import { initReactI18next } from "react-i18next";


// Importing translation files

import translationEN from "./en/translation.json";
import translationBN from "./bn/translation.json";


//Creating object with the variables of imported translation files
const resources = {
    en: {
        translation: translationEN,
    },
    bn: {
        translation: translationBN,
    },
};

const defaultLanguage = localStorage.getItem('language');
//i18N Initialization

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng:defaultLanguage?defaultLanguage:"en", //default language
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;