import React from 'react';
import PropTypes from 'prop-types';
import { omit, pick } from 'lodash';
import { addDays, format } from 'date-fns';
import { TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Form, Item, Label, Icon, Input, Button, Text, Spinner, Grid, Row, Col, Radio, Body, ListItem, Left, Right } from 'native-base';

import colors from '../../styles/colors';
import common from '../../styles/common';
import coloredForm from '../../styles/colored-form';

import i18n from '../../i18n';
import { PackTypes } from '../constants';
import { savePack } from '../services/api';
import PackSchema from '../services/schema';

import PrimaryHeader from '../../shared/component/primary-header';
import PackComponentTypePicker from '../components/type-picker';

class PackContainerCreator extends React.Component {
    validator = PackSchema.omit('storeId').newContext();

    state = {
        inputs: {
            points: 0,
            isActive: true,
            type: PackTypes.PRODUCT_TOTAL,
        },
        loading: false,
        focusedField: null,
    };

    componentDidMount() {
        if (this.props.pack)
            this.setState({ inputs: {...this.state.inputs, ...this.props.pack} });
    };

    placeholderText(fieldName) {
        const placeholders = {
            title: i18n.t('pack.creator.titlePlaceholder'),
        };

        if (this.state.focusedField === fieldName)
            return "";

        return placeholders[fieldName];
    };

    handleInput(field, text) {
        const { inputs } = this.state;

        if (['points', 'requiredValue'].indexOf(field) >= 0)
            inputs[field] = parseInt(text);
        else 
            inputs[field] = text;

        if (field === 'type' && [PackTypes.PRODUCT_QTY, PackTypes.PRODUCT_TOTAL].indexOf(text) < 0) {
            delete inputs['product'];
        }

        this.setState({ inputs });
        this.props.onChange(inputs);
    };

    save = async () => {
        const { inputs } = this.state;
        // these keys exist when editing an existing prod from db
        const cleanedInputs = this.validator.clean(omit(inputs, ['_id', '_version']));
        this.validator.validate(cleanedInputs);

        if (!this.validator.isValid()) {
            return this.setState({ errors: this.validator.validationErrors() });
        }

        this.setState({ loading: true });
        
        const packId = await savePack(inputs);
        this.setState({ loading: false });

        if (packId)
            this.props.onComplete();
    };
    
    showProductPicker = () => {
        const { inputs } = this.state;

        this.props.navigation.navigate('ProductPageSearch', {
            selectedProduct: inputs.product,
            handleProductSelect: (prod) => {
                if (!!prod) {
                    this.handleInput('product', pick(prod, ['_id', 'name', 'category', 'variation']));
                } else {
                    this.handleInput('product', null);
                }
            },
        });
    };

    renderFieldError(field) {
        const error = this.validator.keyErrorMessage(field);

        if (!error)
            return null;

        return (
            <Text style={[common.textWhite, common.pl5, common.fontBold]}>
                {this.validator.keyErrorMessage(field)}
            </Text>
        )
    };

    render() {
        const { inputs, loading } = this.state;

        return (
            <>
            <PrimaryHeader 
                icon="cube"
                text="Add New Pack"
            >

                { loading && <Spinner size="small" color={colors.light} style={{height: 45}} /> }
                
                <Button
                    light
                    transparent
                    disabled={loading}
                    onPress={this.props.onComplete}
                >
                    <Icon name="close-circle"/>
                </Button>
                <Button
                    light
                    transparent
                    disabled={loading}
                    onPress={this.save}
                >
                    <Icon name="checkmark-circle-outline"/>
                </Button>
                
            </PrimaryHeader>

            <Form style={[common.px10]}>
                <Grid>
                    <Row>
                        <Col size={3}>
                            <Label style={[coloredForm.label]}>Title</Label>
                            <Item 
                                rounded
                                style={[coloredForm.item]}
                            >
                                <Input
                                    name="title"
                                    value={inputs.title}
                                    returnKeyType="next"
                                    style={[coloredForm.input]}
                                    ref={ref => (this._title = ref)}
                                    placeholderTextColor={colors.fadedLight}
                                    placeholder={this.placeholderText("title")}
                                    onChangeText={this.handleInput.bind(this, 'title')}
                                    onBlur={() => this.setState({ focusedField: null })}
                                    onFocus={() => this.setState({ focusedField: 'title' })} />
                            </Item>
                            {this.renderFieldError('title')}
                        </Col>
                        <Col size={1} style={[common.pl15]}>
                            <Label style={[coloredForm.label]}>Points</Label>
                            <Item
                                rounded
                                style={[coloredForm.item]}
                            >
                                <Input
                                    name="points"
                                    returnKeyType="next"
                                    keyboardType="number-pad"
                                    style={[coloredForm.input]}
                                    value={`${inputs.points || ''}`}
                                    ref={ref => (this._points = ref)}
                                    placeholderTextColor={colors.fadedLight}
                                    placeholder={this.placeholderText("points")}
                                    onBlur={() => this.setState({ focusedField: null })}
                                    onChangeText={this.handleInput.bind(this, 'points')}
                                    onFocus={() => this.setState({ focusedField: 'points' })}
                                />
                            </Item>
                            {this.renderFieldError('requiredPoints')}
                        </Col>
                    </Row>
                </Grid>

                <Label style={[coloredForm.label]}>Set the pack type</Label>
                <PackComponentTypePicker
                    pack={inputs}
                    onSelect={this.handleInput.bind(this, 'type')}
                />

                <Grid>
                    <Row>
                        <Col>
                            <Label style={[coloredForm.label]}>
                                {i18n.t(`pack.creator.requiredValueLabel.${inputs.type}`)}
                            </Label>
                            <Item
                                rounded
                                style={[coloredForm.item]}
                            >
                                <Input
                                    name="requiredValue"
                                    value={`${inputs.requiredValue || ''}`}
                                    returnKeyType="next"
                                    style={[coloredForm.input]}
                                    ref={ref => (this._requiredValue = ref)}
                                    placeholderTextColor={colors.fadedLight}
                                    placeholder={this.placeholderText("requiredValue")}
                                    onChangeText={this.handleInput.bind(this, 'requiredValue')}
                                    onBlur={() => this.setState({ focusedField: null })}
                                    onFocus={() => this.setState({ focusedField: 'requiredValue' })} />
                            </Item>
                            {this.renderFieldError('requiredValue')}
                        </Col>

                        {[PackTypes.PRODUCT_QTY, PackTypes.PRODUCT_TOTAL].indexOf(inputs.type) >= 0 && (
                            <Col style={common.pl15}>
                                <Label style={[coloredForm.label]}>Select Product</Label>
                                <TouchableOpacity 
                                    onPress={this.showProductPicker}
                                    style={[common.pl5, common.pb15]}
                                >   
                                    {!inputs.product ? (
                                        <Text style={common.textWhite}>
                                            No Product Selected
                                        </Text>
                                    ) : (
                                        <>
                                            <Text style={[common.textWhite, common.fontBold]}>
                                                {inputs.product.name}
                                            </Text>
                                            <Text style={common.textWhite}>
                                                {inputs.product.category}
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                {this.renderFieldError('product')}
                            </Col>
                        )}
                    </Row>

                </Grid>

                <ListItem
                    button
                    noIndent
                    noBorder
                    style={[common.pl0, common.pt20]}
                    onPress={() => this.handleInput('isActive', !inputs.isActive)}
                >
                    <Left>
                        <Body>
                            <Text style={common.textWhite}>
                                {i18n.t('pack.creator.activeText')}
                            </Text>
                            <Text note style={common.textWhite}>
                                {i18n.t('pack.creator.activeDescription')}
                            </Text>
                        </Body>
                    </Left>
                    <Right>
                        <Radio
                            color={colors.fadedLight}
                            selected={inputs.isActive}
                            selectedColor={colors.light}
                        />
                    </Right>
                </ListItem>
            </Form>
            </>
        );
    }
};

PackContainerCreator.propTypes = {
    onComplete: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    pack: PropTypes.object,
};

export default withNavigation(PackContainerCreator);