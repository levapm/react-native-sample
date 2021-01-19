import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { View, Spinner, Item, Input, Icon } from "native-base";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';

import common from '../../styles/common';
import { findRewards } from '../services/data';
import { findUser } from '../../user/services/api';

import RewardComponentEmpty from '../components/empty';
import RewardComponentSummary from '../components/summary';

class RewardContainerList extends React.Component {
    state = { searchQuery: '', searchFocused: false, };

    itemCount (products) {
        let count = 0;
        products.forEach(p => count += p.variations.length);

        return count;
    };

    toggleSearchFocus = () => {
        this.setState({ searchFocused: !this.state.searchFocused });
    };

    render () {
        let { rewardsReady, rewards, onSelect } = this.props;
        const { searchQuery, searchFocused } = this.state;

        if (searchQuery.length > 1) {
            const q = searchQuery.toLocaleLowerCase();
            rewards = rewards.filter(({ title }) => title.toLowerCase().indexOf(q) >= 0);
        }

        return (
            <View>
                <Item style={[common.my10]}>
                    <Input 
                        value={searchQuery} 
                        placeholder='Type to search...'
                        onFocus={this.toggleSearchFocus}
                        onBlur={this.toggleSearchFocus}
                        onChangeText={(searchQuery) => this.setState({ searchQuery })} 
                    />
                    { (!searchFocused && searchQuery.length < 1) && <Icon active name='search' /> }
                    {(searchQuery.length > 0) && <Icon active name='close' onPress={() => this.setState({ searchQuery: '' })} />}
                </Item>
                {(!rewardsReady) ? (<Spinner />) : (rewards.length < 1 ? (
                    <RewardComponentEmpty />
                ) : rewards.map((reward => (
                    <RewardComponentSummary
                        reward={reward}
                        key={reward._id}
                        onSelect={() => onSelect(reward)}
                    />
                ))))}
            </View>
        );
    }
};

RewardContainerList.propTypes = {
    onSelect: PropTypes.func,
};

export default withTracker(props => {
    const user = Meteor.user(),
        filters = {storeId: user?.profile?.storeId};

    const rewardsSub = Meteor.subscribe('reward.list'),
        rewardsReady = rewardsSub.ready(),
        rewards = findRewards(filters).map(reward => {
            reward.customer = findUser(reward.placedBy);

            return reward;
        });
    
    return { ...props, rewardsReady, rewards, };
})(RewardContainerList);