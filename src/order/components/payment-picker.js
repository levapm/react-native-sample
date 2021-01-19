import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { Text, Row, Col, List, ListItem, Picker, } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { OrderPaymentMethods } from '../constants';

const PaymentPicker = ({ needsRecharge, paymentMethod, onChange }) => {
    const { ACCOUNT_BALANCE, CASH } = OrderPaymentMethods;
    const showRecharge = needsRecharge && paymentMethod === ACCOUNT_BALANCE;

    return (
        <List>
            <ListItem itemDivider>
                <Text style={common.fontBold}>{i18n.t('order.finalize.paymentLabel')}</Text>
            </ListItem>

            <ListItem
                noBorder={ACCOUNT_BALANCE !== paymentMethod} 
                style={[common.pt0, common.pb0, common.pr5]}
            >
                <Picker
                    mode="dropdown"
                    onValueChange={onChange}
                    style={{ width: undefined }}
                    selectedValue={paymentMethod}
                    iosHeader={i18n.t('order.finalize.deliveryLabel')}
                    placeholder={i18n.t('order.finalize.deliveryLabel')}
                >
                    <Picker.Item
                        label={i18n.t(`order.paymentMethods.${ACCOUNT_BALANCE}`)}
                        value={ACCOUNT_BALANCE}
                    />
                    <Picker.Item
                        label={i18n.t(`order.paymentMethods.${CASH}`)}
                        value={CASH}
                    />
                </Picker>
            </ListItem>

            {showRecharge && (
                <ListItem style={[common.pt0, common.pb0, common.ml0, common.pr0]}>
                    <Row style={[common.redBanner, common.px10]}>
                        <Col>
                            <Text style={[common.redBannerText]}>
                                {i18n.t('order.finalize.needsRecharge')}
                            </Text>
                        </Col>
                    </Row>
                </ListItem>
            )}
        </List>
    );
};

PaymentPicker.propTypes = {
    onChange: PropTypes.func.isRequired,
    needsRecharge: PropTypes.bool.isRequired,
    paymentMethod: PropTypes.oneOf(Object.values(OrderPaymentMethods)),
};

export default withNavigation(PaymentPicker);