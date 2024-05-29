import React, { useEffect, useState, useRef } from "react";
import { Box, TextInput, ScrollArea, Stack, Text, Title, GridCol, Grid, CloseButton, Input, Tooltip, rem, Kbd, Flex } from "@mantine/core";
import { IconClearAll, IconInfoCircle, IconRestore, IconSearch, IconTrash, IconX, IconXboxX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { setSearchKeyword } from "../../../store/core/crudSlice.js";
import { useDisclosure, useFullscreen, useHotkeys } from "@mantine/hooks";

function SearchModal({ onClose }) {
    const [filteredItems, setFilteredItems] = useState([]);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const ref = useRef(null)
    useHotkeys([['alt+c', () => {
        setValue('');
        filterList({ target: { value: '' } });
        ref.current.focus();

    }]], []);
    const getActions = () => {
        return ([
            {
                group: t('Core'),
                actions: [
                    {
                        id: 'customer',
                        label: t('Customer'),
                        description: t('WhereWePresentTheCustomerInformation'),

                    },
                    {
                        id: 'user',
                        label: t('User'),
                        description: t('WhereWePresentTheUserInformation'),


                    },
                    {
                        id: 'vendor',
                        label: t('Vendor'),
                        description: t('WhereWePresentTheVendorInformation'),

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

                    },
                    {
                        id: 'category-group',
                        label: t('CategoryGroup'),
                        description: t('WhereWePresentTheCategoryGroupInformation'),

                    },
                    {
                        id: 'product',
                        label: t('Product'),
                        description: t('WhereWePresentTheProductInformation'),

                    },
                    {
                        id: 'config',
                        label: t('Configuration'),
                        description: t('WhereWePresentTheConfigurationInformation'),

                    },
                    {
                        id: 'sales',
                        label: t('Sales'),
                        description: t('WhereWePresentTheSalesInformation'),

                    },
                    {
                        id: 'sales-invoice',
                        label: t('NewSales'),
                        description: t('WhereWePresentTheSalesInvoiceInformation'),

                    },
                    {
                        id: 'purchase',
                        label: t('Purchase'),
                        description: t('WhereWePresentThePurchaseInformation'),

                    },
                    {
                        id: 'purchase-invoice',
                        label: t('NewPurchase'),
                        description: t('WhereWePresentThePurchaseInvoiceInformation'),

                    },
                ],
            },
            {
                group: t('Production'),
                actions: [
                    {
                        id: 'production',
                        label: t('Production'),
                        description: t('WhereWePresentTheProductionInformation'),

                    },
                    {
                        id: 'production-inhouse',
                        label: t('ProductionInhouse'),
                        description: t('WhereWePresentTheProductionInformation'),


                    },
                    {
                        id: 'production-receipe',
                        label: t('ProductionReceipe'),
                        description: t('WhereWePresentTheProductionInformation'),


                    },
                ],
            },
            {
                group: t('Domain'),
                actions: [
                    {
                        id: '',
                        label: t('Domain'),
                        description: t('WhereWePresentTheDomainInformation'),

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

                    },
                    {
                        id: 'voucher-entry',
                        label: t('VoucherEntry'),
                        description: t('WhereWePresentTheVoucherInformation'),

                    },
                    {
                        id: 'ledger',
                        label: t('Ledger'),
                        description: t('WhereWePresentTheLedgerInformation'),

                    },
                    {
                        id: 'head-group',
                        label: t('HeadGroup'),
                        description: t('WhereWePresentTheHeadGroupInformation'),

                    },
                    {
                        id: 'head-subgroup',
                        label: t('HeadSubGroup'),
                        description: t('WhereWePresentTheHeadSubGroupInformation'),

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

    useEffect(() => {
        setFilteredItems(getActions().reduce((acc, group) => [...acc, ...group.actions.map(action => ({ ...action, group: group.group }))], []));
    }, []);


    return (
        <>
            <TextInput
                w={`100%`}
                align={'center'}
                justify="space-between"
                ref={ref}
                data-autofocus
                mb={4}
                leftSection={<IconSearch size={16} c={'red'} />}
                placeholder={t('SearchMenu')}
                value={value}
                rightSectionPointerEvents="all"
                rightSection={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {value ? (
                            <>
                                <CloseButton
                                    ml={'-50'}
                                    mr={'xl'}
                                    icon={<IconRestore style={{ width: rem(20) }} stroke={2.0} />}
                                    aria-label="Clear input"
                                    onClick={() => {
                                        setValue('');
                                        filterList({ target: { value: '' } });
                                        ref.current.focus();
                                    }}
                                />
                                <Kbd ml={"-xl"} h={'24'} c={'gray.8'} fz={'12'}>Alt</Kbd> + <Kbd c={'gray.8'} h={'24'} fz={'12'} mr={'lg'}>C</Kbd>
                            </>
                        ) : (
                            <>

                                <CloseButton
                                    ml={'-50'}
                                    mr={'lg'}
                                    icon={<IconXboxX style={{ width: rem(20) }} stroke={2.0} />}
                                    aria-label="Clear input"
                                    onClick={() => {
                                        onClose();
                                    }}
                                />
                                <Kbd ml={"-lg"} h={'24'} c={'gray.8'} fz={'12'}>Alt </Kbd> + <Kbd c={'gray.8'} h={'24'} fz={'12'} mr={'xl'}> X</Kbd>
                            </>
                        )}
                    </div>
                }
                onChange={(event) => {
                    setValue(event.target.value);
                    filterList(event);
                }}

            />





            < ScrollArea h={'400'} className={'boxBackground borderRadiusAll'} type="never" >

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
                                    <GridCol key={itemIndex} span={6} >
                                        <Link to={`${groupData.group}/${action.id}`} onClick={onClose}
                                            style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Stack
                                                bg={'grey.2'}
                                                ml={'sm'}
                                                style={{ cursor: 'pointer' }}
                                                gap={'0'}
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
                                        </Link>
                                    </GridCol>
                                ))}
                            </Grid>
                        </React.Fragment>
                    ))}
                </Box>



            </ScrollArea >

        </>
    );
}

export default SearchModal;
