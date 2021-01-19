import color from 'color';
import React, { useState, useEffect } from 'react';
import { Text, Card, CardItem } from 'native-base';
import { ProgressChart } from 'react-native-chart-kit';

import i18n from '../i18n';
import colors from '../styles/colors';
import common from '../styles/common';
import { loadSummaryStats } from './services/api';
import { OrderDeliveryMethods, OrderPaymentMethods } from '../order/constants';
import DateRangePicker, {DateRanges} from '../shared/component/date-range-picker';

const SharedStatsContainer = () => {
    const { HOME_DELIVERY, STORE_PICKUP } = OrderDeliveryMethods;
    const { ACCOUNT_BALANCE, CASH } = OrderPaymentMethods;

    const [stats, setStats] = useState(null);
    const [createdAt, setCreatedAt] = useState(DateRanges.thisMonth);

    useEffect(() => {
        loadSummaryStats(createdAt).then(data => {
            statData = {
                labels: [
                    i18n.t(`order.deliveryMethods.${STORE_PICKUP}`),
                    i18n.t(`order.paymentMethods.${CASH}`),
                ],
                data: [
                    (data[STORE_PICKUP].orderTotal / ((data[STORE_PICKUP].orderTotal + data[HOME_DELIVERY].orderTotal) || 1)),
                    (data[CASH].orderTotal / ((data[CASH].orderTotal + data[ACCOUNT_BALANCE].orderTotal) || 1)),
                ]
            }

            setStats(statData);
        });
    }, [createdAt]);

    if (stats === null) {
        return null;
    }

    const chartConfig = {
        backgroundGradientTo: colors.light,
        backgroundGradientFrom: colors.light,
        color: (opacity = 1) => color(colors.primary).lighten(opacity).toString(),
    };

    return (
        <Card style={{ borderColor: colors.light }}>
            <CardItem header bordered style={{ justifyContent: 'space-between' }}>
                <Text>
                    {i18n.t('stat.summary.title')}
                </Text>
                <DateRangePicker
                    onChange={setCreatedAt}
                    selectedValue={createdAt}
                />
            </CardItem>

            <ProgressChart
                data={stats}
                height={220}
                style={[common.br20]}
                chartConfig={chartConfig}
                width={(common.halfWidth.width-20)}
            />
        </Card>
    );
};

export default SharedStatsContainer;