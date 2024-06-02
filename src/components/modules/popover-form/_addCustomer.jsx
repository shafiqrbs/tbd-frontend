import {ActionIcon, Box, Button, Flex, Grid, Popover, Text, Tooltip} from "@mantine/core";
import {IconDeviceFloppy, IconDeviceMobile, IconRefreshDot, IconUserCircle, IconUserPlus} from "@tabler/icons-react";
import InputForm from "../../form-builders/InputForm.jsx";
import InputNumberForm from "../../form-builders/InputNumberForm.jsx";
import {storeEntityData} from "../../../store/inventory/crudSlice.js";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {isNotEmpty, useForm} from "@mantine/form";

function _addCustomer(props) {
    const {setRefreshCustomerDropdown,focusField,fieldPrefix} = props

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    /*START CUSTOMER ADDED FORM INITIAL*/
    const [customerAddFormOpened,setCustomerAddFormOpened] = useState(false)
    const customerAddedForm = useForm({
        initialValues: {
            name: '',
            mobile: ''
        },
        validate: {
            name: isNotEmpty(),
            mobile: isNotEmpty()
        }
    });
    /*END CUSTOMER ADDED FORM INITIAL*/


    return (
        <Box pt={7}>
            <Popover
                width={'450'}
                trapFocus
                position="bottom"
                withArrow
                shadow="xl"
                opened={customerAddFormOpened}
                onChange={setCustomerAddFormOpened}
            >
                <Popover.Target>
                    <Tooltip
                        multiline
                        bg={'orange.8'}
                        offset={{ crossAxis: '-52', mainAxis: '5' }}
                        position="top"
                        ta={'center'}
                        withArrow
                        transitionProps={{ duration: 200 }}
                        label={t('InstantCustomerCreate')}
                    >
                        <ActionIcon
                            fullWidth
                            variant="outline"
                            bg={'white'}
                            size={'lg'}
                            color="red.5"
                            mt={'1'}
                            aria-label="Settings"
                            onClick={() => setCustomerAddFormOpened(true)}
                        >
                            <IconUserPlus style={{ width: '100%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                    <Box mt={'xs'}>
                        <InputForm
                            tooltip={t('NameValidateMessage')}
                            label={t('Name')}
                            placeholder={t('CustomerName')}
                            required={true}
                            nextField={fieldPrefix+'mobile'}
                            form={customerAddedForm}
                            name={'name'}
                            id={fieldPrefix+'name'}
                            leftSection={<IconUserCircle size={16} opacity={0.5} />}
                            rightIcon={''}
                        />
                    </Box>
                    <Box mt={'xs'}>
                        <InputNumberForm
                            tooltip={t('MobileValidateMessage')}
                            label={t('Mobile')}
                            placeholder={t('Mobile')}
                            required={true}
                            nextField={fieldPrefix+'EntityCustomerFormSubmit'}
                            form={customerAddedForm}
                            name={'mobile'}
                            id={fieldPrefix+'mobile'}
                            leftSection={<IconDeviceMobile size={16} opacity={0.5} />}
                            rightIcon={''}
                        />
                    </Box>
                    <Box mt={'xs'}>
                        <Grid columns={12} gutter={{ base: 1 }} >
                            <Grid.Col span={6}>&nbsp;</Grid.Col>
                            <Grid.Col span={2}>
                                <Button
                                    variant="transparent"
                                    size="sm"
                                    color={`red.4`}
                                    type="submit"
                                    mt={0}
                                    mr={'xs'}
                                    fullWidth
                                >
                                    <IconRefreshDot style={{ width: '100%', height: '70%' }} stroke={1.5} />
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <Button
                                    size="sm"
                                    color={`red.5`}
                                    type="submit"
                                    mt={0}
                                    mr={'xs'}
                                    fullWidth
                                    id={fieldPrefix+"EntityCustomerFormSubmit"}
                                    leftSection={<IconDeviceFloppy size={16} />}
                                    onClick={() => {
                                        let validation = true
                                        if (!customerAddedForm.values.name) {
                                            validation = false
                                            customerAddedForm.setFieldError('name', true);
                                        }
                                        if (!customerAddedForm.values.mobile) {
                                            validation = false
                                            customerAddedForm.setFieldError('mobile', true);
                                        }

                                        if (validation) {
                                            const value = {
                                                url: 'core/customer',
                                                data: customerAddedForm.values
                                            }
                                            dispatch(storeEntityData(value))

                                            customerAddedForm.reset()
                                            setRefreshCustomerDropdown(true)
                                            setCustomerAddFormOpened(false)
                                            document.getElementById(focusField).focus()
                                        }

                                    }}
                                >
                                    <Flex direction={`column`} gap={0}>
                                        <Text fz={12} fw={400}>
                                            {t("Add Customer")}
                                        </Text>
                                    </Flex>
                                </Button>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Popover.Dropdown>
            </Popover>
        </Box>
    );
}

export default _addCustomer;