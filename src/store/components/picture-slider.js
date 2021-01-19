import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Alert } from 'react-native';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';

import colors from '../../styles/colors';
import { Button, Icon } from 'native-base';

const { width: winWidth, height: winHeight } = Dimensions.get('window');
const Styles = {
    paginationContainer: { 
        bottom: 0,
        width: winWidth/2,
        position: 'absolute',
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: colors.primary,
    },
    container: { 
        flex: 1, 
        height: 300, 
        position: 'relative' 
    },
    deleteBtn: {
        position: 'absolute',
        zIndex: 999,
        right: 15,
        top: 15
    }
}

class StorePictureSlider extends React.Component {
    state = {
        activeSlide: 0,
    };
    
    get pagination() {
        const { activeSlide } = this.state;
        return (
            <Pagination
                inactiveDotScale={0.6}
                inactiveDotOpacity={0.4}
                activeDotIndex={activeSlide}
                dotStyle={Styles.paginationDot}
                dotsLength={this.props.pictures.length}
                containerStyle={Styles.paginationContainer}
            />
        );
    };

    handleDelete = () => {
        Alert.alert(
            "Remove Picture?", 
            "Sure you want to remove this picture. We will remove it from our servers if it has already been uploaded there.",
            [
                {text: 'Keep It', style: 'cancel'},
                {text: 'Remove', onPress: () => this.props.onDelete(this.props.pictures[this.state.activeSlide])}
            ]
        );
    };

    render () {
        return (
            <View style={Styles.container}>
                {!!this.props.onDelete && (
                    <Button 
                        transparent 
                        style={Styles.deleteBtn}
                        onPress={this.handleDelete}
                    >
                        <Icon name="trash" />
                    </Button>
                )}

                <Carousel
                    itemHeight={300}
                    sliderHeight={300}
                    itemWidth={winWidth/2}
                    sliderWidth={winWidth/2}
                    hasParallaxImages={true}
                    data={this.props.pictures}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    renderItem={({ item, index }, parallaxProps) => {
                        return (
                            <ParallaxImage
                                showSpinner={true}
                                parallaxFactor={0.4}
                                containerStyle={{ flex: 1 }}
                                source={{ uri: item.uri }}
                                {...parallaxProps}
                            />
                        )
                    }}
                />

                {this.pagination}
            </View>
        );
    };
};

StorePictureSlider.propTypes = {
    pictures: PropTypes.array,
    onDelete: PropTypes.func,
};

export default StorePictureSlider;