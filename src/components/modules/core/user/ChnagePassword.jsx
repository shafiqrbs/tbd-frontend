import React, { useEffect, useState } from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid,
    Box,
    ScrollArea,
    Tooltip,
    TextInput,
    Switch,
    Group,
    Text,
    LoadingOverlay,
    Modal,
    ActionIcon,
    Stack,
    Drawer,
    Flex, Title,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import {
    IconCheck, IconCoinMonero, IconCurrency, IconDeviceFloppy,
    IconFilter,
    IconInfoCircle,
    IconPlus, IconRefreshDot,
    IconRestore,
    IconSearch,
    IconX,
    IconXboxX
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
import { hasLength, isEmail, isInRange, isNotEmpty, matches, useForm } from "@mantine/form";
import { setFetching, setSearchKeyword, storeEntityData, updateEntityData } from "../../../../store/core/crudSlice.js";


function ChangePassword(props) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const {height,resetPasswordOpened,closeResetPassword} = props
    const dispatch = useDispatch();

    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const form = useForm({
        initialValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
        validate: {
            current_password: isNotEmpty("Current Password is required"),
            new_password: (value) => {
                if (!value) return  t('NewPassword');
                if (value.length < 8) return t('PasswordValidateMessage');
                return null;
            },
            confirm_password: (value, values) => {
                if (!value) return  t('ConfirmPassword');
                if (value !== values.new_password) return  t('PasswordNotMatch');
                return null;
            },

        },
    });

    const handleResetPassword = async (values) => {
        const data = {
            url: "core/change-password",
            data: values,
        };
        const resultAction = await dispatch(storeEntityData(data));
        if (storeEntityData.rejected.match(resultAction)) {
            const fieldErrors = resultAction.payload.errors;
            // Check if there are field validation errors and dynamically set them
            if (fieldErrors) {
                const errorObject = {};
                Object.keys(fieldErrors).forEach(key => {
                    errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
                });
                // Display the errors using your form's `setErrors` function dynamically
                form.setErrors(errorObject);
            }
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            showNotificationComponent( t('PasswordChangeSuccessfully'),'teal');
            setTimeout(() => {
                logout()
            }, 1000)
        }
    };

    const validateField = (field) => {
        form.validateField(field);
    };
    const closeModel = () => {
        closeResetPassword(false);
    };

    function logout() {
        dispatch(setInventoryShowDataEmpty());
        localStorage.clear();
        navigate("/login");
    }

    return (
        <>
            <>
                <Drawer.Root
                    opened={resetPasswordOpened}
                    position="right"
                    onClose={closeModel}
                    size={"30%"}
                >
                    <Drawer.Overlay />
                    <Drawer.Content>
                            <Box ml={2} mr={2} mb={0}>
                                <form onSubmit={form.onSubmit(handleResetPassword)}>
                                    <Box mb={0}>
                                        <Grid columns={9} gutter={{ base: 6 }} >
                                            <Grid.Col span={9} >
                                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} >
                                                    <Box bg={"white"} >
                                                        <Box pl={`xs`} pr={8} pt={'4'} pb={'6'} mb={'4'} className={'boxBackground borderRadiusAll'} >
                                                            <Grid columns={12}>
                                                                <Grid.Col span={6} >
                                                                    <Title order={6} pt={'6'}>{t('ChangePassword')}</Title>
                                                                </Grid.Col>
                                                                <Grid.Col span={6} >
                                                                    <Flex
                                                                        mih={40}
                                                                        gap="md"
                                                                        justify="flex-end"
                                                                        align="center"
                                                                        direction="row"
                                                                        wrap="wrap"
                                                                    >
                                                                        <ActionIcon
                                                                            mr={"sm"}
                                                                            radius="xl"
                                                                            color="grey.6"
                                                                            size="md"
                                                                            variant="outline"
                                                                            onClick={closeModel}
                                                                        >
                                                                            <IconX style={{ width: "100%", height: "100%" }} stroke={1.5} />
                                                                        </ActionIcon>
                                                                    </Flex>
                                                                </Grid.Col>
                                                            </Grid>
                                                        </Box>
                                                        <Box pl={`xs`} pr={'xs'} className={'borderRadiusAll'}>
                                                            <ScrollArea h={height + 80} mt={'md'} scrollbarSize={2} scrollbars="y" type="never">
                                                                <Box mt={'md'}>
                                                                    <PasswordInputForm
                                                                        tooltip={form.errors.current_password ? form.errors.current_password : t('RequiredPassword')}
                                                                        form={form}
                                                                        name="current_password"
                                                                        label={t("CurrentPassword")}
                                                                        placeholder={t("EnterCurrentPassword")}
                                                                        required
                                                                        nextField="new_password"
                                                                        {...form.getInputProps("current_password")}
                                                                    />
                                                                </Box>
                                                                <Box mt={'md'}>
                                                                    <PasswordInputForm
                                                                        tooltip={form.errors.new_password ? form.errors.new_password : t('RequiredPassword')}
                                                                        form={form}
                                                                        name="new_password"
                                                                        label={t("NewPassword")}
                                                                        placeholder={t("EnterNewPassword")}
                                                                        required
                                                                        nextField="confirm_password"
                                                                        {...form.getInputProps("new_password")}
                                                                    />
                                                                </Box>
                                                                <Box mt={'md'}>
                                                                    <PasswordInputForm
                                                                        tooltip={form.errors.confirm_password}
                                                                        form={form}
                                                                        name="confirm_password"
                                                                        label={t("ConfirmPassword")}
                                                                        placeholder={t("EnterConfirmNewPassword")}
                                                                        required
                                                                        {...form.getInputProps("confirm_password")}
                                                                    />
                                                                </Box>
                                                            </ScrollArea>
                                                        </Box>
                                                        <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'2'} mt={4} className={'boxBackground borderRadiusAll'}>
                                                            <Group justify="space-between">
                                                                <Flex
                                                                    gap="md"
                                                                    justify="center"
                                                                    align="center"
                                                                    direction="row"
                                                                    wrap="wrap"
                                                                >
                                                                    <ActionIcon
                                                                        variant="transparent"
                                                                        size="sm"
                                                                        color="red.6"
                                                                        onClick={closeModel}
                                                                        ml={'4'}
                                                                    >
                                                                        <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                                                                    </ActionIcon>
                                                                </Flex>

                                                                <Group gap={8}>
                                                                    <Flex justify="flex-end" align="center" h="100%">
                                                                        <Button
                                                                            variant="transparent"
                                                                            size="xs"
                                                                            color="red.4"
                                                                            type="reset"
                                                                            id=""
                                                                            comboboxProps={{ withinPortal: false }}
                                                                            p={0}
                                                                            rightSection={
                                                                                <IconRefreshDot style={{ width: '100%', height: '60%' }} stroke={1.5} />}
                                                                            onClick={() => {
                                                                                productAddedForm.reset()
                                                                            }}

                                                                        >
                                                                        </Button>
                                                                    </Flex>
                                                                    <Stack align="flex-start">
                                                                        <>
                                                                            {
                                                                                !saveCreateLoading &&
                                                                                <Button
                                                                                    size="xs"
                                                                                    className={'btnPrimaryBg'}
                                                                                    type="submit"
                                                                                    id={"EntityProductFormSubmit"}
                                                                                    leftSection={<IconDeviceFloppy size={16} />}
                                                                                >
                                                                                    <Flex direction={`column`} gap={0}>
                                                                                        <Text fz={14} fw={400}>
                                                                                            {t("ResetPassword")}
                                                                                        </Text>
                                                                                    </Flex>
                                                                                </Button>
                                                                            }
                                                                        </>
                                                                    </Stack>
                                                                </Group>
                                                            </Group>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </form>
                            </Box>

                    </Drawer.Content>
                </Drawer.Root>
            </>

        </>
    );
}

export default ChangePassword;
