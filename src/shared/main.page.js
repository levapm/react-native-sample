import React from "react";
import Constants from "expo-constants";
import { withTracker } from '@foysalit/react-native-meteor';
import { Footer, FooterTab, Button, Icon, Badge, Text } from "native-base";
import { createSwitchNavigator, createBottomTabNavigator, createStackNavigator, createAppContainer } from "react-navigation";

import common from "../styles/common";
import { getUnseenOrderCount } from "../order/services/state";

import SharedPageHome from './home.page';
import SettingPageHome from '../setting/home.page';

import AuthPage from '../auth/main.page';
import PointPageHistory from '../point/history.page';
import UserPageCheckedIn from '../user/checked-in.page';

import OrderPageHome from '../order/pages/home';
import OrderPageCreate from '../order/pages/create';
import OrderPageBasket from '../order/pages/basket';

import PackPageHome from '../pack/home.page';
import PackPageEdit from '../pack/edit.page';
import PackPageCreate from '../pack/create.page';

import RewardPageHome from '../reward/home.page';
import RewardPageEdit from '../reward/edit.page';
import RewardPageCreate from '../reward/create.page';

import ProductPageEdit from '../product/page/edit';
import ProductPageHome from '../product/page/home';
import ProductPageExtra from '../product/page/extra';
import ProductPageSearch from '../product/page/search';
import ProductPageCreate from '../product/page/create';


const SharedPageStack = createStackNavigator({
    SharedPageHome: { screen: SharedPageHome },
    RewardPageHome: { screen: RewardPageHome },
    RewardPageEdit: { screen: RewardPageEdit },
    RewardPageCreate: { screen: RewardPageCreate },
    SettingPageHome: { screen: SettingPageHome },
    PackPageHome: { screen: PackPageHome},
    PackPageCreate: { screen: PackPageCreate},
    PackPageEdit: { screen: PackPageEdit},
    ProductPageSearch: { screen: ProductPageSearch },
    ProductPageHome: { screen: ProductPageHome },
    ProductPageEdit: { screen: ProductPageEdit },
    ProductPageCreate: { screen: ProductPageCreate },
    ProductPageExtra: { screen: ProductPageExtra },
}, {
    headerMode: 'none'
});

const UserPageCheckedInStack = createStackNavigator({
    UserPageCheckedIn: { screen: UserPageCheckedIn },
    UserPageProductSearch: { screen: ProductPageSearch },
    UserPageOrderCreate: { screen: OrderPageCreate },
    UserPageOrderBasket: { screen: OrderPageBasket },
}, {
    headerMode: 'none'
});

const pageMap = [
    {
        icon: 'business',
        name: 'SharedPageStack',
    },
    {
        icon: 'contacts',
        name: 'UserPageCheckedInStack',
    },
    {
        icon: 'cart',
        name: 'OrderPageHome',
    },
];

const TabBar = props => {
    const { navigate, state } = props.navigation;

    return (
        <Footer>
            <FooterTab>
                {pageMap.map((page, i) => {
                    const isActive = state.index === i,
                        showBadge = page.icon === 'cart' && props.unseenOrderCount > 0;

                    return (
                        <Button
                            key={page.name}
                            badge={showBadge}
                            active={isActive}
                            onPress={() => navigate(page.name)}
                        >
                            {showBadge && (<Badge><Text>{ props.unseenOrderCount }</Text></Badge>)}
                            <Icon name={page.icon} style={common.fs30} />
                        </Button>
                    );
                })}
            </FooterTab>
        </Footer>
    );
};

const TabBarContainer = withTracker(props => {
    const unseenOrderCount = getUnseenOrderCount();
    return {unseenOrderCount, ...props};
})(TabBar);

const MainStack = createBottomTabNavigator(
    {
        SharedPageStack: { screen: SharedPageStack },
        UserPageCheckedInStack: { screen: UserPageCheckedInStack},
        OrderPageHome: { screen: OrderPageHome },
        PointPageHistory: { screen: PointPageHistory, },
    }, 
    {
        tabBarPosition: "bottom",
        tabBarComponent: TabBarContainer
    }
);

const AppNavigator = createSwitchNavigator({
    AuthStack: {
        screen: AuthPage,
    },
    MainStack: {
        screen: MainStack,
    }
}, {
    headerMode: 'none',
    navigationOptions: { 
        headerStyle: { marginTop: Constants.statusBarHeight } 
    }
});

export default createAppContainer(AppNavigator);