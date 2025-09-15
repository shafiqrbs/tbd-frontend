import React, {useState} from "react";
import {
    Drawer, Button, Box, Flex, Text,
    ScrollArea,
    ActionIcon,
    Group, rem, Center
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {updateEntityDataWithFile} from "../../store/core/crudSlice.js";
import {useDispatch} from "react-redux";
import {useOutletContext} from "react-router-dom";
import {IconCheck, IconSearch, IconX} from "@tabler/icons-react";
import {notifications} from "@mantine/notifications";
import {modals} from "@mantine/modals";
import {Dropzone, MIME_TYPES} from "@mantine/dropzone";
import axios from "axios";
import useProductsDataStoreIntoLocalStorage from "../global-hook/local-storage/useProductsDataStoreIntoLocalStorage.js";

function FileUploadModel(props) {
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight; //TabList height 104

    const dispatch = useDispatch();

    const closeModel = () => {
        // props.filyType === 'Opening-Stock' && props.setFileUploadStateFunction(false)
        // props.filyType === 'Finish-Goods' && props.set(false)
        props.setFileUploadStateFunction(false)
    }

    const [excelFile, setExcelFile] = useState(null);

    const processUploadFile = (id) => {
        axios({
            method: 'get',
            url: `${import.meta.env.VITE_API_GATEWAY_URL + 'core/file-upload/process'}`,
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem('user')).id
            },
            params: {
                file_id: id
            }
        })
            .then(res => {
                if (res.data.status == 200) {
                    useProductsDataStoreIntoLocalStorage()
                    closeModel()
                    props.tableDataLoading(true)
                    setTimeout(() => {
                        notifications.show({
                            color: 'teal',
                            title: 'Process ' + res.data.row + ' rows successfully',
                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                            loading: false,
                            autoClose: 2000,
                            style: {backgroundColor: 'lightgray'},
                        });
                    })
                }
            })
            .catch(function (error) {
                closeModel()
                props.tableDataLoading(true)
                if (error?.response?.data?.message) {
                    notifications.show({
                        color: 'red',
                        title: error.response.data.message,
                        icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                        loading: false,
                        autoClose: 2000,
                        style: {backgroundColor: 'lightgray'},
                    });
                }
            })
    }


    return (
        <Drawer.Root opened={props.modelStatus} position="right" onClose={closeModel} size={'30%'}>
            <Drawer.Overlay/>
            <Drawer.Content>
                <ScrollArea h={height + 100} scrollbarSize={2} type="never" bg={'gray.1'}>

                    <Group mih={40} justify="space-between">
                        <Box>
                            <Text fw={'600'} fz={'16'} ml={'md'}>
                                {t('CreateFile')+' '+props.filyType}
                            </Text>
                        </Box>
                        <ActionIcon
                            mr={'sm'}
                            radius="xl"
                            color='var( --theme-remove-color)'  size="md"
                            onClick={closeModel}
                        >
                            <IconX  color='var( --theme-remove-color)'  style={{width: '100%', height: '100%'}} stroke={1.5}/>
                        </ActionIcon>
                    </Group>

                    <Box ml={2} mr={2} mt={0} p={'xs'} className="borderRadiusAll" bg={'white'}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} h={height - 37}>

                            <Box mt={'xs'}>
                                <Dropzone
                                    onDrop={(e) => {
                                        setExcelFile(e[0])
                                    }}
                                    accept={[MIME_TYPES.csv, MIME_TYPES.xlsx]}
                                    h={100}
                                    p={0}
                                >
                                    <Center h={100}>
                                        <Text>{excelFile ? excelFile.path : t("SelectCsvFile")}</Text>
                                    </Center>
                                </Dropzone>
                            </Box>
                        </Box>
                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'2'} mt={4}
                             className={'boxBackground borderRadiusAll'}>
                            <Group justify="flex-end">
                                <Button
                                    size="xs"
                                    color={`green.8`}
                                    type="submit"
                                    id={'submit'}
                                    w={142}
                                    onClick={() => {
                                        if (!excelFile) {
                                            notifications.show({
                                                loading: true,
                                                color: 'red',
                                                title: t("SelectCsvFile"),
                                                message: 'Data will be loaded in 3 seconds, you cannot close this yet',
                                                autoClose: 1000,
                                                withCloseButton: true,
                                            });
                                        } else {

                                            modals.openConfirmModal({
                                                title: (
                                                    <Text size="md"> {t("FormConfirmationTitle")}</Text>
                                                ),
                                                children: (
                                                    <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                                ),
                                                labels: {confirm: t('Submit'), cancel: t('Cancel')},
                                                confirmProps: {color: 'red'},
                                                onCancel: () => console.log('Cancel'),
                                                onConfirm: () => {

                                                    const value = {
                                                        url: 'core/file-upload/store',
                                                        data: {
                                                            file: excelFile,
                                                            file_type: props.filyType
                                                        }
                                                    }
                                                    // console.log(value)
                                                    const dispatchUpdateEntityDataWithFile = async (value) => {
                                                        const dispatchResult = await dispatch(updateEntityDataWithFile(value));
                                                        return dispatchResult;
                                                    };

                                                    dispatchUpdateEntityDataWithFile(value).then(response => {
                                                        if (response.payload.data.status == 200) {
                                                            notifications.show({
                                                                color: 'teal',
                                                                title: t('CreateSuccessfully'),
                                                                icon: <IconCheck
                                                                    style={{width: rem(18), height: rem(18)}}/>,
                                                                loading: false,
                                                                autoClose: 700,
                                                                style: {backgroundColor: 'lightgray'},
                                                            });

                                                            processUploadFile(response.payload.data.data.id)
                                                        }
                                                    }).catch(error => {
                                                        console.error('Dispatch error:', error);
                                                    });
                                                },
                                            });
                                        }
                                    }}
                                    leftSection={<IconSearch size={16}/>}
                                >
                                    <Flex direction={`column`} gap={0}>
                                        <Text fz={14} fw={400}>
                                            {t("Submit")}
                                        </Text>
                                    </Flex>
                                </Button>
                            </Group>
                        </Box>
                    </Box>

                </ScrollArea>
            </Drawer.Content>
        </Drawer.Root>


    );
}

export default FileUploadModel;


