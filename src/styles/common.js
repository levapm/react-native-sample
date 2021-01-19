import Constants from "expo-constants";
import { StyleSheet, Dimensions } from "react-native";

import AppColors from './colors';
import Theme from '../../native-base-theme/variables/platform';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

const styles = {
    avoidStatusBar: {
        paddingTop: Constants.statusBarHeight
    },
    alignCenter: {
        alignItems: 'center',
    },
    verticalCenter: {
        justifyContent: 'center',
    },
    flexReverse: {
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    fullWidth: {
        width: winWidth,
    },
    halfWidth: {
        width: winWidth/2,
    },
    fullHeight: {
        height: winHeight,
    },
    fullHeightWithHeader: {
        height: winHeight - Theme.toolbarHeight - 30,
    },
    fullHeightWithHeaderAndFooter: {
        height: winHeight - (Theme.toolbarHeight*2) - 30,
    },
    fontBold: {
        fontWeight: 'bold'
    },
    fontItalic: {
        fontStyle: 'italic'
    },
    fontNormal: {
        fontWeight: 'normal'
    },
    textRight: {
        textAlign: 'right'
    },
    textCenter: {
        textAlign: 'center'
    },
    textCapital: {
        textTransform: 'uppercase'
    },
    textCapitalized: {
        textTransform: 'capitalize'
    },
    bgBackground: {
        backgroundColor: AppColors.background
    },
    textBackground: {
        color: AppColors.background
    },
    bgPrimary: {
        backgroundColor: AppColors.primary
    },
    textPrimary: {
        color: AppColors.primary
    },
    bgSuccess: {
        backgroundColor: AppColors.success
    },
    textSuccess: {
        color: AppColors.success
    },
    bgWarning: {
        backgroundColor: AppColors.warning
    },
    textWarning: {
        color: AppColors.warning
    },
    bgDanger: {
        backgroundColor: AppColors.danger
    },
    textDanger: {
        color: AppColors.danger
    },
    bgDark: {
        backgroundColor: AppColors.dark
    },
    textDark: {
        color: AppColors.dark
    },
    bgLighter: {
        backgroundColor: AppColors.lighter
    },
    textLighter: {
        color: AppColors.lighter
    },
    bgLight: {
        backgroundColor: AppColors.light
    },
    textLight: {
        color: AppColors.light
    },
    bgFadedLight: {
        backgroundColor: AppColors.fadedLight
    },
    textFadedLight: {
        color: AppColors.fadedLight
    },
    textWhite: {
        color: '#FFFFFF'
    },

    borderedSection: {
        borderBottomWidth: 2,
        borderBottomColor: AppColors.primary
    },

    // page headers
    pageHeaderGrid: {
        paddingVertical: 25,
        paddingRight: 5,
        paddingLeft: 10,
    },
    pageHeaderText: {
        fontSize: 25,
        paddingTop: 5,
        fontWeight: 'bold',
    },

    // card list 
    cardListInfoIcon: {
        color: AppColors.danger,
        fontSize: 18
    },
    cardListInfoText: {
        textAlign: 'right',
        fontWeight: 'bold',
        alignSelf: 'stretch',
    },

    // banner
    redBanner: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: AppColors.danger,
    },
    redBannerText: {
        color: '#FFFFFF'
    },
};

const numbers = Array.from(Array(11)).map((i, x) => x * 5);

numbers.forEach(i => {
    styles[`m${i}`] = { margin: i };
    styles[`ml${i}`] = { marginLeft: i };
    styles[`mr${i}`] = { marginRight: i };
    styles[`mt${i}`] = { marginTop: i };
    styles[`mb${i}`] = { marginBottom: i };
    styles[`mx${i}`] = { marginHorizontal: i };
    styles[`my${i}`] = { marginVertical: i };

    styles[`p${i}`] = { padding: i };
    styles[`px${i}`] = { paddingHorizontal: i };
    styles[`py${i}`] = { paddingVertical: i };
    styles[`pl${i}`] = { paddingLeft: i };
    styles[`pr${i}`] = { paddingRight: i };
    styles[`pt${i}`] = { paddingTop: i };
    styles[`pb${i}`] = { paddingBottom: i };

    styles[`br${i}`] = { borderRadius: i };
    styles[`btrr${i}`] = { borderTopRightRadius: i };
    styles[`bbrr${i}`] = { borderBottomRightRadius: i };
    styles[`btlr${i}`] = { borderTopLeftRadius: i };
    styles[`bblr${i}`] = { borderBottomLeftRadius: i };

    styles[`fs${i}`] = { fontSize: i };
});

// console.log(styles);

export default StyleSheet.create(styles);