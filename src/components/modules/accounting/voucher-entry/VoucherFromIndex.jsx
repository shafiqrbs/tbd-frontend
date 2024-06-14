import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button,
    rem,
    Flex,
    Grid,
    Box,
    ScrollArea,
    Group,
    Text,
    Title,
    Alert,
    List,
    Stack,
    SimpleGrid,
    Image,
    Tooltip,
    Center,
    Container,
    CloseButton, TextInput, GridCol
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy, IconInfoCircle, IconPlus, IconRestore, IconSearch,
    IconCreditCardPay,
    IconCreditCardRefund
} from "@tabler/icons-react";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

import {
    getExecutiveDropdown, getLocationDropdown,
} from "../../../../store/core/utilitySlice.js";
import {
    setEntityNewData,
    setFetching,
    setValidationData,
    storeEntityData,
    storeEntityDataWithFile
} from "../../../../store/accounting/crudSlice.js";

import Shortcut from "../../shortcut/Shortcut.jsx";
import InputForm from "../../../form-builders/InputForm.jsx";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import VoucherTable from "./VoucherTable.jsx";
import InputNumberForm from "../../../form-builders/InputNumberForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getTransactionMethodDropdownData from "../../../global-hook/dropdown/getTransactionMethodDropdownData.js";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { getSettingDropdown } from "../../../../store/utility/utilitySlice.js";
import getSettingAccountTypeDropdownData from "../../../global-hook/dropdown/getSettingAccountTypeDropdownData.js";
import getSettingAuthorizedTypeDropdownData from "../../../global-hook/dropdown/getSettingAuthorizedTypeDropdownData.js";
import ShortcutVoucher from "../../shortcut/ShortcutVoucher.jsx";
import VoucherDetailSection from "./VoucherDetailSection.jsx";
import VoucherFormSection from "./VoucherFormSection.jsx";

function VoucherFormIndex(props) {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 215; //TabList height 104
    const [opened, { open, close }] = useDisclosure(false);

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [authorisedData, setAuthorisedData] = useState(null);
    const [methodData, setMethodData] = useState(null);
    const [accountTypeData, setAccountTypeData] = useState(null);
    const [locationData, setLocationData] = useState(null);
    const [marketingExeData, setMarketingExeData] = useState(null);

    const locationDropdownData = useSelector((state) => state.utilitySlice.locationDropdownData)
    const executiveDropdownData = useSelector((state) => state.utilitySlice.executiveDropdownData)
    const validationMessage = useSelector((state) => state.crudSlice.validationMessage)
    const validation = useSelector((state) => state.crudSlice.validation)
    const entityNewData = useSelector((state) => state.crudSlice.entityNewData)
    const authorisedTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.settingDropdown);
    const accountTypeDropdownData = useSelector((state) => state.utilityUtilitySlice.settingDropdown);


    const authorizedDropdown = getSettingAuthorizedTypeDropdownData()
    const accountDropdown = getSettingAccountTypeDropdownData()



    const [files, setFiles] = useState([]);

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <Image key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />;
    });

    const form = useForm({
        initialValues: {
            method_id: '', name: '', short_name: '', authorised_mode_id: '', account_mode_id: '', service_charge: '', account_owner: '', path: ''
        },
        validate: {
            method_id: isNotEmpty(),
            name: hasLength({ min: 2, max: 20 }),
            short_name: hasLength({ min: 2, max: 20 }),
            authorised_mode_id: isNotEmpty(),
            account_mode_id: isNotEmpty(),
            path: isNotEmpty(),
            service_charge: (value, values) => {
                if (value) {
                    const isNumberOrFractional = /^-?\d+(\.\d+)?$/.test(value);
                    if (!isNumberOrFractional) {
                        return true;
                    }
                }
                return null;
            },
        }
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('method_id').click()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);
    const [filteredItems, setFilteredItems] = useState([]);
    const [value, setValue] = useState('');
    const ref = useRef(null)

    const getActions = () => {
        return ([
            {
                group: t('Core'),
                actions: [
                    {
                        id: 'customer',
                        label: t('Customer'),
                        description: t('WhereWePresentTheCustomerInformation'),
                        onClick: () => {
                            navigate('/core/customer');
                            onClose();
                        },

                    },
                    {
                        id: 'user',
                        label: t('User'),
                        description: t('WhereWePresentTheUserInformation'),
                        onClick: () => {
                            navigate('/core/user');
                            onClose();
                        },

                    },
                    {
                        id: 'vendor',
                        label: t('Vendor'),
                        description: t('WhereWePresentTheVendorInformation'),
                        onClick: () => {
                            navigate('/core/vendor');
                            onClose();
                        },
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
                        onClick: () => {
                            navigate('/inventory/category');
                            onClose();
                        },
                    },
                    {
                        id: 'category-group',
                        label: t('CategoryGroup'),
                        description: t('WhereWePresentTheCategoryGroupInformation'),
                        onClick: () => {
                            navigate('/inventory/category-group');
                            onClose();
                        },
                    },
                    {
                        id: 'product',
                        label: t('Product'),
                        description: t('WhereWePresentTheProductInformation'),
                        onClick: () => {
                            navigate('/inventory/product');
                            onClose();
                        },
                    },
                    {
                        id: 'configuration',
                        label: t('Configuration'),
                        description: t('WhereWePresentTheConfigurationInformation'),
                        onClick: () => {
                            navigate('/inventory/config');
                            onClose();
                        },
                    },
                    {
                        id: 'sales',
                        label: t('Sales'),
                        description: t('WhereWePresentTheSalesInformation'),
                        onClick: () => {
                            navigate('/inventory/sales');
                            onClose();
                        },
                    },
                    {
                        id: 'sales-invoice',
                        label: t('ManageInvoice'),
                        description: t('WhereWePresentTheSalesInvoiceInformation'),
                        onClick: () => {
                            navigate('/inventory/sales-invoice');
                            onClose();
                        },
                    },
                    {
                        id: 'purchase',
                        label: t('Purchase'),
                        description: t('WhereWePresentThePurchaseInformation'),
                        onClick: () => {
                            navigate('/inventory/purchase');
                            onClose();
                        },
                    },
                    {
                        id: 'manage-purchase',
                        label: t('ManagePurchase'),
                        description: t('WhereWePresentThePurchaseInvoiceInformation'),
                        onClick: () => {
                            navigate('/inventory/purchase-invoice');
                            onClose();
                        },
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
                        onClick: () => {
                            navigate('/domain');
                            onClose();
                        },
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
                        onClick: () => {
                            navigate('/accounting/transaction-mode');
                            onClose();
                        },
                    },
                ],
            },
        ]);
    };

    const filterList = (event) => {
        const updatedList = getActions().reduce((acc, group) => {
            const filteredActions = group.actions.filter(action =>
                action.label.toLowerCase().includes(event.target.value.toLowerCase())
            );
            return [...acc, ...filteredActions.map(action => ({ ...action, group: group.group }))];
        }, []);
        setFilteredItems(updatedList);
    };

    return (
        <Box className="borderRadiusAll" p={'xs'}>
            <form onSubmit={form.onSubmit((values) => {
                dispatch(setValidationData(false))
                modals.openConfirmModal({
                    title: (
                        <Text size="md"> {t("FormConfirmationTitle")}</Text>
                    ),
                    children: (
                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: 'Confirm', cancel: 'Cancel' }, confirmProps: { color: 'red' },
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        const formValue = { ...form.values };
                        formValue['path'] = files[0];

                        const data = {
                            url: 'accounting/transaction-mode',
                            data: formValue
                        }
                        dispatch(storeEntityDataWithFile(data))

                        notifications.show({
                            color: 'teal',
                            title: t('CreateSuccessfully'),
                            icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                            loading: false,
                            autoClose: 700,
                            style: { backgroundColor: 'lightgray' },
                        });

                        setTimeout(() => {
                            form.reset()
                            setFiles([])
                            setMethodData(null)
                            setAccountTypeData(null)
                            setAuthorisedData(null)
                            dispatch(setFetching(true))
                        }, 700)
                    },
                });
            })}>
                <Box >
                    <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={2.5} >
                            <Box>
                                <VoucherDetailSection />
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={6.5} >
                            <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                                    <Grid>
                                        <Grid.Col span={12} h={54}>
                                            <Box>
                                                <TextInput
                                                    ref={ref}
                                                    data-autofocus
                                                    mb={4}
                                                    leftSection={< IconSearch size={16} c={'red'} />}
                                                    placeholder={t('SearchMenu')}
                                                    value={value}
                                                    rightSectionPointerEvents="all"
                                                    onChange={(event) => {
                                                        setValue(event.target.value);
                                                        filterList(event);
                                                    }}
                                                    rightSection={
                                                        <CloseButton
                                                            icon={<IconRestore style={{ width: rem(20) }} stroke={2.0} />}
                                                            aria-label="Clear input"
                                                            onClick={() => {
                                                                setValue('');
                                                                filterList({ target: { value: '' } });
                                                                ref.current.focus();
                                                            }}
                                                            style={{ display: value ? undefined : 'none' }}
                                                        />

                                                    }
                                                />
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <ScrollArea h={height + 35} className={'borderRadiusAll'} type="never" >
                                    <Box p={'xs'}>
                                        {filteredItems.reduce((groups, item, index) => {
                                            if (!index || item.group !== filteredItems[index - 1].group) {
                                                groups.push({ group: item.group, items: [item] });
                                            } else {
                                                groups[groups.length - 1].items.push(item);
                                            }
                                            return groups;
                                        }, []).map((groupData, groupIndex) => (
                                            <React.Fragment key={groupIndex}>
                                                <Text size="md" fw="bold" c="#828282" mt={groupIndex ? 'md' : undefined}>
                                                    {groupData.group}
                                                </Text>
                                                <Grid columns={12} grow gutter={'xs'}>
                                                    {groupData.items.map((action, itemIndex) => (
                                                        <GridCol key={itemIndex} span={12} >
                                                            <Stack
                                                                bg={'grey.2'}
                                                                ml={'sm'}
                                                                style={{ cursor: 'pointer' }}
                                                                gap={'0'}
                                                                onClick={() => action.onClick()}
                                                            >
                                                                <Stack direction="column" mt={'xs'} gap={'0'}>
                                                                    <Title order={6} mt={'2px'}>
                                                                        {action.label}
                                                                    </Title>
                                                                    <Text size="sm" c={'#828282'}>
                                                                        {action.description}
                                                                    </Text>
                                                                </Stack>
                                                            </Stack>
                                                        </GridCol>
                                                    ))}
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Box>
                                </ScrollArea >
                            </Box>
                        </Grid.Col>
                        <Grid.Col span={14} >
                            <Box >
                                <VoucherFormSection />
                            </Box>

                        </Grid.Col>
                        <Grid.Col span={1} >
                            <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                                <ShortcutVoucher
                                    form={form}
                                    FormSubmit={'EntityFormSubmit'}
                                    Name={'method_id'}
                                    inputType="select"
                                />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Box>
            </form>
        </Box >
    );
}
export default VoucherFormIndex;
