import React, {useEffect, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Grid,
    Box,
    ScrollArea,
    Text,
    LoadingOverlay,
    Title,
    Flex,
    Stack,
    Tooltip,
    Image, ActionIcon,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconArrowsExchange,
    IconCheck,
    IconDeviceFloppy, IconUsersGroup,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import InputForm from "../../../form-builders/InputForm";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {
    setEditEntityData,
    setFetching,
    setFormLoading,
    setInsertType,
    updateEntityData, updateEntityDataWithFile,
} from "../../../../store/core/crudSlice.js";
import {notifications} from "@mantine/notifications";
import PasswordInputForm from "../../../form-builders/PasswordInputForm";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import Shortcut from "../../shortcut/Shortcut.jsx";
import SwitchForm from "../../../form-builders/SwitchForm.jsx";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import TextAreaForm from "../../../form-builders/TextAreaForm.jsx";
import getCoreSettingEmployeeGroupDropdownData
    from "../../../global-hook/dropdown/core/getCoreSettingEmployeeGroupDropdownData.js";
import getCoreSettingLocationDropdownData
    from "../../../global-hook/dropdown/core/getCoreSettingLocationDropdownData.js";
import getCoreSettingDesignationDropdownData
    from "../../../global-hook/dropdown/core/getCoreSettingDesignationDropdownData.js";
import getCoreSettingDepartmentDropdownData
    from "../../../global-hook/dropdown/core/getCoreSettingDepartmentDropdownData.js";

import accessControlRoleStaticData from "../../../global-hook/static-json-file/accessControlRole.json"
import androidControlRoleStaticData from "../../../global-hook/static-json-file/androidControlRole.json"

function _UserUpdateForm() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);
    const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
    const formLoading = useSelector((state) => state.crudSlice.formLoading);
    const navigate = useNavigate();

    const [employeeGroupData, setEmployeeGroupData] = useState(null);
    const [departmentData, setDepartmentData] = useState(null);
    const [designationData, setDesignationData] = useState(null);
    const [locationData, setLocationData] = useState(null);

    const form = useForm({
        initialValues: {
            employee_group_id: entityEditData?.employee_group_id || "",
            name: entityEditData?.name || "",
            username: entityEditData?.username || "",
            email: entityEditData?.email || "",
            mobile: entityEditData?.mobile || "",
            enabled: entityEditData?.enabled || 0,
            alternative_email: entityEditData?.alternative_email || null,
            designation_id: entityEditData?.designation_id || null,
            department_id: entityEditData?.department_id || null,
            location_id: entityEditData?.location_id || null,
            address: entityEditData?.address || null,
            about_me: entityEditData?.about_me || null,
        },
        validate: {
            name: (value) => {
                if (!value) return t("NameRequiredMessage");
                if (value.length < 2 || value.length > 20)
                    return t("NameLengthMessage");
                return null;
            },
            username: (value) => {
                if (!value) return t("UserNameRequiredMessage");
                if (value.length < 2 || value.length > 20)
                    return t("NameLengthMessage");
                return null;
            },
            email: (value) => {
                if (!value) return true;

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return t("EmailValidationInvalid");

                return null;
            },
            mobile: (value) => {
                if (!value) return t("MobileValidationRequired");
                if (!/^\d{13}$/.test(value)) return t("MobileValidationDigitCount");
                return null;
            },
            password: (value) => {
                if (value && value.length < 6) return "Password must be at least 6 characters long";
                return null;
            },
            confirm_password: (value, values) => {
                if (values.password && !value) return "Confirm password is required";
                if (values.password && value !== values.password) return "Passwords do not match";
                return null;
            },
        },
    });

    useEffect(() => {
        setFormLoad(true);
        setFormDataForUpdate(true);
    }, [dispatch, formLoading]);

    const handleFormReset = () => {
        if (entityEditData) {
            const originalValues = {
                name: entityEditData?.name || "",
                username: entityEditData?.username || "",
                email: entityEditData?.email || "",
                mobile: entityEditData?.mobile || "",
                password: "",
                confirm_password: "",
            };
            form.setValues(originalValues);
        }
    };

    useEffect(() => {
        if (entityEditData) {
            form.setValues({
                employee_group_id: entityEditData?.employee_group_id || "",
                name: entityEditData?.name || "",
                username: entityEditData?.username || "",
                email: entityEditData?.email || "",
                mobile: entityEditData?.mobile || "",
                enabled: entityEditData?.enabled || 0,
                alternative_email: entityEditData?.alternative_email || null,
                designation_id: entityEditData?.designation_id || null,
                department_id: entityEditData?.department_id || null,
                location_id: entityEditData?.location_id || null,
                address: entityEditData?.address || null,
                about_me: entityEditData?.about_me || null,
            });
        }
        dispatch(setFormLoading(false));
        setTimeout(() => {
            setFormLoad(false);
            setFormDataForUpdate(false);
        }, 500);
    }, [dispatch, entityEditData]);

    useHotkeys(
        [
            [
                "alt+n",
                () => {
                    document.getElementById("name").focus();
                },
            ],
        ],
        []
    );

    useHotkeys(
        [
            [
                "alt+r",
                () => {
                    handleFormReset();
                },
            ],
        ],
        []
    );

    useHotkeys(
        [
            [
                "alt+s",
                () => {
                    document.getElementById("EntityFormSubmit").click();
                },
            ],
        ],
        []
    );

    //start access control role
    const [accessControlRole, setAccessControlRole] = useState(
        accessControlRoleStaticData ? accessControlRoleStaticData : []
    );

    const [defaultGroupData] = useState([
        { Group: "Accounting", actions: [] },
        { Group: "HR & Payroll", actions: [] },
    ]);

    const [selectedAccessControlRoleData, setSelectedAccessControlRoleData] = useState(defaultGroupData);

    useEffect(() => {
        if (entityEditData && Array.isArray(entityEditData.access_control_roles)) {
            if (entityEditData.access_control_roles.length > 0) {
                setSelectedAccessControlRoleData(entityEditData.access_control_roles);
            } else {
                setSelectedAccessControlRoleData(defaultGroupData);
            }
        }
    }, [entityEditData]);

    useEffect(() => {
        if (selectedAccessControlRoleData.length > 0) {
            function removeMatchingData(data1, data2) {
                return data1.map(group1 => {
                    const matchingGroup = data2.find(group2 => group2.Group === group1.Group);

                    if (matchingGroup) {
                        return {
                            ...group1,
                            actions: group1.actions.filter(action1 => {
                                return !matchingGroup.actions.some(action2 => action2.id === action1.id);
                            }),
                        };
                    }
                    return group1;
                });
            }

            const result = removeMatchingData([...accessControlRole], selectedAccessControlRoleData);
            setAccessControlRole(result);
        }
    }, [selectedAccessControlRoleData]);

    const handleSelectAccessControlRoleData = (group, action) => {
        const newAvailableData = accessControlRole.map(g => {
            if (g.Group === group.Group) {
                return {
                    ...g,
                    actions: g.actions.filter(a => a.id !== action.id),
                };
            }
            return g;
        });

        setAccessControlRole(newAvailableData);

        const newSelectedData = selectedAccessControlRoleData.map(g => {
            if (g.Group === group.Group) {
                return {
                    ...g,
                    actions: [...g.actions, action],
                };
            }
            return g;
        });

        setSelectedAccessControlRoleData(newSelectedData);
    };

    const handleDeselectAccessControlRoleData = (group, action) => {
        const newSelectedData = selectedAccessControlRoleData.map(g => {
            if (g.Group === group.Group) {
                return {
                    ...g,
                    actions: g.actions.filter(a => a.id !== action.id),
                };
            }
            return g;
        });

        setSelectedAccessControlRoleData(newSelectedData);

        const newAvailableData = accessControlRole.map(g => {
            if (g.Group === group.Group) {
                return {
                    ...g,
                    actions: [...g.actions, action],
                };
            }
            return g;
        });

        setAccessControlRole(newAvailableData);
    };

    // end access control role

    // start android control roles
    const [androidControlRole, setAndroidControlRole] = useState(
        androidControlRoleStaticData ? androidControlRoleStaticData : []
    );

    const [defaultAndroidGroupData] = useState([
        { Group: "Android Accounting", actions: [] },
        { Group: "Android HR & Payroll", actions: [] },
    ]);

    const [selectedAndroidControlRoleData, setSelectedAndroidControlRoleData] = useState(defaultAndroidGroupData);

    useEffect(() => {
        if (entityEditData && Array.isArray(entityEditData.android_control_role)) {
            if (entityEditData.android_control_role.length > 0) {
                setSelectedAndroidControlRoleData(entityEditData.android_control_role);
            } else {
                setSelectedAndroidControlRoleData(defaultAndroidGroupData);
            }
        }
    }, [entityEditData]);

    useEffect(() => {
        if (selectedAndroidControlRoleData.length > 0) {
            function removeMatchingData(data1, data2) {
                return data1.map((group1) => {
                    const matchingGroup = data2.find((group2) => group2.Group === group1.Group);

                    if (matchingGroup) {
                        return {
                            ...group1,
                            actions: group1.actions.filter((action1) => {
                                return !matchingGroup.actions.some((action2) => action2.id === action1.id);
                            }),
                        };
                    }

                    return group1;
                });
            }

            const result = removeMatchingData([...androidControlRole], selectedAndroidControlRoleData);
            setAndroidControlRole(result);
        }
    }, [selectedAndroidControlRoleData]);
    const handleSelectAndroidControlRoleData = (group, action) => {
        const newAvailableData = androidControlRole.map((g) => {
            if (g.Group === group.Group) {
                return {
                    ...g,
                    actions: g.actions.filter((a) => a.id !== action.id),
                };
            }
            return g;
        });

        setAndroidControlRole(newAvailableData);
        const newSelectedData = selectedAndroidControlRoleData.map((g) => {
            if (g.Group === group.Group) {
                return {
                    ...g,
                    actions: [...g.actions, action],
                };
            }
            return g;
        });

        setSelectedAndroidControlRoleData(newSelectedData);
    };
    const handleDeselectAndroidControlRoleData = (group, action) => {
        const newSelectedData = selectedAndroidControlRoleData.map((g) => {
            if (g.Group === group.Group) {
                return {
                    ...g,
                    actions: g.actions.filter((a) => a.id !== action.id),
                };
            }
            return g;
        });

        setSelectedAndroidControlRoleData(newSelectedData);
        const newAvailableData = androidControlRole.map((g) => {
            if (g.Group === group.Group) {
                return {
                    ...g,
                    actions: [...g.actions, action], // Re-add the deselected action
                };
            }
            return g;
        });

        setAndroidControlRole(newAvailableData);
    };
    // end andriod access role


    const [profileImage, setProfileImage] = useState([]);
    const [digitalSignature, setDigitalSignature] = useState([]);

    const previewsProfile = profileImage.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <>
                <Flex h={150} justify={"center"} align={"center"} mt={"xs"}>
                    <Image
                        h={150}
                        w={150}
                        fit="cover"
                        key={index}
                        src={imageUrl}
                        onLoad={() => URL.revokeObjectURL(imageUrl)}
                    />
                </Flex>
            </>
        );
    });
    const previewsDigitalSignature = digitalSignature.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <>
                <Flex h={150} justify={"center"} align={"center"} mt={"xs"}>
                    <Image
                        h={150}
                        w={150}
                        fit="cover"
                        key={index}
                        src={imageUrl}
                        onLoad={() => URL.revokeObjectURL(imageUrl)}
                    />
                </Flex>
            </>
        );
    });

    return (
        <Box>
            <form
                onSubmit={form.onSubmit((values) => {
                    form.values['access_control_role'] = selectedAccessControlRoleData
                    form.values['android_control_role'] = selectedAndroidControlRoleData

                    modals.openConfirmModal({
                      title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                      children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
                      labels: { confirm: t("Submit"), cancel: t("Cancel") },
                      confirmProps: { color: "red" },
                      onCancel: () => console.log("Cancel"),
                      onConfirm: () => {
                        setSaveCreateLoading(true);
                        const value = {
                          url: "core/user/" + entityEditData.id,
                          data: values,
                        };

                        dispatch(updateEntityData(value));

                        notifications.show({
                          color: "teal",
                          title: t("UpdateSuccessfully"),
                          icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                          loading: false,
                          autoClose: 700,
                          style: { backgroundColor: "lightgray" },
                        });

                        setTimeout(() => {
                          form.reset();
                          dispatch(setInsertType("create"));
                          dispatch(setEditEntityData([]));
                          dispatch(setFetching(true));
                          setSaveCreateLoading(false);
                          navigate("/core/user", { replace: true });
                        }, 700);
                      },
                    });
                })}
            >
                <Box>
                    <Grid columns={24} gutter={{base: 8}}>
                        {/* start 1st Box */}
                        <Grid.Col span={7}>
                            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                                <Box bg={"white"}>
                                    <Box
                                        pl={`xs`}
                                        pr={8}
                                        pt={"6"}
                                        pb={"6"}
                                        mb={"4"}
                                        className={"boxBackground borderRadiusAll"}
                                    >
                                        <Grid>
                                            <Grid.Col span={6}>
                                                <Title order={6} pt={"6"} pb={4}>
                                                    {t("UpdateUser")}
                                                </Title>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                    <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                        <ScrollArea
                                            h={height}
                                            scrollbarSize={2}
                                            scrollbars="y"
                                            type="never"
                                        >
                                            <Box>
                                                <LoadingOverlay
                                                    visible={formLoad}
                                                    zIndex={1000}
                                                    overlayProps={{radius: "sm", blur: 2}}
                                                    loaderProps={{color: "red.6"}}
                                                />
                                                <Box>
                                                    <Grid gutter={{base: 2}}>
                                                        <Grid.Col span={11}>
                                                            <Box mt={'8'}>
                                                                <SelectForm
                                                                    tooltip={t('EmployeeGroup')}
                                                                    label={t('EmployeeGroup')}
                                                                    placeholder={t('ChooseEmployeeGroup')}
                                                                    required={true}
                                                                    nextField={'name'}
                                                                    name={'employee_group_id'}
                                                                    form={form}
                                                                    dropdownValue={getCoreSettingEmployeeGroupDropdownData()}
                                                                    mt={8}
                                                                    id={'employee_group_id'}
                                                                    searchable={false}
                                                                    value={employeeGroupData?employeeGroupData:String(entityEditData.employee_group_id)}
                                                                    changeValue={setEmployeeGroupData}
                                                                />
                                                            </Box>
                                                        </Grid.Col>
                                                        <Grid.Col span={1}>
                                                            <Box pt={'xl'}>
                                                                <Tooltip
                                                                    ta="center"
                                                                    multiline
                                                                    bg={'orange.8'}
                                                                    offset={{crossAxis: '-110', mainAxis: '5'}}
                                                                    withArrow
                                                                    transitionProps={{duration: 200}}
                                                                    label={t('QuickCustomerGroup')}
                                                                >
                                                                    <ActionIcon variant="outline" bg={'white'}
                                                                                size={'lg'} color="red.5" mt={'1'}
                                                                                aria-label="Settings" onClick={() => {
                                                                        setGroupDrawer(true)
                                                                    }}>
                                                                        <IconUsersGroup
                                                                            style={{width: '100%', height: '70%'}}
                                                                            stroke={1.5}/>
                                                                    </ActionIcon>
                                                                </Tooltip>
                                                            </Box>
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <InputForm
                                                        tooltip={t("UserNameValidateMessage")}
                                                        label={t("Name")}
                                                        placeholder={t("Name")}
                                                        required={true}
                                                        nextField={"username"}
                                                        form={form}
                                                        name={"name"}
                                                        mt={0}
                                                        id={"name"}
                                                    />
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <InputForm
                                                        form={form}
                                                        tooltip={t("UserNameValidateMessage")}
                                                        label={t("UserName")}
                                                        placeholder={t("UserName")}
                                                        required={true}
                                                        name={"username"}
                                                        id={"username"}
                                                        nextField={"email"}
                                                        mt={8}
                                                    />
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <InputForm
                                                        form={form}
                                                        tooltip={t("RequiredAndInvalidEmail")}
                                                        label={t("Email")}
                                                        placeholder={t("Email")}
                                                        required={true}
                                                        name={"email"}
                                                        id={"email"}
                                                        nextField={"mobile"}
                                                        mt={8}
                                                    />
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <PhoneNumber
                                                        tooltip={
                                                            form.errors.mobile
                                                                ? form.errors.mobile
                                                                : t("MobileValidateMessage")
                                                        }
                                                        label={t("Mobile")}
                                                        placeholder={t("Mobile")}
                                                        required={true}
                                                        nextField={"password"}
                                                        name={"mobile"}
                                                        form={form}
                                                        mt={8}
                                                        id={"mobile"}
                                                    />
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <PasswordInputForm
                                                        form={form}
                                                        tooltip={t("RequiredPassword")}
                                                        label={t("Password")}
                                                        placeholder={t("Password")}
                                                        required={false}
                                                        name={"password"}
                                                        id={"password"}
                                                        nextField={"confirm_password"}
                                                        mt={8}
                                                    />
                                                </Box>
                                                <Box mt={"xs"}>
                                                    <PasswordInputForm
                                                        form={form}
                                                        tooltip={t("ConfirmPasswordValidateMessage")}
                                                        label={t("ConfirmPassword")}
                                                        placeholder={t("ConfirmPassword")}
                                                        required={false}
                                                        name={"confirm_password"}
                                                        id={"confirm_password"}
                                                        nextField={"EntityFormSubmit"}
                                                        mt={8}
                                                    />
                                                </Box>
                                            </Box>
                                        </ScrollArea>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid.Col>
                        {/* end 1st Box */}

                        {/* start 2nd Box */}
                        <Grid.Col span={9}>
                            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                                <Box bg={"white"}>
                                    <Box
                                        pl={`xs`}
                                        pr={8}
                                        pt={"6"}
                                        pb={"6"}
                                        mb={4}
                                        className={"boxBackground borderRadiusAll"}
                                    >
                                        <Grid>
                                            <Grid.Col span={6}>
                                                <Title order={6} pt={4} pb={4}>
                                                    {t("Email&ACLInformation")}
                                                </Title>
                                            </Grid.Col>
                                            <Grid.Col span={6}></Grid.Col>
                                        </Grid>
                                    </Box>
                                </Box>
                                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                    <ScrollArea
                                        h={height + 1}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                    >
                                        <Grid columns={12} gutter={0}>
                                            <Grid.Col span={6}>
                                                <Box mt={"md"} ml={"xs"}>
                                                    <LoadingOverlay
                                                        visible={formLoad}
                                                        zIndex={1000}
                                                        overlayProps={{radius: "sm", blur: 2}}
                                                        loaderProps={{color: "red.6"}}
                                                    />
                                                    <Grid gutter={{base: 1}}>
                                                        <Grid.Col span={2}>
                                                            <SwitchForm
                                                                tooltip={t("Status")}
                                                                label=""
                                                                nextField={"EntityFormSubmit"}
                                                                name={"enabled"}
                                                                form={form}
                                                                color="red"
                                                                id={"enabled"}
                                                                position={"left"}
                                                                checked={entityEditData.enabled || false}
                                                            />
                                                        </Grid.Col>
                                                        <Grid.Col ml={"xs"} span={6} fz={"sm"} pt={"1"}>
                                                            {t("Enabled")}
                                                        </Grid.Col>
                                                    </Grid>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                        <Box mt={"sm"}>
                                            <Text fz={14} fw={400}>
                                                {t("AccessControlRole")}
                                            </Text>
                                        </Box>
                                        <Grid columns={24} gutter={0}>
                                            <Grid.Col span={11}>
                                                <Box
                                                    mt={"xs"}
                                                    className={"borderRadiusAll"}
                                                    bg={"white"}
                                                >
                                                    <ScrollArea
                                                        h={height / 2 - 76}
                                                        scrollbarSize={2}
                                                        scrollbars="y"
                                                        type="never"
                                                        pb={"xs"}
                                                    >
                                                        {accessControlRole
                                                            .filter((group) => group.actions.length > 0)
                                                            .map((group) => (
                                                                <Box key={group.Group} p={"sm"}>
                                                                    <Text fz={"14"} fw={400} c={"dimmed"}>
                                                                        {group.Group}
                                                                    </Text>
                                                                    {group.actions.map((action) => (
                                                                        <Box
                                                                            key={action.id}
                                                                            pl={"xs"}
                                                                            pb={0}
                                                                            mb={0}
                                                                            pt={"8"}
                                                                            onClick={() =>
                                                                                handleSelectAccessControlRoleData(group, action)
                                                                            }
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    borderBottom: " 1px solid #e9ecef",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                                pb={2}
                                                                                fz={"14"}
                                                                                fw={400}
                                                                            >
                                                                                {action.label}
                                                                            </Text>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            ))}
                                                    </ScrollArea>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={2}>
                                                <Flex
                                                    h={height / 2 - 76}
                                                    mt={"xs"}
                                                    align={"center"}
                                                    justify={"center"}
                                                >
                                                    <IconArrowsExchange
                                                        style={{width: "70%", height: "70%"}}
                                                        stroke={1}
                                                    />
                                                </Flex>
                                            </Grid.Col>
                                            <Grid.Col span={11}>
                                                <Box
                                                    mt={"xs"}
                                                    className={"borderRadiusAll"}
                                                    bg={"white"}
                                                >
                                                    <ScrollArea
                                                        h={height / 2 - 76}
                                                        scrollbarSize={2}
                                                        scrollbars="y"
                                                        type="never"
                                                        pb={"xs"}
                                                    >
                                                        {selectedAccessControlRoleData
                                                            .filter((group) => group.actions.length > 0)
                                                            .map((group) => (
                                                                <Box key={group.Group} p={"sm"}>
                                                                    <Text fz={"14"} fw={400} c={"dimmed"}>
                                                                        {group.Group}
                                                                    </Text>
                                                                    {group.actions.map((action) => (
                                                                        <Box
                                                                            key={action.id}
                                                                            pl={"xs"}
                                                                            pb={0}
                                                                            mb={0}
                                                                            pt={"8"}
                                                                            onClick={() =>
                                                                                handleDeselectAccessControlRoleData(group, action)
                                                                            }
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    borderBottom: " 1px solid #e9ecef",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                                pb={2}
                                                                                fz={"14"}
                                                                                fw={400}
                                                                            >
                                                                                {action.label}
                                                                            </Text>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            ))}
                                                    </ScrollArea>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                        <Box mt={"md"}>
                                            <Text fz={14} fw={400}>
                                                {t("AndroidControlRoles")}
                                            </Text>
                                        </Box>
                                        <Grid columns={24} gutter={0} pb={"xs"}>
                                            <Grid.Col span={11}>
                                                <Box
                                                    mt={"xs"}
                                                    className={"borderRadiusAll"}
                                                    bg={"white"}
                                                >
                                                    <ScrollArea
                                                        h={height / 2 - 76}
                                                        scrollbarSize={2}
                                                        scrollbars="y"
                                                        type="never"
                                                        pb={"xs"}
                                                    >
                                                        {androidControlRole
                                                            .filter((group) => group.actions.length > 0)
                                                            .map((group) => (
                                                                <Box key={group.Group} p={"sm"}>
                                                                    <Text fz={"14"} fw={400} c={"dimmed"}>
                                                                        {group.Group}
                                                                    </Text>
                                                                    {group.actions.map((action) => (
                                                                        <Box
                                                                            key={action.id}
                                                                            pl={"xs"}
                                                                            pb={0}
                                                                            mb={0}
                                                                            pt={"8"}
                                                                            onClick={() =>
                                                                                handleSelectAndroidControlRoleData(group, action)
                                                                            }
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    borderBottom: " 1px solid #e9ecef",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                                pb={2}
                                                                                fz={"14"}
                                                                                fw={400}
                                                                            >
                                                                                {action.label}
                                                                            </Text>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            ))}
                                                    </ScrollArea>
                                                </Box>
                                            </Grid.Col>
                                            <Grid.Col span={2}>
                                                <Flex
                                                    h={height / 2 - 76}
                                                    mt={"xs"}
                                                    align={"center"}
                                                    justify={"center"}
                                                >
                                                    <IconArrowsExchange
                                                        style={{width: "70%", height: "70%"}}
                                                        stroke={1}
                                                    />
                                                </Flex>
                                            </Grid.Col>
                                            <Grid.Col span={11}>
                                                <Box
                                                    mt={"xs"}
                                                    className={"borderRadiusAll"}
                                                    bg={"white"}
                                                >
                                                    <ScrollArea
                                                        h={height / 2 - 76}
                                                        scrollbarSize={2}
                                                        scrollbars="y"
                                                        type="never"
                                                        pb={"xs"}
                                                    >
                                                        {selectedAndroidControlRoleData
                                                            .filter((group) => group.actions.length > 0)
                                                            .map((group) => (
                                                                <Box key={group.Group} p={"sm"}>
                                                                    <Text fz={"14"} fw={400} c={"dimmed"}>
                                                                        {group.Group}
                                                                    </Text>
                                                                    {group.actions.map((action) => (
                                                                        <Box
                                                                            key={action.id}
                                                                            pl={"xs"}
                                                                            pb={0}
                                                                            mb={0}
                                                                            pt={"8"}
                                                                            onClick={() =>
                                                                                handleDeselectAndroidControlRoleData(group, action)
                                                                            }
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    borderBottom: " 1px solid #e9ecef",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                                pb={2}
                                                                                fz={"14"}
                                                                                fw={400}
                                                                            >
                                                                                {action.label}
                                                                            </Text>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            ))}
                                                    </ScrollArea>
                                                </Box>
                                            </Grid.Col>
                                        </Grid>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Grid.Col>
                        {/* end 2nd Box */}

                        {/* start 3rd Box */}
                        <Grid.Col span={7}>
                            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                                <Box bg={"white"}>
                                    <Box
                                        pl={`xs`}
                                        pr={8}
                                        pt={"6"}
                                        pb={"6"}
                                        mb={4}
                                        className={"boxBackground borderRadiusAll"}
                                    >
                                        <Grid>
                                            <Grid.Col span={6}>
                                                <Title order={6} pt={4} pb={4}>
                                                    {t("Address&Others")}
                                                </Title>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Stack right align="flex-end">
                                                    <>
                                                        {!saveCreateLoading && isOnline && (
                                                            <Button
                                                                size="xs"
                                                                color={`green.8`}
                                                                type="submit"
                                                                id="EntityFormSubmit"
                                                                leftSection={<IconDeviceFloppy size={16}/>}
                                                            >
                                                                <Flex direction={`column`} gap={0}>
                                                                    <Text fz={14} fw={400}>
                                                                        {t("UpdateAndSave")}
                                                                    </Text>
                                                                </Flex>
                                                            </Button>
                                                        )}
                                                    </>
                                                </Stack>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </Box>
                                <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                                    <ScrollArea
                                        h={height}
                                        scrollbarSize={2}
                                        scrollbars="y"
                                        type="never"
                                    >
                                        <Box>
                                            <LoadingOverlay
                                                visible={formLoad}
                                                zIndex={1000}
                                                overlayProps={{radius: "sm", blur: 2}}
                                                loaderProps={{color: "red.6"}}
                                            />
                                            <Box mt={"xs"}>
                                                <InputForm
                                                    form={form}
                                                    tooltip={t("RequiredAndInvalidEmail")}
                                                    label={t("AlternativeEmail")}
                                                    placeholder={t("AlternativeEmail")}
                                                    required={false}
                                                    name={"alternative_email"}
                                                    id={"alternative_email"}
                                                    nextField={"designation_id"}
                                                    mt={8}
                                                />
                                            </Box>
                                            <Box>
                                                <Grid gutter={{base:2}}>
                                                    <Grid.Col span={11}>
                                                        <Box mt={'8'}>
                                                            <SelectForm
                                                                tooltip={t('Designation')}
                                                                label={t('Designation')}
                                                                placeholder={t('ChooseDesignation')}
                                                                required={false}
                                                                nextField={'department_id'}
                                                                name={'designation_id'}
                                                                form={form}
                                                                dropdownValue={getCoreSettingDesignationDropdownData()}
                                                                mt={8}
                                                                id={'designation_id'}
                                                                searchable={false}
                                                                value={designationData?designationData:String(entityEditData.designation_id)}
                                                                changeValue={setDesignationData}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                ta="center"
                                                                multiline
                                                                bg={'orange.8'}
                                                                offset={{crossAxis: '-110', mainAxis: '5'}}
                                                                withArrow
                                                                transitionProps={{duration: 200}}
                                                                label={t('QuickCustomerGroup')}
                                                            >
                                                                <ActionIcon variant="outline" bg={'white'} size={'lg'}
                                                                            color="red.5" mt={'1'} aria-label="Settings"
                                                                            onClick={() => {
                                                                                setGroupDrawer(true)
                                                                            }}>
                                                                    <IconUsersGroup
                                                                        style={{width: '100%', height: '70%'}}
                                                                        stroke={1.5}/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>
                                            <Box>
                                                <Grid gutter={{base: 2}}>
                                                    <Grid.Col span={11}>
                                                        <Box mt={'8'}>
                                                            <SelectForm
                                                                tooltip={t('Department')}
                                                                label={t('Department')}
                                                                placeholder={t('ChooseDepartment')}
                                                                required={false}
                                                                nextField={'location_id'}
                                                                name={'department_id'}
                                                                form={form}
                                                                dropdownValue={getCoreSettingDepartmentDropdownData()}
                                                                mt={8}
                                                                id={'department_id'}
                                                                searchable={false}
                                                                value={departmentData?designationData:String(entityEditData.department_id)}
                                                                changeValue={setDepartmentData}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                ta="center"
                                                                multiline
                                                                bg={'orange.8'}
                                                                offset={{crossAxis: '-110', mainAxis: '5'}}
                                                                withArrow
                                                                transitionProps={{duration: 200}}
                                                                label={t('QuickCustomerGroup')}
                                                            >
                                                                <ActionIcon variant="outline" bg={'white'} size={'lg'}
                                                                            color="red.5" mt={'1'} aria-label="Settings"
                                                                            onClick={() => {
                                                                                setGroupDrawer(true)
                                                                            }}>
                                                                    <IconUsersGroup
                                                                        style={{width: '100%', height: '70%'}}
                                                                        stroke={1.5}/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>

                                            <Box>
                                                <Grid gutter={{base: 2}}>
                                                    <Grid.Col span={11}>
                                                        <Box mt={'8'}>
                                                            <SelectForm
                                                                tooltip={t('Location')}
                                                                label={t('Location')}
                                                                placeholder={t('ChooseLocation')}
                                                                required={false}
                                                                nextField={'address'}
                                                                name={'location_id'}
                                                                form={form}
                                                                dropdownValue={getCoreSettingLocationDropdownData()}
                                                                mt={8}
                                                                id={'location_id'}
                                                                searchable={false}
                                                                value={locationData?locationData:String(entityEditData.location_id)}
                                                                changeValue={setLocationData}
                                                            />
                                                        </Box>
                                                    </Grid.Col>
                                                    <Grid.Col span={1}>
                                                        <Box pt={'xl'}>
                                                            <Tooltip
                                                                ta="center"
                                                                multiline
                                                                bg={'orange.8'}
                                                                offset={{crossAxis: '-110', mainAxis: '5'}}
                                                                withArrow
                                                                transitionProps={{duration: 200}}
                                                                label={t('QuickCustomerGroup')}
                                                            >
                                                                <ActionIcon variant="outline" bg={'white'} size={'lg'}
                                                                            color="red.5" mt={'1'} aria-label="Settings"
                                                                            onClick={() => {
                                                                                setGroupDrawer(true)
                                                                            }}>
                                                                    <IconUsersGroup
                                                                        style={{width: '100%', height: '70%'}}
                                                                        stroke={1.5}/>
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        </Box>
                                                    </Grid.Col>
                                                </Grid>
                                            </Box>

                                            <Box mt={"xs"}>
                                                <TextAreaForm
                                                    tooltip={t("Address")}
                                                    label={t("Address")}
                                                    placeholder={t("Address")}
                                                    required={false}
                                                    nextField={"about_me"}
                                                    name={"address"}
                                                    form={form}
                                                    mt={8}
                                                    id={"address"}
                                                />
                                            </Box>
                                            <Box mt={"xs"}>
                                                <TextAreaForm
                                                    tooltip={t("AboutMe")}
                                                    label={t("AboutMe")}
                                                    placeholder={t("AboutMe")}
                                                    required={false}
                                                    nextField={"is_selected"}
                                                    name={"about_me"}
                                                    form={form}
                                                    mt={8}
                                                    id={"about_me"}
                                                />
                                            </Box>
                                            <Box mt={"sm"}>
                                                <Text fz={14} fw={400} mb={2}>
                                                    {t("ProfileImage")}
                                                </Text>
                                                <Tooltip
                                                    label={t("ChooseImage")}
                                                    opened={
                                                        "path" in form.errors && !!form.errors["path"]
                                                    }
                                                    px={16}
                                                    py={2}
                                                    position="top-end"
                                                    color="red"
                                                    withArrow
                                                    offset={2}
                                                    zIndex={999}
                                                    transitionProps={{
                                                        transition: "pop-bottom-left",
                                                        duration: 500,
                                                    }}
                                                >
                                                    <Dropzone
                                                        label={t("ChooseImage")}
                                                        accept={IMAGE_MIME_TYPE}
                                                        onDrop={(e) => {
                                                            const value = {
                                                                url: "core/user/image-inline/" + entityEditData.id,
                                                                data: {
                                                                    profile_image :e[0]
                                                                },
                                                            };
                                                            dispatch(updateEntityDataWithFile(value))
                                                            setProfileImage(e);
                                                        }}
                                                    >
                                                        <Text ta="center">
                                                            {profileImage && profileImage.length > 0 && profileImage[0].path ? (
                                                                profileImage[0].path
                                                            ) : (
                                                                <span>Drop Profile Image Here (150 * 150){" "}<span style={{color: "red"}}>*</span></span>
                                                            )}
                                                        </Text>
                                                    </Dropzone>
                                                </Tooltip>
                                                {profileImage.length > 0?previewsProfile:
                                                    <Flex h={150} justify={"center"} align={"center"} mt={"xs"}>
                                                        <Image
                                                            h={150}
                                                            w={150}
                                                            fit="cover"
                                                            key={9999}
                                                            src={entityEditData.path}
                                                        />
                                                    </Flex>
                                                }
                                            </Box>
                                            <Box mt={"sm"}>
                                                <Text fz={14} fw={400} mb={2}>
                                                    {t("DigitalSignature")}
                                                </Text>
                                                <Tooltip
                                                    label={t("ChooseImage")}
                                                    opened={
                                                        "path" in form.errors && !!form.errors["path"]
                                                    }
                                                    px={16}
                                                    py={2}
                                                    position="top-end"
                                                    color="red"
                                                    withArrow
                                                    offset={2}
                                                    zIndex={999}
                                                    transitionProps={{
                                                        transition: "pop-bottom-left",
                                                        duration: 500,
                                                    }}
                                                >
                                                    <Dropzone
                                                        label={t("ChooseImage")}
                                                        accept={IMAGE_MIME_TYPE}
                                                        onDrop={(e) => {
                                                            const value = {
                                                                url: "core/user/image-inline/" + entityEditData.id,
                                                                data: {
                                                                    digital_signature :e[0]
                                                                },
                                                            };
                                                            dispatch(updateEntityDataWithFile(value))
                                                            setDigitalSignature(e);
                                                        }}
                                                    >
                                                        <Text ta="center">
                                                            {digitalSignature && digitalSignature.length > 0 && digitalSignature[0].path ? (
                                                                digitalSignature[0].path
                                                            ) : (
                                                                <span>Drop Digital Signature Here (150 * 150){" "}<span style={{color: "red"}}>*</span></span>
                                                            )}
                                                        </Text>
                                                    </Dropzone>
                                                </Tooltip>
                                                {digitalSignature.length > 0?previewsDigitalSignature:
                                                    <Flex h={150} justify={"center"} align={"center"} mt={"xs"}>
                                                        <Image
                                                            h={150}
                                                            w={150}
                                                            fit="cover"
                                                            key={9999}
                                                            src={entityEditData.signature_path}
                                                        />
                                                    </Flex>
                                                }
                                            </Box>
                                        </Box>
                                    </ScrollArea>
                                </Box>
                            </Box>
                        </Grid.Col>
                        {/* end 3rd Box */}

                        {/* start 4rd Box */}
                        <Grid.Col span={1}>
                            <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
                                <Shortcut
                                    handleFormReset={handleFormReset}
                                    entityEditData={entityEditData}
                                    form={form}
                                    FormSubmit={"EntityFormSubmit"}
                                    Name={"name"}
                                    inputType="select"
                                />
                            </Box>
                        </Grid.Col>
                        {/* start 4rd Box */}
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

export default _UserUpdateForm;
