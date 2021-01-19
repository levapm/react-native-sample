import React from 'react';
import PropTypes from 'prop-types';
import { omit, clone, startCase } from 'lodash';
import { Form, Item, Label, Icon, Input, Button, Text, Spinner, Grid, Row, Col, ListItem, Left, Body } from 'native-base';

import colors from '../../styles/colors';
import common from '../../styles/common';
import coloredForm from '../../styles/colored-form';

import i18n from '../../i18n';
import { saveProduct } from '../services/api';
import ProductSchema from '../services/schema';
import ProductContainerExtraList from './extra-list';
import { takePhoto } from '../../image/services/helpers';
import PrimaryHeader from '../../shared/component/primary-header';

const emptyVariation = {
    name: '',
    price: '',
    description: '',
};

const InputItem = ({ 
    field, value, placeholder, inputProps={},
    onChange, setFocus,
}) => (
    <>
    <Label style={[coloredForm.label]}>{ startCase(field) }</Label>
    <Item 
        rounded
        style={[coloredForm.item]}
    >
        <Input
            value={value}
            returnKeyType="next"
            placeholder={placeholder}
            style={[coloredForm.input]}
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

class ProductContainerCreator extends React.Component {
    validator = ProductSchema.newContext();

    state = {
        inputs: {
            pictures: [],
            extraIds: [],
            variations: [],
        },
        loading: false,
        focusedField: null,
    };

    componentDidMount() {
        if (this.props.product)
            this.setState({ inputs: {...this.state.inputs, ...this.props.product} });
    };

    placeholderText(fieldName) {
        const placeholders = {
            name: i18n.t('product.creator.namePlaceholder'),
            description: i18n.t('product.creator.descriptionPlaceholder'),
            category: i18n.t('product.creator.categoryPlaceholder'),
            price: i18n.t('product.creator.pricePlaceholder'),
        };

        if (this.state.focusedField === fieldName)
            return "";

        return placeholders[fieldName];
    };

    handleInput = (field, text) => {
        const { inputs } = this.state;

        inputs[field] = text;

        this.setState({ inputs });
        this.props.onChange(inputs);
    };
    
    setFocus = (focusedField) => this.setState({ focusedField });

    handleVarietyInput(field, i, text) {
        const { inputs } = this.state;
        
        inputs.variations[i][field] = text;

        this.setState({ inputs });
        this.props.onChange(inputs);
    };

    handleExtraPress = (extra) => {
        const { inputs } = this.state;

        if (inputs.extraIds.indexOf(extra._id) >= 0) {
            inputs.extraIds = inputs.extraIds.filter(e => e !== extra._id);
        } else {
            inputs.extraIds = [...inputs.extraIds, extra._id];
        }

        this.setState({ inputs });
        this.props.onChange(inputs);
    };

    save = async () => {
        const { inputs } = this.state;
        // these keys exist when editing an existing prod from db
        const validatedInputs = this.validator.clean(omit(inputs, ['pictures', '_id', '_version']), {
            autoConvert: true
        });
        this.validator.validate(validatedInputs);

        // console.log('valid', inputs, this.validator.validationErrors());
        if (!this.validator.isValid()) {
            return this.setState({ errors: this.validator.validationErrors() });
        }

        this.setState({ loading: true });
        
        const productId = await saveProduct({...inputs, ...validatedInputs});
        this.setState({ loading: false });

        if (productId)
            this.props.onComplete();
    };

    addVariation = () => {
        const { inputs } = this.state;

        inputs.variations.push(clone(emptyVariation));
        this.setState({inputs});
    };

    showImagePicker = async () => {
        const uri = await takePhoto(true);

        if (!uri)
            return;

        const { inputs } = this.state;

        this.handleInput('pictures', [{ uri }, ...inputs.pictures]);
    };

    render() {
        const { inputs, loading } = this.state;

        return (
            <>
            <PrimaryHeader 
                icon="cart"
                text="Add New Product"
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
                <Button
                    light
                    transparent
                    disabled={loading}
                    onPress={this.showImagePicker}
                >
                    <Icon name="camera"/>
                </Button>
                
            </PrimaryHeader>

            <Form style={[common.px10]}>
                <InputItem
                    placeholder={this.placeholderText("name")}
                    onChange={this.handleInput}
                    setFocus={this.setFocus} 
                    value={inputs.name}
                    field='name'
                />
                <InputError error={this.validator.keyErrorMessage('name')} />


                <InputItem
                    placeholder={this.placeholderText("description")}
                    onChange={this.handleInput}
                    value={inputs.description}
                    setFocus={this.setFocus} 
                    field="description"
                />
                <InputError error={this.validator.keyErrorMessage('name')} />

                <Grid>
                    <Row>
                        <Col>
                            <InputItem
                                placeholder={this.placeholderText("category")}
                                onChange={this.handleInput}
                                setFocus={this.setFocus} 
                                value={inputs.category}
                                field="category"
                            />
                            <InputError error={this.validator.keyErrorMessage('category')} />
                        </Col>
                        <Col style={[common.pl15]}>
                            <InputItem
                                placeholder={this.placeholderText("price")}
                                inputProps={{keyboardType: "number-pad"}}
                                value={`${inputs.price || ''}`}
                                onChange={this.handleInput}
                                setFocus={this.setFocus} 
                                field='price'
                            />
                            <InputError error={this.validator.keyErrorMessage('price')} />
                        </Col>
                    </Row>

                    {inputs.variations.map((variety, i) => (
                        <React.Fragment key={i}>
                            <Row>
                                <Col>
                                    <InputItem
                                        onChange={(field, value) => this.handleVarietyInput('name', i, value)}
                                        placeholder={this.placeholderText("variationName")}
                                        field='variationName'
                                        value={variety.name}
                                    />
                                </Col>
                                <Col style={[common.pl15]}>
                                    <InputItem
                                        onChange={(field, value) => this.handleVarietyInput('price', i, value)}
                                        placeholder={this.placeholderText("variationPrice")}
                                        inputProps={{keyboardType: "number-pad"}}
                                        value={`${variety.price || ''}`}
                                        field='variationPrice'
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputItem
                                        onChange={(field, value) => this.handleVarietyInput('description', i, value)}
                                        placeholder={this.placeholderText("variationDescription")}
                                        field='variationDescription'
                                        value={variety.description}
                                    />
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))}

                    <Row>
                        <Col style={[common.pt20]}>
                            <ListItem button noBorder onPress={this.addVariation}>
                                <Left>
                                    <Icon 
                                        name="add" 
                                        style={[common.textLight]}
                                    />

                                    <Body>
                                        <Text style={[common.textLight]}>
                                            {i18n.t('product.creator.addVariationButton')}
                                        </Text>
                                    </Body>
                                </Left>
                            </ListItem>
                        </Col>
                    </Row>
                </Grid>
            </Form>

            <ListItem button noBorder>
                <Left>
                    <Body>
                        <Text style={[common.textLight]}>
                            {i18n.t('product.creator.manageExtraHeader')}
                        </Text>
                    </Body>
                </Left>
            </ListItem>
            <ProductContainerExtraList
                inverted={true}
                selectedIds={inputs.extraIds}
                onPress={this.handleExtraPress}
            />
            </>
        );
    }
};

ProductContainerCreator.propTypes = {
    onComplete: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    product: PropTypes.object,
};

export default ProductContainerCreator;