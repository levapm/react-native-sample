import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import en from './en';
import bn from './bn';

i18n.fallbacks = true;
i18n.translations = { bn, en };
i18n.locale = Localization.locale;

export default i18n;