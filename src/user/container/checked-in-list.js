import React from 'react';
import { PropTypes } from "prop-types";
import Meteor, {withTracker} from '@foysalit/react-native-meteor';
import { Text, View, Icon, Item, Input, Button } from 'native-base';

import common from '../../styles/common';
import { findCheckedInUsers } from '../services/api';

import PrimaryHeader from '../../shared/component/primary-header';
import UserComponentSmallPreview from '../components/small-preview';

class CheckedInList extends React.Component {
    state = { searchQuery: '', searchFocused: false, };

    toggleSearchFocus = () => {
        this.setState({ searchFocused: !this.state.searchFocused });
    };
    
    render () {
        const { users, usersReady, onSelect, selected } = this.props;
        const { searchQuery, searchFocused } = this.state;

        return (
            <View>
                <PrimaryHeader 
                    icon="contacts" 
                    text={`${users.length > 0 ? users.length+' ' : ''}Customers At The Store`}
                >
                    {!!selected && (
                        <Button
                            light
                            small
                            transparent
                            onPress={() => onSelect(null)}
                        >
                            <Icon name="close-circle" />
                        </Button>
                    )}
                </PrimaryHeader>

                <Item style={[common.my5]}>
                    <Input
                        value={searchQuery}
                        onBlur={this.toggleSearchFocus}
                        placeholder='Type to search...'
                        onFocus={this.toggleSearchFocus}
                        onChangeText={(searchQuery) => this.setState({ searchQuery })}
                    />
                    {(!searchFocused && searchQuery.length < 1) && <Icon active name='search' />}
                    {searchQuery.length > 1 && <Icon active name='close-circle' onPress={() => this.setState({ searchQuery: '' })} />}
                </Item>

                {usersReady && (users.length > 0 ? users.map(user => (
                    <UserComponentSmallPreview 
                        user={user} 
                        inCard={true}
                        key={user._id}
                        selected={selected} 
                        onSelect={onSelect} 
                    />
                )) : (
                    <View style={[common.fullHeightWithHeaderAndFooter, common.verticalCenter]}>
                        <View style={[common.alignCenter, common.px10]}>
                            <Icon name="contacts" style={common.fs40}/>
                            <Text>
                                No Customers at the store right now.
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };
};

CheckedInList.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.object,
};

export default withTracker(props => {
    const user = Meteor.user(),
        usersSub = Meteor.subscribe('users.checkedIn'),
        usersReady = usersSub.ready(),
        users = (user && usersReady) ? findCheckedInUsers(user.profile.storeId) : [];

    return {
        users, usersReady,
        ...props
    };
})(CheckedInList);