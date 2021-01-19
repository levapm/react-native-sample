import React from 'react';
import PropTypes from 'prop-types';
import { endOfDay, startOfDay, format } from 'date-fns';
import FaIcon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Row, Text, Button, Grid, Col, Left, Right, Switch, CardItem, Body, Icon } from 'native-base';

import colors from '../../styles/colors';

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

class StoreComponentTimePicker extends React.Component {
    state = {
        showPicker: false,
        pickerDay: days[0],
        end: 'open',
        availableDays: [],
    };

    componentDidMount() {
        const { timetable } = this.props;

        if (timetable) {
            const newState = {};
            const availableDays = Object.keys(timetable);

            availableDays.forEach(day => {
                newState[this._getTimeKey(day, 'open')] = timetable[day].open;
                newState[this._getTimeKey(day, 'close')] = timetable[day].close;
            });

            newState.availableDays = availableDays;
            this.setState(newState);
        }
    };

    _showPicker = (day, end) => this.setState({ showPicker: true, day, end });

    _hideDateTimePicker = () => this.setState({ showPicker: false });

    _handleDatePicked = (date) => {
        const key = this._getTimeKey(this.state.day, this.state.end);
        this.setState({ [key]: date, showPicker: false });
        this.props.onTimeChange(this.state.day, {[this.state.end]: date});
    };

    _toggleDay = (day) => {
        const openKey = this._getTimeKey(day, 'open');
        const closeKey = this._getTimeKey(day, 'close');
        let { availableDays } = this.state,
            open, close;

        if (availableDays.indexOf(day) >= 0) {
            availableDays = availableDays.filter(d => d !== day);
            this.props.onTimeChange(day, null);
        } else {
            availableDays.push(day);
            open = startOfDay(new Date());
            close = endOfDay(new Date());
            this.props.onTimeChange(day, {open, close});
        }

        this.setState({ availableDays, [openKey]: open, [closeKey]: close });
    };

    _getTimeKey = (day, end) => `${day}_${end}`;
    
    render() {
        const { availableDays, store } = this.state;
        
        return (
            <Grid>
                {days.map(day => {
                    const dayAvailable = availableDays.indexOf(day) >= 0;
                    const open = this.state[this._getTimeKey(day, 'open')];
                    const close = this.state[this._getTimeKey(day, 'close')];

                    return (
                        <Row key={day}>
                            <Col>
                                <CardItem bordered={day !== 'Friday'}>
                                    <Left><Text>{ day }</Text></Left>
                                    <Right>
                                        <Switch 
                                            value={dayAvailable} 
                                            onValueChange={() => this._toggleDay(day)}
                                        />
                                    </Right>
                                </CardItem>

                                {dayAvailable && (
                                    <CardItem bordered={day !== 'Friday'}>
                                        <Body style={{ borderRightWidth: 1, borderRightColor: colors.fadedLight }}>
                                            <Button 
                                                full
                                                small
                                                transparent 
                                                onPress={() => this._showPicker(day, 'open')}
                                            >
                                                <FaIcon name="door-open" />
                                                <Text>Opens At: {format(open, 'HH:mm')}</Text>
                                            </Button>
                                        </Body>
                                        <Body>
                                            <Button 
                                                full
                                                small
                                                transparent 
                                                onPress={() => this._showPicker(day, 'close')}
                                            >
                                                <FaIcon name="door-closed" />
                                                <Text>Closes At: {format(close, 'HH:mm')}</Text>
                                            </Button>
                                        </Body>
                                    </CardItem>
                                )}
                            </Col>
                        </Row>
                    );
                })}
                <DateTimePicker
                    mode='time'
                    isVisible={this.state.showPicker}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    date={this.state[this._getTimeKey(this.state.day, this.state.end)]}
                />
            </Grid>
        );
    }

};

StoreComponentTimePicker.propTypes = {
    onTimeChange: PropTypes.func.isRequired,
    timetable: PropTypes.object,
};

export default StoreComponentTimePicker;