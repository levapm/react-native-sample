import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Icon, Text, ListItem, Left, Right, Picker, List, Body, Radio } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { OrderDeliveryMethods } from '../constants';

const DeliveryPicker = ({ 
    store={}, deliveryMethod, deliveryAddress, deliveryAddresses,
    onChange, onAddressChange
}) => {
    const { HOME_DELIVERY, STORE_PICKUP } = OrderDeliveryMethods;
    const hasStorePickup = get(store, 'storePickup.isActive', false);
    const hasHomeDelivery = get(store, 'homeDelivery.isActive', false);

    return (
        <List>
            <ListItem itemDivider>
                <Text style={common.fontBold}>{i18n.t('order.finalize.deliveryLabel')}</Text> 
            </ListItem>

            <ListItem 
                noBorder={HOME_DELIVERY !== deliveryMethod}
                style={[common.pt0, common.pb0, common.pr5]}
            >
                <Picker
                    mode="dropdown"
                    onValueChange={onChange}
                    style={{ width: undefined }}
                    selectedValue={deliveryMethod}
                    iosHeader={i18n.t('order.finalize.deliveryLabel')}
                    placeholder={i18n.t('order.finalize.deliveryLabel')}
                >
                    <Picker.Item
                        label={i18n.t(`order.deliveryMethods.${HOME_DELIVERY}`)}
                        value={HOME_DELIVERY}
                    />
                    <Picker.Item
                        label={i18n.t(`order.deliveryMethods.${STORE_PICKUP}`)}
                        value={STORE_PICKUP}
                    />
                </Picker>
            </ListItem>

            {deliveryMethod === HOME_DELIVERY && deliveryAddresses.map((addr) => (
                <ListItem
                    button
                    key={addr._id}
                    onPress={() => onAddressChange(addr)}
                    selected={deliveryAddress && deliveryAddress._id === addr._id}
                >
                    <Left>
                        <Body>
                            <Text style={common.fontNormal}>
                                {addr.line1}
                            </Text>
                            {!!addr.line2 && (<Text style={common.fontNormal}>{addr.line2}</Text>)}
                            <Text note>
                                {addr.zip}, {addr.city}, {addr.state}
                            </Text>
                        </Body>
                    </Left>
                    <Right>
                        <Radio selected={deliveryAddress && deliveryAddress._id === addr._id} />
                    </Right>
                </ListItem>
            ))}
        </List>
    );
};

DeliveryPicker.propTypes = {
    store: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    deliveryMethod: PropTypes.oneOf(Object.values(OrderDeliveryMethods)),
    
    deliveryAddress: PropTypes.object,
    onAddressChange: PropTypes.func.isRequired,
    deliveryAddresses: PropTypes.array.isRequired,
};

export default DeliveryPicker;