import React from 'react';
import { Alert } from "react-native";
import Dialog from "react-native-dialog";
import { Button, Text } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { addItemToBasket, actuallyEmptyBasket } from '../services/basket';
import { OrderStatesEnum, OrderProcessingTimesEnum } from '../constants';
import { rejectOrder, completeOrder, acceptOrder } from '../services/api';

class OrderContainerActions extends React.Component {
    state = {
        rejectModalShown: false,
        rejectReason: '',
    };

    handleRejection = async () => {
        try {
            const { order } = this.props;
            await rejectOrder(order._id, this.state.rejectReason);
            const showSuccessAlert = () => setTimeout(() => 
                Alert.alert(i18n.t('order.reject.successTitle'), i18n.t('order.reject.successDescription', order))
            , 1000);
            this.setState({ rejectReason: '', rejectModalShown: false }, showSuccessAlert);
        } catch (err) {
            const showErrorAlert = () => setTimeout(() =>
                Alert.alert(i18n.t('order.reject.errorTitle'), i18n.t('order.reject.errorDescription', err))
            , 1000);
            this.setState({ rejectModalShown: false }, showErrorAlert);
        }
    };

    handleCompletion = async () => {
        Alert.alert(
            i18n.t('order.complete.modalTitle'), 
            i18n.t('order.complete.modalDescription'),
            [
                {text: i18n.t('order.complete.cancelText'), style: 'cancel' },
                {text: i18n.t('order.complete.buttonText'), onPress: async () => {
                    try {
                        const { order } = this.props;
                        await completeOrder(order._id);
                        Alert.alert(i18n.t('order.complete.successTitle'), i18n.t('order.complete.successDescription', order));
                    } catch (err) {
                        Alert.alert(i18n.t('order.complete.errorTitle'), i18n.t('order.complete.errorDescription', err))
                    }
                }}
            ]
        );
    };

    accept = async (eta) => {
        try {
            const { order } = this.props;
            await acceptOrder(order._id, eta);
            Alert.alert(i18n.t('order.processing.successTitle'), i18n.t('order.processing.successDescription', order));
        } catch (err) {
            Alert.alert(i18n.t('order.processing.errorTitle'), i18n.t('order.processing.errorDescription', err))
        }
    };

    handleProcessing = async () => {
        const minuteButtons = Object.values(OrderProcessingTimesEnum).map(eta => ({
            text: eta, onPress: () => this.accept(eta)
        }));

        Alert.alert(
            i18n.t('order.processing.modalTitle'), 
            i18n.t('order.processing.modalDescription'),
            [
                {text: i18n.t('order.processing.cancelText'), style: 'cancel' },
                ...minuteButtons
            ]
        );
    };

    renderRejectModal () {
        return (
            <Dialog.Container visible={this.state.rejectModalShown}>
                <Dialog.Title>{ i18n.t('order.reject.modalTitle') }</Dialog.Title>
                <Dialog.Description>{ i18n.t('order.reject.modalDescription')}</Dialog.Description>
                <Dialog.Input 
                    value={this.state.rejectReason}
                    onChangeText={(rejectReason) => this.setState({ rejectReason })}
                />
                <Dialog.Button 
                    label={i18n.t('order.reject.cancelText')}
                    onPress={() => this.setState({ rejectModalShown: false })} 
                />
                <Dialog.Button 
                    onPress={this.handleRejection} 
                    label={i18n.t('order.reject.buttonText')}
                    disabled={this.state.rejectReason.length < 3}
                />
            </Dialog.Container>
        );
    };

    handleRecreate = () => {
        actuallyEmptyBasket();
        this.props.order.productData.map(prod=> {
            const variations = prod.variations.reduce((all, variation) => {
                all[variation.name] = variation;
                return all;
            }, {});
            addItemToBasket(prod.product, variations, prod.total, prod.extras);
        });
        this.props.onRecreate();
    };

    render () {
        const { order } = this.props;
        const canAccept = order.status === OrderStatesEnum.PENDING;
        const canReject = order.status === OrderStatesEnum.PENDING;
        const canComplete = order.status === OrderStatesEnum.PROCESSING;

        return (
            <>
                {this.renderRejectModal()}
                <Button 
                    small 
                    primary 
                    style={[common.ml10]}
                    onPress={this.handleRecreate}
                >
                    <Text>{i18n.t('order.detail.recreateText')}</Text>
                </Button>
                {canAccept && (
                    <Button 
                        small 
                        success 
                        style={[common.ml10]}
                        onPress={this.handleProcessing}
                    >
                        <Text>{i18n.t('order.detail.acceptText')}</Text>
                    </Button>
                )}
                {canReject && (
                    <Button 
                        small 
                        warning 
                        style={[common.ml10]}
                        onPress={() => this.setState({ rejectModalShown: true })}
                    >
                        <Text>{i18n.t('order.reject.buttonText')}</Text>
                    </Button>
                )}
                {canComplete && (
                    <Button 
                        small 
                        warning 
                        style={[common.ml10]}
                        onPress={this.handleCompletion}
                    >
                        <Text>{i18n.t('order.complete.buttonText')}</Text>
                    </Button>
                )}
            </>
        );
    }
};

export default OrderContainerActions;