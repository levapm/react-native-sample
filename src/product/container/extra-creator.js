import React from 'react';
import PropTypes from 'prop-types';
import { omit, isEmpty, startCase } from 'lodash';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Form, Item, Label, Input, Button, Text, Spinner, Grid, Row, Col } from 'native-base';

import colors from '../../styles/colors';
import common from '../../styles/common';

import i18n from '../../i18n';
import { saveProductExtra } from '../services/data';
import ProductExtraSchema from '../services/extra-schema';

const emptyInput = {
    name: '',
    price: '',
    description: '',
};

const InputItem = ({ 
    field, value, inputProps={},
    onChange, setFocus,
}) => (
    <>
    <Item stackedLabel>
        <Label>{ startCase(field) }</Label>
        <Input
            value={value}
            returnKeyType="next"
            placeholderTextColor={colors.fadedLight}
            onBlur={() => !!setFocus && setFocus(null)}
            onFocus={() => !!setFocus && setFocus(field)} 
            onChangeText={(value) => onChange(field, value)}
            {...inputProps}
        />
    </Item>
    </>
);

const InputError = ({error}) => !error ? null : (
    <Text style={[common.textWhite, common.pl5, common.fontBold]}>
        {error}
    </Text>
);

class ProductContainerExtraCreator extends React.Component {
    validator = ProductExtraSchema.newContext();

    state = {
        loading: false,
        focusedField: null,
        inputs: {...emptyInput},
    };

    componentDidMount() {
        if (isEmpty(this.props.extra))
            this.setState({inputs: {...emptyInput}});
        else
            this.setState({ inputs: {...this.state.inputs, ...this.props.extra} });
    };

    handleInput = (field, text) => {
        const { inputs } = this.state;
        inputs[field] = text;
        this.setState({ inputs });
    };
    
    setFocus = (focusedField) => this.setState({ focusedField });

    save = () => {
        const { inputs } = this.state;
        inputs.storeId = this.props.user.profile.storeId;
        // these keys exist when editing an existing prod from db
        const validatedInputs = this.validator.clean(omit(inputs, ['_id', '_version']), {
            autoConvert: true
        });

        this.validator.validate(validatedInputs);

        if (!this.validator.isValid()) {
            return this.setState({ errors: this.validator.validationErrors() });
        }

        this.setState({ loading: true });
        
        if (inputs._id) {
            validatedInputs._id = inputs._id;
        } 

        saveProductExtra(validatedInputs, (err, res) => {
            this.setState({ loading: false, inputs: validatedInputs });
        });
    };

    render() {
        const { inputs, loading } = this.state;

        return (
            <>
            <Text style={[common.fontBold, common.fs20, common.px10, common.py20]}>
                { i18n.t(`productExtra.${inputs._id ? 'updateHeader' : 'createHeader'}`) }
            </Text>
            <Form style={[common.pr10]}>
                <Grid>
                    <Row>
                        <Col> 
                            <InputItem
                                onChange={this.handleInput}
                                setFocus={this.setFocus} 
                                value={inputs.name}
                                field='name'
                            />
                            <InputError error={this.validator.keyErrorMessage('name')} />
                        </Col>
                        <Col style={[common.pl15]}>
                            <InputItem
                                inputProps={{keyboardType: "number-pad"}}
                                value={`${inputs.price || ''}`}
                                onChange={this.handleInput}
                                setFocus={this.setFocus} 
                                field='price'
                            />
                            <InputError error={this.validator.keyErrorMessage('price')} />
                        </Col>
                    </Row>
                </Grid>

                <InputItem
                    onChange={this.handleInput}
                    value={inputs.description}
                    setFocus={this.setFocus} 
                    field="description"
                />
                <InputError error={this.validator.keyErrorMessage('description')} />

                <Button
                    block
                    disabled={loading}
                    onPress={this.save}
                    style={[common.mt15, common.ml10]}
                >
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Text>{i18n.t('productExtra.saveButton')}</Text>
                    )}
                </Button>
            </Form>
            </>
        );
    }
};

ProductContainerExtraCreator.propTypes = {
    extra: PropTypes.object,
};

export default withTracker(props => {
    const user = Meteor.user();

    return {
        ...props, user,
    };
})(ProductContainerExtraCreator);