import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const getSpotlightDropdownData = () => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    const actions = [
        {
            group: t('Core'),
            actions: [
                {
                    id: 'customer',
                    label: t('Customer'),
                    description: t('WhereWePresentTheCustomerInformation'),
                    onClick: () => navigate('/core/customer'),
                },
                {
                    id: 'user',
                    label: t('User'),
                    description: t('WhereWePresentTheUserInformation'),
                    onClick: () => navigate('/core/user'),
                },
                {
                    id: 'vendor',
                    label: t('Vendor'),
                    description: t('WhereWePresentTheVendorInformation'),
                    onClick: () => navigate('/core/vendor'),
                },
            ],
        },

        {
            group: t('Inventory'),
            actions: [
                {
                    id: 'category',
                    label: t('Category'),
                    description: t('WhereWePresentTheCategoryInformation'),
                    onClick: () => navigate('/inventory/category'),
                },
                {
                    id: 'category-group',
                    label: t('CategoryGroup'),
                    description: t('WhereWePresentTheCategoryGroupInformation'),
                    onClick: () => navigate('/inventory/category-group'),
                },
                {
                    id: 'product',
                    label: t('Product'),
                    description: t('WhereWePresentTheProductInformation'),
                    onClick: () => navigate('/inventory/product'),
                },
                {
                    id: 'configuration',
                    label: t('Configuration'),
                    description: t('WhereWePresentTheConfigurationInformation'),
                    onClick: () => navigate('/inventory/config'),
                },
                {
                    id: 'sales',
                    label: t('Sales'),
                    description: t('WhereWePresentTheSalesInformation'),
                    onClick: () => navigate('/inventory/sales'),
                },
                {
                    id: 'sales-invoice',
                    label: t('ManageInvoice'),
                    description: t('WhereWePresentTheSalesInvoiceInformation'),
                    onClick: () => navigate('/inventory/sales-invoice'),
                },
                {
                    id: 'purchase',
                    label: t('Purchase'),
                    description: t('WhereWePresentThePurchaseInformation'),
                    onClick: () => navigate('/inventory/purchase'),
                },
                {
                    id: 'manage-purchase',
                    label: t('ManagePurchase'),
                    description: t('WhereWePresentThePurchaseInvoiceInformation'),
                    onClick: () => navigate('/inventory/purchase-invoice'),
                },
            ],
        },

        {
            group: t('Domain'),
            actions: [
                {
                    id: 'domain',
                    label: t('Domain'),
                    description: t('WhereWePresentTheDomainInformation'),
                    onClick: () => navigate('/domain'),
                },
            ],
        },
        {
            group: t('Accounting'),
            actions: [
                {
                    id: 'transaction-mode',
                    label: t('TransactionMode'),
                    description: t('WhereWePresentTheTransactionModeInformation'),
                    onClick: () => navigate('/accounting/transaction-mode'),
                },
            ],
        },
    ];

    return actions;
};

export default getSpotlightDropdownData;
