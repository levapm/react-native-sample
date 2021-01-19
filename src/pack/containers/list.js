import React from 'react';
import PropTypes from 'prop-types';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { View, Spinner, Item, Input, Icon } from "native-base";

import common from '../../styles/common';
import { findPacks } from '../services/data';
import { findProducts } from '../../product/services/data';

import PackComponentEmpty from '../components/empty';
import PackComponentSummary from '../components/summary';

class PackContainerList extends React.Component {
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
        let { packsReady, packs, onSelect } = this.props;
        const { searchQuery, searchFocused } = this.state;

        if (searchQuery.length > 1) {
            const q = searchQuery.toLocaleLowerCase();
            packs = packs.filter(({ title }) => title.toLowerCase().indexOf(q) >= 0);
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
                {(!packsReady) ? (<Spinner />) : (packs.length < 1 ? (
                    <PackComponentEmpty />
                ) : packs.map((pack => (
                    <PackComponentSummary
                        pack={pack}
                        key={pack._id}
                        onSelect={() => onSelect(pack)}
                    />
                ))))}
            </View>
        );
    }
};

PackContainerList.propTypes = {
    onSelect: PropTypes.func,
};

export default withTracker(props => {
    const filters = {},
        user = Meteor.user();

    if (user) {
        filters.storeId = user.profile.storeId;
    }

    const packsSub = Meteor.subscribe('pack.list', filters),
        packsReady = packsSub.ready(),
        packs = findPacks(filters).map(pack => {
            if (pack.product && pack.product._id) {
                pack.product = findProducts(pack.product._id)[0];
            }

            return pack;
        });
    
    return { ...props, packsReady, packs, };
})(PackContainerList);