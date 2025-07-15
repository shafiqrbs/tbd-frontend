import React from "react";
import {
    Drawer, Button,ScrollArea,Group,Box,ActionIcon,Flex,Text
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { setFetching } from "../../../../store/production/crudSlice.js";
import { useDispatch } from "react-redux";
import __ProductionSettingFilterForm from "../settings/__ProductionSettingFilterForm.jsx";
import __RecipeItemFilterForm from "../recipe-items/__RecipeItemFilterForm.jsx";
import __ProductionBatchFilterForm from "../production-inhouse/__ProductionBatchFilterForm.jsx";
import { useOutletContext } from "react-router-dom";
import {IconX, IconSearch} from '@tabler/icons-react'

function FilterDrawer(props) { 
    const { t, i18n } = useTranslation();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight; //TabList height 104
    const dispatch = useDispatch();

    const closeModel = () => {
        props.setFilterDrawer(false)
    }

    return (


        <Drawer.Root opened={props.filterDrawer} position="right" onClose={closeModel} size={'30%'}  >
            <Drawer.Overlay />
            <Drawer.Content>
                <ScrollArea h={height + 100} scrollbarSize={2} type="never" bg={'gray.1'} >
                    <Group mih={40}  justify="space-between">
                        <Box >
                            <Text fw={'600'} fz={'16'} ml={'md'}>
                                {t('FilterData')}
                            </Text>
                        </Box>
                        <ActionIcon
                            mr={'sm'}
                            radius="xl"
                            color='var( --theme-remove-color)'  size="md"
                            onClick={closeModel}
                        >
                            <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                        </ActionIcon>
                    </Group>

                    <Box ml={2} mr={2} mt={0} p={'xs'} className="borderRadiusAll" bg={'white'}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} h={height - 37}>
                        {props.module === 'production-batch' && <__ProductionBatchFilterForm module={props.module} />}
                        {/* {props.module === 'production-setting' && <__ProductionSettingFilterForm module={props.module} />} */}
                        {props.module === 'recipe-item' && <__RecipeItemFilterForm module={props.module} />}
                        </Box>
                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'2'} mt={4} className={'boxBackground borderRadiusAll'}>
                            <Group justify="flex-end">
                                <Button
                                    size="xs"
                                    color={`green.8`}
                                    type="submit"
                                    id={'submit'}
                                    w={142}
                                    onClick={() => {
                                        dispatch(setFetching(true))
                                        closeModel()
                                    }}
                                    leftSection={<IconSearch size={16} />}
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
        </Drawer.Root >
    );
}

export default FilterDrawer;
