import color from 'color';
import { format, eachDay } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Text, Card, CardItem } from 'native-base';
import { LineChart } from 'react-native-chart-kit';

import i18n from '../i18n';
import colors from '../styles/colors';
import common from '../styles/common';
import { DateDisplayShort } from '../shared/constants';
import { parseCurrency } from '../shared/services/utils';
import { loadDateGroupStats, dateRangeToFilter } from './services/api';
import DateRangePicker, { DateRanges } from '../shared/component/date-range-picker';

const StoreOrderStatsContainer = () => {
    const [stats, setStats] = useState(null);
    const [createdAt, setCreatedAt] = useState(DateRanges.lastMonth);

    useEffect(() => {
        const dateRange = dateRangeToFilter(createdAt);
        loadDateGroupStats(dateRange).then(data => {
            const labels = eachDay(dateRange.$gt, dateRange.$lt).map(d => format(d, DateDisplayShort)); 
            const statData = {
                labels,
                datasets: [{
                    data: labels.map(() => 0)
                }]
            };

            data.map(({_id, orderTotal}, i) => {
                const date = format(new Date(_id.date), DateDisplayShort);
                statData.datasets[0].data[i] = parseCurrency(orderTotal);
            });
            
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
                    {i18n.t('stat.dateGroup.title')}
                </Text>
                <DateRangePicker
                    onChange={setCreatedAt}
                    selectedValue={createdAt}
                />
            </CardItem>

            <LineChart
                data={stats}
                height={220}
                style={[common.br20]}
                chartConfig={chartConfig}
                width={(common.halfWidth.width - 20)}
            />
        </Card>
    );
};

export default StoreOrderStatsContainer;