// localization.js
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n();

i18n.translations = {
  en: {
    welcome: "Welcome to JoudFarm",
    login: "Login",
    signUp: "Sign Up",
  },
  fr: {
    welcome: "Bienvenue à JoudFarm",
    login: "Connexion",
    signUp: "Créer un compte",
  },
  ar: {
    welcome: "مرحبًا بك في JoudFarm",
    login: "تسجيل الدخول",
    signUp: "إنشاء حساب",
  }
};

i18n.locale = Localization.locale;
i18n.enableFallback = true;
i18n.fallbacks = true;

export default i18n;
