import i18n from "../../i18n";

import SettingContainerStore from "../containers/store";
import SettingContainerOrder from "../containers/order";
import SettingContainerBanner from "../containers/banner";
import SettingContainerAccount from "../containers/account";

export const SettingPages = [
    {
        text: i18n.t('setting.pageNames.store'),
        container: SettingContainerStore,
        icon: 'business',
    },
    {
        text: i18n.t('setting.pageNames.account'),
        container: SettingContainerAccount,
        icon: 'contact',
    },
    {
        text: i18n.t('setting.pageNames.order'),
        container: SettingContainerOrder,
        icon: 'cart',
    },
    {
        text: i18n.t('setting.pageNames.banner'),
        container: SettingContainerBanner,
        icon: 'megaphone',
    },
];