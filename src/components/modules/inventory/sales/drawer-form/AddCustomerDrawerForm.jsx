import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    Button, rem, Flex, Grid, Box, ScrollArea, Text, Title, Stack,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck,
    IconDeviceFloppy,
    IconRefreshDot,
    IconUserCircle,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { storeEntityData } from "../../../../../store/inventory/crudSlice.js";
import InputForm from "../../../../form-builders/InputForm.jsx";
import PhoneNumber from "../../../../form-builders/PhoneNumberInput.jsx";

function AddCustomerDrawerForm(props) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOnline, mainAreaHeight } = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const effectRan = useRef(false);

    const { setCustomerDrawer, setRefreshCustomerDropdown, focusField, fieldPrefix } = props

    useEffect(() => {
        !effectRan.current && (
            setTimeout(() => {
                const element = document.getElementById(fieldPrefix + 'name');
                if (element) {
                    element.focus();
                }
            }, 100),
            effectRan.current = true
        )
    }, []);

    const customerAddedForm = useForm({
        initialValues: {
            name: '',
            mobile: '',
        },
        validate: {
            name: hasLength({ min: 2, max: 20 }),
            mobile: (value) => {
                if (!value) return t('MobileValidationRequired');
                if (!/^\d{13}$/.test(value)) return t('MobileValidationDigitCount');
                return null;
            },
        }
    });


    return (
        <>
            <Box>
                <form onSubmit={customerAddedForm.onSubmit((values) => {
                    modals.openConfirmModal({
                        title: (
                            <Text size="md"> {t("FormConfirmationTitle")}</Text>
                        ),
                        children: (
                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                        ),
                        labels: { confirm: t('Submit'), cancel: t('Cancel') }, confirmProps: { color: 'red' },
                        onCancel: () => console.log('Cancel'),
                        onConfirm: () => {
                            setSaveCreateLoading(true)
                            const value = {
                                url: 'core/customer',
                                data: customerAddedForm.values
                            }
                            dispatch(storeEntityData(value))

                            notifications.show({
                                color: 'teal',
                                title: t('CreateSuccessfully'),
                                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                loading: false,
                                autoClose: 700,
                                style: { backgroundColor: 'lightgray' },
                            });

                            setTimeout(() => {
                                dispatch(storeEntityData(value))
                                customerAddedForm.reset()
                                setRefreshCustomerDropdown(true)
                                setCustomerDrawer(false)
                                document.getElementById(focusField).focus()
                            }, 700)
                        },
                    });
                })}>
                    <Box mb={0}>
                        <Grid columns={9} gutter={{ base: 6 }} >
                            <Grid.Col span={9} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                    <Box bg={"white"} >
                                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                            <Grid columns={12}>
                                                <Grid.Col span={6} >
                                                    <Title order={6} pt={'6'}>{t('InstantCustomerCreate')}</Title>
                                                </Grid.Col>
                                                <Grid.Col span={2} p={0}>
                                                    <Flex justify="flex-end" align="center" h="100%">
                                                        <Button
                                                            variant="transparent"
                                                            size="xs"
                                                            color="red.4"
                                                            type="reset"
                                                            id=""
                                                            comboboxProps={{ withinPortal: false }}
                                                            p={0}
                                                            onClick={() => {
                                                                customerAddedForm.reset()
                                                            }}
                                                            rightSection={
                                                                <IconRefreshDot style={{ width: '100%', height: '60%' }} stroke={1.5} />}
                                                        >
                                                        </Button>
                                                    </Flex>
                                                </Grid.Col>
                                                <Grid.Col span={4}>
                                                    <Stack right align="flex-end">
                                                        <>
                                                            {
                                                                !saveCreateLoading && isOnline &&
                                                                <Button
                                                                    size="xs"
                                                                    color={`green.8`}
                                                                    type="submit"
                                                                    id={fieldPrefix + "EntityCustomerFormSubmit"}
                                                                    leftSection={<IconDeviceFloppy size={16} />}
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
                                                <Box mt={'xs'}>
                                                    <InputForm
                                                        tooltip={t('NameValidateMessage')}
                                                        label={t('Name')}
                                                        placeholder={t('CustomerName')}
                                                        required={true}
                                                        nextField={fieldPrefix + 'mobile'}
                                                        form={customerAddedForm}
                                                        name={'name'}
                                                        id={fieldPrefix + 'name'}
                                                        leftSection={<IconUserCircle size={16} opacity={0.5} />}
                                                        rightIcon={''}
                                                    />
                                                </Box>
                                                <Box mt={'8'}>
                                                    <PhoneNumber
                                                        tooltip={customerAddedForm.errors.mobile ? customerAddedForm.errors.mobile : t('MobileValidateMessage')}
                                                        label={t('Mobile')}
                                                        placeholder={t('Mobile')}
                                                        required={true}
                                                        nextField={fieldPrefix + 'EntityCustomerFormSubmit'}
                                                        form={customerAddedForm}
                                                        name={'mobile'}
                                                        id={fieldPrefix + 'mobile'}
                                                        rightIcon={''}
                                                    />
                                                </Box>
                                            </ScrollArea>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </form >
            </Box >
        </>
    );
}

export default AddCustomerDrawerForm;