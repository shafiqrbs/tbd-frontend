import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import KeywordSearch from "../common/KeywordSearch";
import { Box, Switch, Flex, Group, Button, Menu, ActionIcon, rem } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from '../../../../assets/css/Table.module.css';
import { modals } from "@mantine/modals";
import { IconDotsVertical, IconTrashX } from '@tabler/icons-react'

export default function BatchTable(props){

    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const { isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;
    const indexData = useSelector((state) => state.productionCrudSlice.indexEntityData);
    const fetching = useSelector((state) => state.productionCrudSlice.fetching);

    const perPage = 50;
    const [page,setPage] = useState(1);
    const navigate = useNavigate()


    useEffect(() => {
        // const value = {
        //     url: 'production/recipe-items',
        //     param: {
        //         term: searchKeyword,
        //         product_name: recipeItemFilterData.product_name,
        //         page: page,
        //         offset: perPage
        //     }
        // }
        // dispatch(getIndexEntityData(value))
    }, [fetching]);

    const [swtichEnable, setSwitchEnable] = useState({});

    const handleSwtich = (event, item) => {
        setSwitchEnable(prev => ({ ...prev, [item.id]: true }));
        // const value = {
        //     url: 'core/setting/inline-status/' + item.id
        // }
        // dispatch(getStatusInlineUpdateData(value))
        // dispatch(setFetching(true))
        setTimeout(() => {
            setSwitchEnable(prev => ({ ...prev, [item.id]: false }));
        }, 3000)
    }

    const data = [
        {id : 1, uom : 'kg', woi : 123123, issue_quantity : 10, receive_quantity : 10, damage_quantity : 1, stock_qty : 200, status : 1 , }
    ]



    return (
        <>
            <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                    <KeywordSearch module={'production-batch'} />
            </Box>
            <Box className="borderRadiusAll">
                <DataTable
                    classNames={{
                        root: tableCss.root,
                        table: tableCss.table,
                        header: tableCss.header,
                        footer: tableCss.footer,
                        pagination: tableCss.pagination,
                    }}
                    records={data}
                    columns={[
                        {
                            accessor: 'id',
                            title: t('S/N'),
                            textAlignment: 'right',
                            render: (item) => 
                                (data.indexOf(item) + 1)
                        },
                        { accessor: 'uom', title: t('UOM') },
                        { accessor: 'woi', title: t('WorkOrderInvoice') },
                        { accessor: 'issue_quantity', title: t('IssueQty') },
                        { accessor: 'receive_quantity', title: t('ReceiveQty') },
                        { accessor: 'damage_quantity', title: t('DamageQty') },
                        { accessor: 'stock_qty', title: t('StockQty') },
                        {
                            accessor: 'status',
                            title: t("Status"),
                            textAlign: 'center',
                            render: (item) => (
                                <Flex justify="center" align="center">
                                    <Switch
                                        disabled={swtichEnable[item.id] || false}
                                        defaultChecked={item.status == 1 ? true : false}
                                        color="red"
                                        radius="xs"
                                        size="md"
                                        onLabel="Enable"
                                        offLabel="Disable"
                                        onChange={(event) => {
                                            handleSwtich(event, item);
                                        }}
                                    />
                                </Flex>
                            )
                        },
                        {
                            accessor: "action",
                            title: t("Action"),
                            textAlign: "right",
                            render: (item) => (
                                item.process != 'approved' ?
                                    <Group gap={4} justify="right" wrap="nowrap">
                                        <Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="green.8" mr={'4'}
                                            onClick={() => {
                                                {
                                                    // navigate(`/production/recipe-update/${item.id}`)
                                                }
                                            }}
                                        >  {t('Show')}</Button>
                                        <Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="red.6" mr={'4'}
                                            onClick={() => {
                                                {
                                                    // navigate(`/production/recipe-update/${item.id}`)
                                                }
                                            }}
                                        >  {t('Edit')}</Button>
                                        <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color="red" radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                                mt={'2'}
                                                bg={'red.1'}
                                                c={'red.6'}
                                                onClick={() => {
                                                    modals.openConfirmModal({
                                                        title: (
                                                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                        ),
                                                        children: (
                                                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                        ),
                                                        labels: { confirm: 'Confirm', cancel: 'Cancel' },
                                                        confirmProps: { color: 'red.6' },
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            dispatch(deleteEntityData('inventory/product/' + data.id))
                                                        },
                                                    });
                                                }}
                                                rightSection={<IconTrashX style={{ width: rem(14), height: rem(14) }} />}
                                            >
                                                {t('Delete')}
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                    </Group>
                                    :
                                    <Group gap={4} justify="right" wrap="nowrap">
                                        <Button component="a" size="compact-xs" radius="xs" variant="filled" fw={'100'} fz={'12'} color="red.3" mr={'4'}
                                        >  {t('Amendment')}</Button>
                                    </Group>
                            ),
                        },
                    ]
                    }
                    // fetching={fetching}
                    totalRecords={indexData.total}
                    recordsPerPage={perPage}
                    page={page}
                    onPageChange={(p) => {
                        setPage(p)
                        dispatch(setFetching(true))
                    }}
                    loaderSize="xs"
                    loaderColor="grape"
                    height={height}
                    scrollAreaProps={{ type: 'never' }}
                />
            </Box>
        </>
    );
}