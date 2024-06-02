import {ActionIcon, Box, Button, Flex, Grid, Popover, Text, Tooltip} from "@mantine/core";
import {IconDeviceFloppy, IconRefreshDot, IconUserPlus} from "@tabler/icons-react";
import InputForm from "../../form-builders/InputForm.jsx";
import {storeEntityData} from "../../../store/core/crudSlice.js";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {isNotEmpty, useForm} from "@mantine/form";

function _addVendor(props) {
    const {setRefreshVendorDropdown,focusField,fieldPrefix} = props

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    /*START CUSTOMER ADDED FORM INITIAL*/
    const [vendorAddFormOpened,setVendorAddFormOpened] = useState(false)
    const vendorAddedForm = useForm({
        initialValues: {
            company_name: '',
            mobile: '',
            name: ''
        },
        validate: {
            company_name: isNotEmpty(),
            mobile: isNotEmpty(),
            name: isNotEmpty()
        }
    });
    /*END CUSTOMER ADDED FORM INITIAL*/


    return (
        <Box pt={'xs'}>
            <Popover
                width={'450'}
                trapFocus
                position="bottom"
                withArrow
                shadow="xl"
                opened={vendorAddFormOpened}
                onChange={setVendorAddFormOpened}
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
                        label={t('InstantVendorCreate')}
                    >
                        <ActionIcon
                            fullWidth
                            variant="outline"
                            bg={'white'}
                            size={'lg'}
                            color="red.5"
                            mt={'1'}
                            aria-label="Settings"
                            onClick={() => setVendorAddFormOpened(true)}
                        >
                            <IconUserPlus style={{ width: '100%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                    <Box mt={'xs'}>
                        <InputForm
                            tooltip={t('CompanyNameValidateMessage')}
                            label={t('CompanyName')}
                            placeholder={t('CompanyName')}
                            required={true}
                            nextField={fieldPrefix+'VendorName'}
                            form={vendorAddedForm}
                            name={'company_name'}
                            mt={0}
                            id={fieldPrefix+'company_name'}
                        />
                    </Box>
                    <Box mt={'xs'}>
                        <InputForm
                            form={vendorAddedForm}
                            tooltip={t('VendorNameValidateMessage')}
                            label={t('VendorName')}
                            placeholder={t('VendorName')}
                            required={true}
                            name={'name'}
                            id={fieldPrefix+'VendorName'}
                            nextField={fieldPrefix+'VendorMobile'}
                            mt={8}
                        />
                    </Box>
                    <Box mt={'xs'}>
                        <InputForm
                            form={vendorAddedForm}
                            tooltip={t('MobileValidateMessage')}
                            label={t('VendorMobile')}
                            placeholder={t('VendorMobile')}
                            required={true}
                            name={'mobile'}
                            id={fieldPrefix+'VendorMobile'}
                            nextField={fieldPrefix+'EntityFormSubmit'}
                            mt={8}
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
                                    id={fieldPrefix+"EntityFormSubmit"}
                                    leftSection={<IconDeviceFloppy size={16} />}
                                    onClick={() => {
                                        let validation = true
                                        if (!vendorAddedForm.values.name) {
                                            validation = false
                                            vendorAddedForm.setFieldError('name', true);
                                        }
                                        if (!vendorAddedForm.values.mobile) {
                                            validation = false
                                            vendorAddedForm.setFieldError('mobile', true);
                                        }
                                        if (!vendorAddedForm.values.company_name) {
                                            validation = false
                                            vendorAddedForm.setFieldError('company_name', true);
                                        }

                                        if (validation) {
                                            const value = {
                                                url: 'core/vendor',
                                                data: vendorAddedForm.values
                                            }
                                            dispatch(storeEntityData(value))

                                            vendorAddedForm.reset()
                                            setRefreshVendorDropdown(true)
                                            setVendorAddFormOpened(false)
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

export default _addVendor;