export default {
    home: {
        title: 'Welcome'
    },
    datepicker: {
        thisWeek: 'This Week',
        lastWeek: 'Last Week',
        thisMonth: 'This Month',
        lastMonth: 'Last Month',
    },
    stat: {
        dateGroup: {
            title: 'Orders by date',
        },
        summary: {
            title: 'Order Total',
            customers: 'Customers',
            orders: 'Orders',
            total: 'Total$',
        },
    },
    productExtra: {
        listButton: 'Extras',
        addHeader: 'Add Extra',
        saveButton: 'Save Extra',
        listHeader: 'Extras per item',
        createHeader: 'New Product Extra',
        updateHeader: 'Update Product Extra',
        addSubHeader: 'Will be added to each of the %{itemCount} items',
    },
    product: {
        empty: 'No orders found',
        selectCreateHint: "Select a product from the list on the left to get started. To add new product, press the plus button on the right.",
        noProductFound: "No Products at the store right now",
        createButtonText: "Create Product",
        preview: {
            noName: "Catchy/Descriptive name",
            noPrice: "0",
            noDescription: "Describe the product in clear, concise way to express the value customers get out of it.",
        },
        creator: {
            namePlaceholder: "Give it a catchy name",
            descriptionPlaceholder: "Short and concise description",
            categoryPlaceholder: "Pizza, Drinks etc.",
            pricePlaceholder: "",
            addVariationButton: "Add Variation",
            manageExtraHeader: "Manage Extras",
        },
        search: {
            header: 'Select Product',
            noSelection: 'Select a product from the list to see more details'
        },
    },
    point: {
        awardConfirmTitle: "Award {{points}} Points?",
        awardConfirmMessage: "Please confirm that you want to award {{points}} points to {{customerName}}.",
        awardSuccessTitle: "{{points}} Points Awarded",
        awardSuccessMessage: "{{customerName}} has been awarded {{points}} points.",
    },
    setting: {
        pageTitle: "Settings",
        pageNames: {
            store: 'Store',
            banner: 'Banner',
            account: 'Account',
            order: 'Order Settings',
        },
        store: {
            timeHeader: 'Set Timetable',
            timeHint: 'Let customers know your opening hours. Keep it updated for holidays.',
            editorTitle: 'Update Store Details',
            editorDescription: "Changes are live, any changes you make here will be updated on customer's side in realtime",
        },
        storeBanner: {
            saveButton: 'Save Banner',
            editorTitle: 'Store Banner',
            listTitle: 'Current Banners',
            contentLabel: 'Banner Text',
            activeLabel: 'Show Banner?',
            editorDescription: 'Make announcements for your customers',

            listDescription: 'Already created banners',
            emptyMessage: 'No prior announcements. Create and publish announcements using from the above form.', 
            
            hideButton: 'Hide',
            showButton: 'Show',
            removeButton: 'Remove',
        },
        account: {
            editorTitle: 'Update Account Details',
            editorDescription: "Changes are live, any changes you make here will be updated on customer's side in realtime",
        },
        order: {
            editorTitle: 'Order Settings',
            editorDescription: "Tweak your store's order preferences such as, online orders, delivery/pick up etc.",
            homeDeliveryLabel: 'Home Delivery',
            homeDeliveryHint: 'More settings related to home delivery are available underneath',
            homeDeliveryRadiusLabel: 'Delivery Radius {{radius}}m',
            homeDeliveryRadiusHint: 'Set the area within which you can delivery',
            storePickupLabel: 'Allow in store pickups',
            storePickupHint: "Your store's opening-closing hours will be shown as in store pickup time to customers",
            onlineOrderLabel: 'Accept Orders Online',
            deliveryHeader: 'Delivery Settings',
        }
    },
    order: {
        tipLabel: 'Tip',
        paymentMethods: {
            account_balance: 'Rift Balance',
            cash: 'Cash',
        },
        deliveryMethods: {
            home_delivery: 'Home Delivery',
            store_pickup: 'Store Pickup',
        },
        detail: {
            noteLabel: "Customer's note",
            summaryText: 'Order Summary',
            recreateText: 'Recreate',
            acceptText: 'Accept',
        },
        processing: {
            buttonText: 'Accept',
            cancelText: 'Cancel',
            modalTitle: 'Accept Order',
            modalDescription: 'Please select an estimated time it will take for the order to be ready for pickup/delivery.',
            successTitle: 'Order Processing',
            successDescription: 'Order {{uid}} is now being processed. Customer has been notified about the ETA.',
            errorTitle: 'Error accepting',
            errorDescription: 'Error accepting the order. {{ reason }}',
        },
        reject: {
            buttonText: 'Reject',
            cancelText: 'Cancel',
            modalTitle: 'Reject Order',
            modalDescription: 'Please attach a note for the customer explaining why the order is being rejected',
            successTitle: 'Order rejected',
            successDescription: 'Order {{uid}} has been rejected and the customer has been notified.',
            errorTitle: 'Error rejecting',
            errorDescription: 'Error rejecting the order. {{ reason }}',
        },
        complete: {
            buttonText: 'Mark As Complete',
            cancelText: 'Cancel',
            modalTitle: 'Order Delivered/Picked up?',
            modalDescription: 'Marking the order as complete will keep your order feed clean and easy to navigate around.',
            successTitle: 'Order completed',
            successDescription: 'Order {{uid}} has been delivered/picked up. It will be moved away from your default order feed.',
            errorTitle: 'Error completing',
            errorDescription: 'Error marking the order as complete. {{ reason }}',
        },
        place: {
            errorTitle: 'Error Placing Order',
            confirmTitle: 'Place Order?',
            confirmMessage: "Order will show up in the customer's order history.",
        },
        history: {
            empty: 'No Orders Found',
            pageTitle: 'Order History'
        },
        basket: {
            place: 'Order',
            empty: 'Clear',
            pageTitle: 'Your Basket',
            emptyMessage: 'Your basket is empty',
            emptyConfirmTitle: 'Empty your basket?',
            emptyConfirmMessage: 'All items from your basket will be cleared.',
            storeChangeTitle: 'Switch Store?',
            storeChangeMessage: 'You have some items in your basket from a different store. If you add these items, your previously added items will be removed from your basket.',
            storeChangeConfirm: 'Add Anyway',
            storeChangeCancel: 'Cancel',
        },
        finalize: {
            needsRecharge: 'Customer does not have enough balance to pay for this order',
            paymentLabel: 'Choose payment method',
            deliveryLabel: 'Choose delivery method',
            deliveryAddressLabel: 'Choose delivery address',
        },
    },
    user: {
        checkedIn: {
            firstTimeHintTitle: 'First Time Check In',
            firstTimeHintMessage: 'This customer is checking through rift app for the first time ever. Feel free to pitch special offers to them!',
            errprCheckOutTitle: 'Error Checking Out Customer',
            confirmCheckOutTitle: 'Check Customer Out?',
            confirmCheckOutMessage: 'Only check out customer if you have already handled attended to their need or they have accidentally checked in or they have left the store long time ago',
            confirmCheckOutCancel: 'Keep Checked In',
            confirmCheckOutOk: 'Check Out',
            noSelection: 'Customers will show up on the left side list as they check in. Select a customer from the list to start processing.'
        }
    },
    userNote: {
        remove: {
            confirmButton: 'Remove Note',
            cancelButton: 'Cancel',
            title: 'Remove Note?',
            description: 'Sure you want to remove this note?'
        },
        creator: {
            saveButton: 'Save Note',
        },
        list: {
            header: 'Notes For Customer',
            empty: 'No notes added for the customer',
        },
    },
    reward: {
        empty: 'No Rewards Found',
        removeConfirmCancel: 'Keep It',
        removeConfirmOk: 'Remove It',
        removeConfirmTitle: "Remove {{title}}?",
        removeConfirmMessage: "Removing reward is irreversible action. Make sure you are not removing a reward that has been awarded before.",
        removeSuccessTitle: 'Reward Removed',
        removeSuccessMessage: `{{title}} has been removed from your store`,
        redeem: {
            typeProductDetail: "{{rewardValue}} Free {{productName}}",
            typeCashbackDetail: "${{rewardValue} OFF total spending",
            typePercentageDetail: "{{rewardValue}}% OFF total spending",
            header: 'Redeem Points',
            confirmTitle: "Confirm Reward",
            confirmMessage: "Please confirm that {{customerName}} is redeeming {{requiredPoints}} pts for \"{{title}}\".",
            successTitle: "{{customerName}} Rewarded",
            successMessage: "{{customerName}} has been rewarded and {{requiredPoints}} points has been subtracted from their account.",
            buttonText: "Redeem"
        },
        creator: {
            namePlaceholder: "Give it a catchy name",
            activeText: "Is the reward active?",
            typeText: {
                cash: 'CashBack',
                product: 'Product',
                percentage: '% Sale',
            },
        },
        home: {
            pageTitle: 'Rewards',
            createText: 'Add New'
        },
        detail: {
            winnerHeader: 'Winner History',
            noWinners: 'No customer has redeemed this reward.'
        },
    },
    pack: {
        empty: 'No Packs Found',
        removeConfirmCancel: 'Keep It',
        removeConfirmOk: 'Remove It',
        removeConfirmTitle: "Remove {{title}}?",
        removeConfirmMessage: "Removing pack is irreversible action. Make sure you are not removing a pack that has been awarded before.",
        removeSuccessTitle: 'Pack Removed',
        removeSuccessMessage: `{{title}} has been removed from your store`,
        award: {
            typeText: {
                productTotal: "Spent at least ${{packValue}} on {{productName}}",
                orderTotal: "Spent at least ${{packValue}} on order",
                productQty: "Purchased {{packValue}} items of {{productName}}",
            },
            header: 'Point Packs',
            confirmTitle: "Confirm Points",
            confirmMessage: "Please confirm that {{customerName}} is redeeming {{points}} pts for \"{{title}}\".",
            successTitle: "{{customerName}} Packed",
            successMessage: "{{customerName}} has been packed and {{requiredPoints}} points has been subtracted from their account.",
            buttonText: "Award"
        },
        creator: {
            titlePlaceholder: "Something that helpful for employees only",
            activeText: "Is the pack active?",
            activeDescription: "Deactivating won't remove the pack, just hide it from the award panel.",
            previewTitle: "Change the inputs on the left hand side panel and the preview below will show you how this pack will appear throughout the app.",
            typeTitle: {
                productTotal: 'Total spending on a product',
                orderTotal: 'Total spending on an order',
                productQty: 'Total qty of a product',
            },
            typeDescription: {
                productTotal: 'For spending above (or below) a certain amount of $ on a specific product.',
                productQty: 'For buying a total number of items of a specific product.',
                orderTotal: 'For spending above (or below) a certain amount of $ on an order',
            },
            requiredValueLabel: {
                productTotal: 'Minimum total',
                orderTotal: 'Minimum total',
                productQty: 'Minimum items',
            }
        },
        home: {
            pageTitle: 'Packs',
            createText: 'Add New'
        },
        detail: {
            customerHeader: 'History',
            noCustomers: 'No customer has earned this pack.'
        },
    },
};