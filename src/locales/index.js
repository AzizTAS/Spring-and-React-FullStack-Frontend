import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import tr from "./translations/tr.json";

const storedLang = localStorage.getItem("lang");
const browserLang = navigator.language?.startsWith("tr") ? "tr" : "en";
const initialLanguage = storedLang || browserLang;

export const i18nInstance = i18n.use(initReactI18next);

i18nInstance.init({
  resources: {
    en: {
      translation: en,
    },
    tr: {
      translation: tr,
    },
  },

  lng: initialLanguage,
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});
