import React from 'react';
import { debounce } from 'lodash';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Row, Col, Text, Card, Item, Label, Input, View, CardItem, Body, Button, Icon, Left, Right } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import StoreSchema from '../../store/services/schema';
import { findStores } from '../../store/services/data';
import { takePhoto } from '../../image/services/helpers';
import { saveStore, addStorePicture } from '../../store/services/api';
import { findStorePictures, removeImage } from '../../image/services/api';

import StorePictureSlider from '../../store/components/picture-slider';
import StoreComponentTimePicker from '../../store/components/time-picker';

class SettingContainerStore extends React.Component {
    validator = StoreSchema.newContext();

    state = {
        errors: null,
        store: null,
        pictures: null,
    };

    componentDidMount() {
        if (!this.state.store && this.props.store) {
            this.setState({ store: this.props.store });
        }

        if (!this.state.pictures && this.props.pictures) {
            this.setState({ pictures: this.props.pictures });
        }
    };

    debouncedStoreUpdate = debounce((store) => {
        this.validator.validate(this.validator.clean(store));

        if (this.validator.isValid())
            saveStore(store);
        else 
            this.setState({ errors: this.validator.validationErrors() });

    }, 300);

    changeStore = (field, value) => {
        const { store } = this.state;
        store[field] = value;

        this.setState({store});
        this.debouncedStoreUpdate(store);
    };

    saveTimetable = (day, data) => {
        const { store } = this.state;

        if (!store.timetable) {
            store.timetable = {};
        }

        if (data === null) {
            delete store.timetable[day];
        } else {
            store.timetable[day] = {...store.timetable[day], ...data};
        }

        saveStore(store);
    };

    handlePictureDelete = (pic) => {
        const { pictures } = this.state;

        if (pic._id) {
            removeImage(pic._id);
            this.setState({ pictures: pictures.filter(p => p._id !== pic._id) });
        } else {
            this.setState({ pictures: pictures.filter(p => p.uri !== pic.uri) });
        }
    };

    showImagePicker = async () => {
        const uri = await takePhoto(true);

        if (!uri)
            return;

        this.setState({ pictures: [{ uri }, ...this.state.pictures] });
        await addStorePicture(this.state.store._id, uri);
    };

    renderFieldError(field) {
        const error = this.validator.keyErrorMessage(field);

        if (!error)
            return null;

        return (
            <Text style={[common.textPrimary, common.pl5, common.py5]}>
                {this.validator.keyErrorMessage(field)}
            </Text>
        )
    };

    render () {
        const { store, pictures } = this.state;

        return (
            <>
            <Row>
                <Col style={[common.px15, common.py10]}>
                    <Text style={[common.pageHeaderText, common.pb5]}>
                        { i18n.t('setting.store.editorTitle') }
                    </Text>
                    <Text>
                        { i18n.t('setting.store.editorDescription') }
                    </Text>
                </Col>
            </Row>

            {!!store && (
                <Row>
                    <Col style={[common.pl10]}>
                        <Card style={[common.halfWidth]}>
                            {pictures && (
                                <CardItem cardBody>
                                    <StorePictureSlider 
                                        pictures={pictures}
                                        onDelete={this.handlePictureDelete} 
                                    />
                                </CardItem>
                            )}
                            <View style={[common.px10]}>
                                <Item inlineLabel>
                                    <Label>Store Name</Label>
                                    <Input
                                        value={store.name}
                                        onChangeText={(name) => this.changeStore('name', name)}
                                    />
                                </Item>
                                {this.renderFieldError('name')}

                                <Item inlineLabel>
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={store.phone}
                                        keyboardType="phone-pad"
                                        onChangeText={(phone) => this.changeStore('phone', phone)}
                                    />
                                </Item>
                                {this.renderFieldError('phone')}

                                <Item inlineLabel>
                                    <Label>Store Address</Label>
                                    <Input
                                        value={store.address}
                                        onChangeText={(address) => this.changeStore('address', address)}
                                    />
                                </Item>
                                {this.renderFieldError('address')}
                            </View>

                            <CardItem button>
                                <Body>
                                    <Button full transparent small onPress={this.showImagePicker }>
                                        <Icon name="camera" />
                                        <Text>Add Photo</Text>
                                    </Button>
                                </Body>
                            </CardItem>
                        </Card>

                        <Card style={[common.halfWidth, common.mt15]}>
                            <CardItem header>
                                <Left>
                                    <Icon name="time" />
                                    <Body>
                                        <Text>{i18n.t('setting.store.timeHeader')}</Text>
                                        <Text note>
                                            {i18n.t('setting.store.timeHint')}
                                        </Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <StoreComponentTimePicker
                                onTimeChange={this.saveTimetable}
                                timetable={store.timetable}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
            </>
        );
    };
};

export default withTracker(props => {
    const user = Meteor.user();
    let store = null, pictures = null;

    if (user && user.profile.storeId) {
        store = findStores({_id: user.profile.storeId})[0];
        pictures = findStorePictures(user.profile.storeId);
    }

    return {...props, store, pictures }
})(SettingContainerStore);