import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon, Text, NavLink, Paper
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure, useHotkeys, useToggle } from "@mantine/hooks";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import classes from '../../../../assets/css/HeaderSearch.module.css';
import {
    IconInfoCircle, IconTrash, IconSearch, IconSettings,IconRestore
} from "@tabler/icons-react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getIndexEntityData, getRestoreData} from "../../../../store/production/crudSlice";
import axios from "axios";
import FileUploadModel from "../../../core-component/FileUploadModel.jsx";


function ProductionHeaderNavbar(props) {
    let { id } = useParams();
    const { pageTitle,roles } = props
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [opened, { toggle }] = useDisclosure(false);
    const navigate = useNavigate();
    const location = useLocation();
    const currentRoute = location.pathname;

    const stockItem = useSelector((state) => state.productionCrudSlice.measurementInputData.stock_item)

    const [uploadFinishGoodsModel, setUploadFinishGoodsModel] = useState(false)


    const CallProductionBatchCreateApi = (event) => {
        event.preventDefault();
        axios({
            method: 'POST',
            url: `${import.meta.env.VITE_API_GATEWAY_URL+'production/batch'}`,
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem('user')).id
            },
            data : {
                mode : 'in-house'
            }
        })
            .then(res => {
                if (res.data.status === 200){
                    navigate('/production/batch/'+res.data.data.id)
                }
            })
            .catch(function (error) {
                console.log(error)
                alert(error)
            })
    }

    const links = [
        { link: '/production/batch/new', label: t('NewBatch'), show: currentRoute !== '/production/batch/'+id, onClick: CallProductionBatchCreateApi },
        { link: '/production/batch', label: t('ProductionBatch'), show: currentRoute !== '/production/batch' },
        { link: '/production/items', label: t('ProductionItems'),show: true },
        { link: '/production/setting', label: t('ProductionSetting'),show: true },
        { link: '/production/config', label: t('ProductionConfiguration'),show: true },
    ];

    const items = links
        .filter(link => link.show)
        .map((link) => (
            <a
                key={link.link}
                href={link.link}
                className={location.pathname==link.link ? classes.active :classes.link}
                onClick={(event) => {
                    if (link.label === t('NewBatch') && link.onClick) {
                        link.onClick(event);  // Trigger custom click for NewBatch
                    } else {
                        event.preventDefault();
                        navigate(link.link);  // Regular navigation for other links
                    }
                }}
            >
                {link.label}
            </a>
        ));

    const dataRestore = () => {
        dispatch(getRestoreData('production/restore/item'))
    }

    return (
        <>
            <header className={classes.header}>
                <div className={classes.inner}>
                    <Group ml={10}>
                        <Text>
                            {pageTitle} {stockItem?.display_name ? ` ${stockItem.display_name}` : ''}
                        </Text>
                        {/*<Paper shadow="lg" radius="xs" p="sm">
                            {stockItem?.display_name ? ` ${stockItem.display_name}` : ''}
                        </Paper>*/}
                    </Group>
                    <Group>
                        <Group ml={50} gap={5} className={classes.links} visibleFrom="sm" mt={'2'}>
                            {items}
                        </Group>
                        <Menu withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={400} mr={'8'}>
                            <Menu.Target>
                                <ActionIcon mt={'4'} variant="filled" color="red.5" radius="xl" aria-label="Settings">
                                    <IconInfoCircle height={'12'} width={'12'} stroke={1.5} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item href="javascript:"  onClick={(e)=>{
                                    setUploadFinishGoodsModel(true)
                                }} leftSection={<IconRestore style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('UploadFinishGoods')}
                                </Menu.Item>
                                <Menu.Item href="javascript:"  onClick={dataRestore} leftSection={<IconRestore style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('ItemRestore')}
                                </Menu.Item>
                                <Menu.Item href="/production/setting"
                                    component="button" onClick={(e) => { navigate('/production/setting') }} leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('ProductionSetting')}
                                </Menu.Item>
                                <Menu.Item href="/inventory/config"
                                    component="button" onClick={(e) => { navigate('/inventory/config') }} leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('ProductionConfiguration')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </header>
            {uploadFinishGoodsModel &&
                <FileUploadModel
                    modelStatus={uploadFinishGoodsModel}
                    setFileUploadStateFunction={setUploadFinishGoodsModel}
                    filyType={'Finish-Goods'}
                    tableDataLoading={props.setBatchReloadWithUpload}
                />
            }
        </>
    );
}

export default ProductionHeaderNavbar;
