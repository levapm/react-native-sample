import React from 'react';
import { debounce, get } from 'lodash';
import Slider from "react-native-slider";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Row, Col, Text, Body, List, ListItem, Right, Switch, Left } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import colors from '../../styles/colors';

import { saveStore } from '../../store/services/api';
import { findStores } from '../../store/services/data';
import StoreSchema, { StorePickupSchema } from '../../store/services/schema';

import StoreComponentTimePicker from '../../store/components/time-picker';

class SettingContainerOrder extends React.Component {
    validator = StoreSchema.newContext();

    state = {
        errors: null,
        store: null,
    };

    componentDidMount() {
        if (!this.state.store && this.props.store) {
            this.setState({ store: this.props.store });
        }
    };

    debouncedStoreUpdate = debounce((store) => {
        this.validator.validate(this.validator.clean(store));

        if (this.validator.isValid())
            saveStore(store);
        else 
            this.setState({ errors: this.validator.validationErrors() });

    }, 300);

    changeStore = (field, value) => {
        const { store } = this.state;
        store[field] = value;

        this.setState({store});
        this.debouncedStoreUpdate(store);
    };

    changeNested = (parent, field, value) => {
        const { store } = this.state;
        store[parent] = store[parent] || {isActive: false, timetable: {}};
        
        if (field === 'timetable') {
            if (value.data === null) {
                delete store[parent].timetable[value.day];
            } else {
                store[parent].timetable[value.day] = {
                    ...store[parent].timetable[value.day], 
                    ...value.data
                };
            }
        } else {
            store[parent][field] = value;
        }

        this.changeStore(parent, store[parent]);
    };

    render() {
        const { user } = this.props;
        const { store } = this.state;

        if (!store)
            return null;

        const { acceptsOnlineOrder, homeDelivery, storePickup} = store;

        return (
            <>
                <Row>
                    <Col style={[common.px15, common.py10]}>
                        <Text style={[common.pageHeaderText, common.pb5]}>
                            {i18n.t('setting.order.editorTitle')}
                        </Text>
                        <Text>
                            {i18n.t('setting.order.editorDescription')}
                        </Text>
                    </Col>
                </Row>

                {!!user && (
                    <>
                    <Row style={common.px10}>
                        <Col style={[common.br5, common.bgLight]}>
                            <List>
                                <ListItem noBorder>
                                    <Body>
                                        <Text>{i18n.t('setting.order.onlineOrderLabel')}</Text>
                                    </Body>
                                    <Right>
                                        <Switch 
                                            value={acceptsOnlineOrder}
                                            onValueChange={() => this.changeStore('acceptsOnlineOrder', true)} 
                                        />
                                    </Right>
                                </ListItem>
                            </List>
                        </Col>
                    </Row>

                    <Row style={[common.px10, common.pt25]}>
                        <Col>
                            <Text style={[common.px5, common.pb5]}>
                                {i18n.t('setting.order.deliveryHeader')}
                            </Text>
                            <List style={[common.br5, common.bgLight]}>
                                <ListItem>
                                    <Body>
                                        <Text>{i18n.t('setting.order.homeDeliveryLabel')}</Text>
                                        <Text note>{i18n.t('setting.order.homeDeliveryHint')}</Text>
                                    </Body>
                                    <Right>
                                        <Switch 
                                            value={get(store, 'homeDelivery.isActive', false)}
                                            onValueChange={() => this.changeNested('homeDelivery', 'isActive', !get(store, 'homeDelivery.isActive', false))} 
                                        />
                                    </Right>
                                </ListItem>

                                {get(store, 'homeDelivery.isActive', false) && (
                                    <>
                                    <ListItem>
                                        <Body>
                                            <StoreComponentTimePicker
                                                onTimeChange={(day, data) => this.changeNested('homeDelivery', 'timetable', {day, data})}
                                                timetable={get(store, 'homeDelivery.timetable', {})}
                                            />
                                        </Body>
                                    </ListItem>
                                    <ListItem>
                                        <Body>
                                            <Text>{i18n.t('setting.order.homeDeliveryRadiusLabel', { radius: get(store, 'homeDelivery.radius', 3)})}</Text>
                                            <Text note>{i18n.t('setting.order.homeDeliveryRadiusHint')}</Text>
                                        </Body>
                                        <Body>
                                            <Slider
                                                step={1}
                                                minimumValue={3}
                                                maximumValue={15}
                                                thumbStyle={[common.bgPrimary]}
                                                minimumTrackTintColor={colors.primary}
                                                value={get(store, 'homeDelivery.radius', 3)}
                                                onValueChange={radius => this.changeNested('homeDelivery', 'radius', radius)}
                                            />
                                        </Body>
                                    </ListItem>
                                    </>
                                )}

                                <ListItem noBorder>
                                    <Body>
                                        <Text>{i18n.t('setting.order.storePickupLabel')}</Text>
                                        <Text note>{i18n.t('setting.order.storePickupHint')}</Text>
                                    </Body>
                                    <Right>
                                        <Switch 
                                            value={get(store, 'storePickup.isActive', false)}
                                            onValueChange={() => this.changeNested('storePickup', 'isActive', !get(store, 'storePickup.isActive', false))} 
                                        />
                                    </Right>
                                </ListItem>

                                {get(store, 'storePickup.isActive', false) && (
                                    <ListItem>
                                        <Body>
                                            <StoreComponentTimePicker
                                                onTimeChange={(day, data) => this.changeNested('storePickup', 'timetable', {day, data})}
                                                timetable={get(store, 'storePickup.timetable', {})}
                                            />
                                        </Body>
                                    </ListItem>
                                )}
                            </List>
                        </Col>
                    </Row>
                    </>
                )}
            </>
        );
    };
};

export default withTracker(props => {
    const user = Meteor.user(),
        store = findStores({_id: user.profile.storeId})[0];

    return { ...props, user, store }
})(SettingContainerOrder);