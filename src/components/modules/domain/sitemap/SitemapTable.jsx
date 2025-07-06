import React, { useEffect, useState } from "react";
import { useOutletContext, Link, useNavigate, } from "react-router-dom";
import {
    Group,
    Box, Grid,
    ActionIcon, Text, Switch, Flex, Menu, rem,
    useMantineTheme
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconTrashX, IconDotsVertical } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useDispatch, useSelector } from "react-redux";
import {
    editEntityData,
    getIndexEntityData,
    setFetching, setFormLoading,
    setInsertType,
    showEntityData
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { deleteEntityData } from "../../../../store/core/crudSlice";
import tableCss from "../../../../assets/css/Table.module.css";
import * as TablerIcons from '@tabler/icons-react';



function SitemapTable(props) {

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 98; //TabList height 104

    const perPage = 50;
    const [page, setPage] = useState(1);

    const fetching = useSelector((state) => state.crudSlice.fetching)
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword)
    const indexData = useSelector((state) => state.crudSlice.indexEntityData)
    const navigate = useNavigate();
    const theme = useMantineTheme();

    const [swtichEnable, setSwitchEnable] = useState({});

    const handleSwtich = (event, item) => {
        setSwitchEnable(prev => ({ ...prev, [item.id]: true }));
        // const value = {
        //     url: 'domain/sitemap/inline-status/' + item.id
        // }
        // dispatch(getStatusInlineUpdateData(value))
        // dispatch(setFetching(true))
        setTimeout(() => {
            setSwitchEnable(prev => ({ ...prev, [item.id]: false }));
        }, 3000)
    }

    const data = [
        {id : 1, module_name : "sales", name : 'test', url :  "test.com", icon : 'IconAbacusOff'},
        {id : 2, module_name : "purchase", name : 'test', url :  "test.com", icon : 'IconABOff'},
        {id : 3, module_name : "accounting", name : 'test', url :  "test.com", icon : 'IconAdjustmentsDown'},
    ]

    useEffect(() => {
        const value = {
            url: 'domain/sitemap',
            param: {
                term: searchKeyword,
                // name: customerFilterData.name,
                // mobile: customerFilterData.mobile,
                page: page,
                offset: perPage
            }
        }
        dispatch(getIndexEntityData(value))
    }, [fetching]);


    const icon = TablerIcons[data.icon]

    return (

        <>
            <Box pl={`xs`} pr={8} pt={'6'} pb={'4'} className={'boxBackground borderRadiusAll border-bottom-none'} >
                <KeywordSearch module={'sitemap'} />
            </Box>
            <Box className={'borderRadiusAll border-top-none'}>
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
                            accessor: 'index',
                            title: t('S/N'),
                            textAlign: 'left',
                            render: (item) => (data.indexOf(item) + 1)
                        },
                        { accessor: 'module_name', title: t('ModuleName') },
                        { accessor: 'name', title: t('Name') },
                        { accessor: 'url', title: t("Url") },
                        { accessor: 'icon', title: t("Icon"), textAlign: 'center',
                            render : (item) => {
                                const IconComponent = TablerIcons[item.icon];
                                return IconComponent ? (<ActionIcon color={item.module_name === 'sales' ? 'teal.6' : item.module_name === 'purchase' ? 'red.6' : 'green.8'} size={20} radius="xl" variant="outline"><IconComponent /></ActionIcon>)  : null;
                              }
                        },
                        {
                            accessor: 'status',
                            title: t("Status"),
                            textAlign: 'center',
                            render: (item) => (
                                <Flex justify="center" align="center">
                                    <Switch
                                        disabled={swtichEnable[item.id] || false}
                                        defaultChecked={item.status == 1 ? true : false}
                                        color='var(--theme-primary-color-6)'
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
                            render: (data) => (
                                <Group gap={4} justify="right" wrap="nowrap">
                                    <Menu position="bottom-end" offset={3} withArrow trigger="hover" openDelay={100} closeDelay={400}>
                                        <Menu.Target>
                                            <ActionIcon size="sm" variant="outline" color='var(--theme-primary-color-6)' radius="xl" aria-label="Settings">
                                                <IconDotsVertical height={'18'} width={'18'} stroke={1.5} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => {
                                                    dispatch(setInsertType('update'))
                                                    // dispatch(editEntityData('domain/sitemap/' + data.id))
                                                    dispatch(setFormLoading(true))
                                                    navigate(`/domain/sitemap/${data.id}`);
                                                }}
                                            >
                                                {t('Edit')}
                                            </Menu.Item>

                                            <Menu.Item
                                                onClick={() => {
                                                    //code to show sitemap
                                                    // dispatch(showEntityData('domain/sitemap/' + data.id))
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Show')}
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={() => {
                                                    navigate(`/domain/sitemap/${data.id}`)
                                                }}
                                                target="_blank"
                                                component="a"
                                                w={'200'}
                                            >
                                                {t('Configuration')}
                                            </Menu.Item>
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
                                                        onCancel: () => console.log('Cancel'),
                                                        onConfirm: () => {
                                                            // dispatch(deleteEntityData('domain/sitemap/' + data.id))
                                                            // dispatch(setFetching(true))
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
                            ),
                        },
                    ]
                    }
                    fetching={fetching}
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
export default SitemapTable;
