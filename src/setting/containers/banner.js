import React from 'react';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import {
  Row,
  Col,
  Card,
  Item,
  Label,
  Input,
  Left,
  Switch,
  Body,
  Button,
  Icon,
  Text,
  Right,
  CardItem,
  ListItem
} from "native-base";

import i18n from '../../i18n';
import common from '../../styles/common';
import { saveStore } from '../../store/services/api';
import { findStores } from '../../store/services/data';
import { StoreBannerSchema } from '../../store/services/schema';

const emptyBanner = {
    content: '',
    isActive: true,
};

class SettingContainerBanner extends React.Component {
    validator = StoreBannerSchema.newContext();

    state = {
        editingBanner: {...emptyBanner},
        isSaving: false,
        isBusy: false,
    };

    save = async () => {
        const { editingBanner } = this.state;
        this.validator.validate(this.validator.clean(editingBanner));

        if (this.validator.isValid()) {
            const store = {...this.props.store};

            if (!store.banners) {
                store.banners = [];
            }

            this.setState({ isSaving: true });
            store.banners.push(editingBanner);
            await saveStore(store);
            this.setState({editingBanner: {...emptyBanner}, isSaving: false });
        } else {
            this.setState({ errors: this.validator.validationErrors() });
        }
    };

    toggleActive = async (banner) => {
        const store = {...this.props.store};
        store.banners = store.banners.map(b => {
            if (b.content == banner.content) {
                b.isActive = !b.isActive;
            }

            return b;
        });
        this.setState({ isBusy: true });
        await saveStore(store);
        this.setState({ isBusy: false });
    };

    remove = async (banner) => {
        const store = {...this.props.store};
        store.banners = store.banners.filter(({ content }) => banner.content != content);
        this.setState({ isBusy: true });
        await saveStore(store);
        this.setState({ isBusy: false });
    };

    changeBanner = (field, value) => {
        const { editingBanner } = this.state;
        editingBanner[field] = value;

        this.setState({ editingBanner });
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
        const { store } = this.props;
        const { editingBanner, isSaving } = this.state;

        return (
            <>
            <Row>
                <Col style={[common.px15, common.py10]}>
                    <Text style={[common.pageHeaderText, common.pb5]}>
                        { i18n.t('setting.storeBanner.editorTitle') }
                    </Text>
                    <Text>
                        { i18n.t('setting.storeBanner.editorDescription') }
                    </Text>
                </Col>
            </Row>

            {!!store && (
                <>
                <Row>
                    <Col style={[common.pl10]}>
                        <Card style={[common.halfWidth]}>
                            <CardItem>
                                <Item inlineLabel>
                                    <Label>{ i18n.t('setting.storeBanner.contentLabel') }</Label>
                                    <Input
                                        value={editingBanner.content}
                                        onChangeText={(content) => this.changeBanner('content', content)}
                                    />
                                </Item>
                                {this.renderFieldError('content')}
                            </CardItem>

                            <CardItem bordered>
                                <Left>
                                    <Text>{ i18n.t('setting.storeBanner.activeLabel') }</Text>
                                </Left>
                                <Right>
                                    <Switch 
                                        value={editingBanner.isActive} 
                                        onValueChange={() => this.changeBanner('isActive', !editingBanner.isActive)}
                                    />
                                </Right>
                            </CardItem>
                            {this.renderFieldError('isActive')}

                            <CardItem button bordered>
                                <Body>
                                    <Button 
                                        full 
                                        small 
                                        transparent
                                        disabled={isSaving} 
                                        onPress={ this.save }
                                    >
                                        <Icon name="megaphone" />
                                        <Text>{ i18n.t('setting.storeBanner.saveButton') }</Text>
                                    </Button>
                                </Body>
                            </CardItem>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col style={[common.px15, common.py10]}>
                        <Text style={[common.pageHeaderText, common.pb5]}>
                            { i18n.t('setting.storeBanner.listTitle') }
                        </Text>
                        <Text>
                            { i18n.t('setting.storeBanner.listDescription') }
                        </Text>
                    </Col>
                </Row>
                
                {(store.banners && store.banners.length > 0) ? store.banners.map(banner => (
                    <Row key={`store_banner_${banner.content}`}>
                        <Col>
                            <ListItem>
                                <Body>
                                    <Text>
                                        { banner.content }
                                    </Text>
                                </Body>
                                <Right>
                                    <Button 
                                        small
                                        transparent
                                        disabled={this.state.isBusy}
                                        onPress={() => this.toggleActive(banner)}
                                    >
                                        <Text>
                                            { i18n.t(`setting.storeBanner.${banner.isActive ? 'hideButton' : 'showButton'}`) }
                                        </Text>
                                    </Button>
                                </Right>
                                <Right>
                                    <Button 
                                        small
                                        danger
                                        transparent
                                        disabled={this.state.isBusy}
                                        onPress={() => this.remove(banner)}
                                    >
                                        <Text>
                                            { i18n.t(`setting.storeBanner.removeButton`) }
                                        </Text>
                                    </Button>
                                </Right>
                            </ListItem>
                        </Col>
                    </Row>
                )) : (
                    <Row>
                        <Col>
                            <ListItem noBorder>
                                <Text note>
                                    { i18n.t('setting.storeBanner.emptyMessage') }
                                </Text>
                            </ListItem>
                        </Col>
                    </Row>
                )}
                </>
            )}
            </>
        );
    };
};

export default withTracker(props => {
    const user = Meteor.user();
    let store = null;

    if (user && user.profile.storeId) {
        store = findStores({_id: user.profile.storeId})[0];
    }

    return {...props, store }
})(SettingContainerBanner);