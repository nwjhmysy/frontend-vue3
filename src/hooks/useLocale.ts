import { LOCALES, DefaultLang } from '@/constants';
import { ref } from 'vue';

export const browserLocale = (): LOCALES => {
  let lang = '';

  if (navigator.languages && navigator.languages.length) {
    // latest versions of Chrome and Firefox set this correctly
    [lang] = navigator.languages;
  } else if (navigator.language) {
    // IE only
    lang = navigator.language;
  } else {
    // latest versions of Chrome, Firefox, and Safari set this correctly
    lang = navigator.language;
  }

  if (lang.indexOf('ja') >= 0) {
    return LOCALES.JA;
  }

  return DefaultLang;
};

export const useLocale = (localse: LOCALES = browserLocale()) => {
  const lang = ref(localse);
  const updateLocale = (newLang: LOCALES) => {
    lang.value = newLang;
  };

  return {
    lang,
    updateLocale,
  };
};
