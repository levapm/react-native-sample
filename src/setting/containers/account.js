import React from 'react';
import { debounce } from 'lodash';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Row, Col, Text, Card, Item, Label, Input, View, CardItem, Body, Button, Icon } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { AccountSchema } from '../../user/services/schema';

class SettingContainerAccount extends React.Component {
    validator = AccountSchema.newContext();

    state = {
        errors: null,
        user: null,
    };

    componentDidMount() {
        if (!this.state.user && this.props.user) {
            this.setState({ user: this.props.user });
        }
    };

    debouncedUserUpdate = debounce((user) => {
        this.validator.validate(this.validator.clean(user.profile));

        if (!this.validator.isValid())
            this.setState({ errors: this.validator.validationErrors() });

    }, 300);

    changeUser = (field, value) => {
        const { user } = this.state;
        user.profile[field] = value;

        this.setState({ user });
        this.debouncedUserUpdate(user);
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

    render() {
        const { user } = this.state;

        return (
            <>
                <Row>
                    <Col style={[common.px15, common.py10]}>
                        <Text style={[common.pageHeaderText, common.pb5]}>
                            {i18n.t('setting.account.editorTitle')}
                        </Text>
                        <Text>
                            {i18n.t('setting.account.editorDescription')}
                        </Text>
                    </Col>
                </Row>

                {!!user && (
                    <Row>
                        <Col style={[common.pl10]}>
                            <Card style={[common.halfWidth]}>
                                <View style={[common.px10]}>
                                    <Item inlineLabel>
                                        <Label>First Name</Label>
                                        <Input
                                            value={user.profile.firstName}
                                            onChangeText={(firstName) => this.changeUser('firstName', firstName)}
                                        />
                                    </Item>
                                    {this.renderFieldError('firstName')}

                                    <Item inlineLabel>
                                        <Label>Last Name</Label>
                                        <Input
                                            value={user.profile.lastName}
                                            onChangeText={(lastName) => this.changeUser('lastName', lastName)}
                                        />
                                    </Item>
                                    {this.renderFieldError('lastName')}

                                    <Item inlineLabel>
                                        <Label>Email</Label>
                                        <Input
                                            disabled
                                            value={user.emails[0].address}
                                        />
                                    </Item>
                                </View>
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

    return { ...props, user }
})(SettingContainerAccount);