import React from 'react';
import { View } from 'react-native';
import { withTracker } from '@foysalit/react-native-meteor';
import { format, distanceInWordsToNow } from 'date-fns';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Card, CardItem, Text, Body, Right, Left, Button, Icon } from "native-base";

import common from '../../styles/common';
import { 
    getPointFilterEndDate, getPointFilterStartDate, setPointFilterStartDate, 
    setPointFilterEndDate, getPointFilterOwner, setPointFilterOwner 
} from '../services/state';
import { getFullName } from '../../user/services/helpers';

class PointContainerFilters extends React.Component {
    state = {
        dateSide: 'start',
        showDatePicker: false,
    };

    _showDatePicker = (dateSide='start') => {
        this.setState({ showDatePicker: true, dateSide });
    };

    _hideDatePicker = () => this.setState({ showDatePicker: false });

    _handleDatePicked = (date) => {
        if (this.state.dateSide === 'start')
            setPointFilterStartDate(date);
        else
            setPointFilterEndDate(date);

        this._hideDatePicker();
    };

    render () {
        const { owner, startDate, endDate, dateSide } = this.props;

        return (
            <Card>
                <CardItem header bordered>
                    <Text>Filter Points</Text>
                </CardItem>

                { !!owner && (
                    <CardItem>
                        <Left>
                            <View
                                style={[common.alignCenter, common.verticalCenter, common.bgPrimary, common.br45, { width: 45, height: 45 }]}>
                                <Text style={[common.fs20, common.fontBold, common.textWhite, common.ml0]}>
                                    {getFullName(owner.profile)[0]}
                                </Text>
                            </View>
                            <Body>
                                <Text>{getFullName(owner.profile)}</Text>
                                <Text note>{distanceInWordsToNow(owner.profile.checkedInAt)}</Text>
                            </Body>
                        </Left>

                        <Right>
                            <Button small transparent onPress={() => setPointFilterOwner(null)}>
                                <Icon name="close-circle-outline" />
                            </Button>
                        </Right>
                    </CardItem>
                )}

                <CardItem button onPress={() => this._showDatePicker('start')}>
                    <Body>
                        <Text>Points Awarded After</Text>
                    </Body>
                    <Right>
                        <Text>{format(startDate, 'DD MMM, YYYY')}</Text>
                    </Right>
                </CardItem>
                
                <CardItem button onPress={() => this._showDatePicker('end')}>
                    <Body>
                        <Text>Points Awarded Before</Text>
                    </Body>
                    <Right>
                        <Text>{ format(endDate, 'DD MMM, YYYY') }</Text>
                    </Right>
                </CardItem>

                <DateTimePicker
                    maximumDate={new Date()}
                    onCancel={this._hideDatePicker}
                    onConfirm={this._handleDatePicked}
                    isVisible={this.state.showDatePicker}
                    date={dateSide === 'start' ? startDate : endDate}
                />
            </Card>
        );
    }
};

export default withTracker(props => {
    return {
        owner: getPointFilterOwner(),
        endDate: getPointFilterEndDate(),
        startDate: getPointFilterStartDate(),
        ...props,
    };
})(PointContainerFilters);