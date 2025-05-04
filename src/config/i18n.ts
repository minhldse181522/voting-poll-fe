import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "../messages/en.json";
import translationVI from "../messages/vi.json";

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18n
  .use(Backend) //Plugin lấy bản dịch từ file JSON
  .use(LanguageDetector) // Plugin phát hiện ngôn ngữ của người dùng
  .use(initReactI18next) // Plugin kết hợp react + i18 => sử dụng hook useTranslation
  .init({
    resources,
    fallbackLng: "en", // Ngôn ngữ mặc định khi ko tìm thấy ngôn ngữ
    lng: "en", // Ngôn ngữ khởi tạo
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "../messages/{{lng}}.json", // Đường dẫn tới file JSON
    },
  });

export default i18n;
