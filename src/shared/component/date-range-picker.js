import React from 'react';
import { Picker } from 'native-base';
import { 
    startOfWeek, 
    startOfDay, 
    subWeeks, 
    endOfWeek, 
    subMonths, 
    endOfMonth, 
    startOfMonth 
} from 'date-fns';

import i18n from '../../i18n';

export const DateRanges = {
    thisWeek: `${startOfWeek(startOfDay(new Date()))}-${new Date()}`,
    lastWeek: `${startOfWeek(subWeeks(new Date(), 1))}-${endOfWeek(subWeeks(new Date(), 1))}`,
    thisMonth: `${startOfMonth(startOfDay(new Date()))}-${new Date()}`,
    lastMonth: `${startOfMonth(subMonths(new Date(), 1))}-${endOfMonth(subMonths(new Date(), 1))}`,
};

const DateRangePicker = ({
    selectedValue=DateRanges.thisMonth,
    onChange
}) => {
    const items = Object.keys(DateRanges).map(item => ({
        label: i18n.t(`datepicker.${item}`),
        value: DateRanges[item],
    }));

    return (
        <Picker
            mode="dropdown"
            onValueChange={onChange}
            selectedValue={selectedValue}
        >
            {items.map(item => (
                <Picker.Item
                    key={`date_picker_${item.label}`}
                    label={item.label}
                    value={item.value}
                />
            ))}
        </Picker>
    );
};

export default DateRangePicker;