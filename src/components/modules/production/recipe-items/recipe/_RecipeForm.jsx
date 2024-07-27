import React from "react";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Text, Title, Stack
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";

import Shortcut from "../../../shortcut/Shortcut.jsx";

import {storeEntityData} from "../../../../../store/production/crudSlice.js";
import InputNumberForm from "../../../../form-builders/InputNumberForm.jsx";

function _RecipeForm() {
    const {id} = useParams();
    const navigate = useNavigate();

    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104

    const measurementInputData = useSelector((state) => state.productionUtilitySlice.measurementInputData.field)
    const measurementInputDataKey = useSelector((state) => state.productionUtilitySlice.measurementInputData.datakey)

    let initialValues = measurementInputDataKey.reduce((acc, key) => {
        acc[key] = '';
        return acc;
    }, {});

    const form = useForm({
        initialValues: initialValues,
    });

    useHotkeys([['alt+n', () => {
        document.getElementById('product_type_id').focus()
    }]], []);

    useHotkeys([['alt+r', () => {
        form.reset()
    }]], []);

    useHotkeys([['alt+s', () => {
        document.getElementById('EntityFormSubmit').click()
    }]], []);

    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => {
                values.item_id = id
                if (id) {
                    const data = {
                        url: 'production/recipe-measurement',
                        data: values
                    }
                    dispatch(storeEntityData(data))

                    notifications.show({
                        color: 'teal',
                        title: t('CreateSuccessfully'),
                        icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                        loading: false,
                        autoClose: 700,
                        style: {backgroundColor: 'lightgray'},
                    });

                    setTimeout(() => {
                        form.reset()
                        navigate('/production/items');
                    }, 500)
                } else {
                    notifications.show({
                        color: 'red',
                        title: t('ProductionItemMissing'),
                        icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                        loading: false,
                        autoClose: 700,
                        style: {backgroundColor: 'lightgray'},
                    });
                }
            })}>
                <Grid columns={9} gutter={{base: 8}}>
                    <Grid.Col span={8}>
                        <Box bg={'white'} p={'xs'} className={'borderRadiusAll'}>
                            <Box bg={"white"}>
                                <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'}
                                     className={'boxBackground borderRadiusAll'}>
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt={'6'}>{t('ManageProductionMeasurement')}</Title>
                                            {/*  SHOULD BE LOAD THE PRODUCT NAME FOR MEASUREMENT .KINDY CHECK THE CSS FOR HEIGHT */}
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Stack right align="flex-end">
                                                <>
                                                    {
                                                        isOnline &&
                                                        <Button
                                                            size="xs"
                                                            color={`green.8`}
                                                            type="submit"
                                                            id="EntityFormSubmit"
                                                            leftSection={<IconDeviceFloppy size={16}/>}
                                                        >

                                                            <Flex direction={`column`} gap={0}>
                                                                <Text fz={14} fw={400}>
                                                                    {t("CreateAndSave")}
                                                                </Text>
                                                            </Flex>
                                                        </Button>
                                                    }
                                                </>
                                            </Stack>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                                <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                    <ScrollArea h={height} scrollbarSize={2} scrollbars="y" type="never">
                                        {Object.keys(measurementInputData).map((key, i) => (
                                            <div key={i}>
                                                <Title order={6} pt={'6'} color={'red'}>{key}</Title>

                                                {measurementInputData[key].map((item, j) => (
                                                    <Box mt={'xs'}>
                                                        <Grid gutter={{base: 6}}>
                                                            <Grid.Col span={6}>
                                                                <Box mt={'xs'}>
                                                                    <Flex
                                                                        justify="flex-start"
                                                                        align="center"
                                                                        direction="row"
                                                                    >
                                                                        <Text
                                                                            ta="center" fz="sm"
                                                                            fw={300}>
                                                                            {item.name}
                                                                        </Text>
                                                                    </Flex>
                                                                </Box>
                                                            </Grid.Col>
                                                            <Grid.Col span={6}>
                                                                <Box>
                                                                    <InputNumberForm
                                                                        tooltip={item.name}
                                                                        placeholder={item.name}
                                                                        required={false}
                                                                        nextField={item.setting_type_name+j}
                                                                        name={item.slug}
                                                                        form={form}
                                                                        id={key+j}
                                                                    />

                                                                </Box>
                                                            </Grid.Col>
                                                        </Grid>
                                                    </Box>

                                                ))}
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={1}>
                        <Box bg={'white'} className={'borderRadiusAll'} pt={'16'}>
                            <Shortcut
                                form={form}
                                FormSubmit={'EntityFormSubmit'}
                                Name={'name'}
                                inputType="select"
                            />
                        </Box>
                    </Grid.Col>
                </Grid>
            </form>
        </Box>

    );
}

export default _RecipeForm;
