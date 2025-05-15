import React, {useEffect, useRef, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Flex,
    Grid,
    Box,
    ScrollArea,
    Text,
    Title,
    Stack,
    Group,
    ActionIcon,
    SegmentedControl,
    Center,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconCheck,
    IconDeviceFloppy,
    IconRefreshDot,
    IconUserCircle,
    IconX,
    IconXboxX,
} from "@tabler/icons-react";
import {useDispatch} from "react-redux";
import {hasLength, useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import InputForm from "../../../../form-builders/InputForm.jsx";
import PhoneNumber from "../../../../form-builders/PhoneNumberInput.jsx";
import SelectForm from "../../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../../form-builders/TextAreaForm.jsx";
import tableCss from "../../../../../assets/css/Table.module.css";
import {DataTable} from "mantine-datatable";
import {showNotificationComponent} from "../../../../core-component/showNotificationComponent.jsx";
import {storeEntityData} from "../../../../../store/core/crudSlice.js";

function _AddCustomerFormPos(props) {
    const {
        setCustomerDrawer,
        setRefreshCustomerDropdown,
        focusField,
        fieldPrefix,
        customersDropdownData,
        setCustomerId,
        customerId,
        locationDropdown,
        customerGroupDropdownData,
        customerObject,
        setCustomerObject,
        enableTable,
        tableId,
        updateTableCustomer,
        clearTableCustomer,
        setReloadInvoiceData
    } = props;

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const effectRan = useRef(false);
    const [customerGroupData, setCustomerGroupData] = useState(null);
    const [locationData, setLocationData] = useState(null);

    const [customerIdForReceiver, setCustomerIdForReceiver] = useState(null);
    const [indexData, setIndexData] = useState([]);
    const customerDetails = React.useMemo(() => {
        if (customerObject && customerId) {
            return (
                <Box>
                    <Grid columns={24}>
                        <Grid.Col span={8} align={"left"} fw={"600"} fz={"14"}>
                            {t("Outstanding")}
                        </Grid.Col>
                        <Grid.Col span={1}>:</Grid.Col>
                        <Grid.Col span={"auto"}>
                            {customerObject &&
                                customerObject.balance &&
                                customerObject.balance}
                        </Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                            {t("CustomerId")}
                        </Grid.Col>
                        <Grid.Col span={"1"}>:</Grid.Col>
                        <Grid.Col span={"auto"}>
                            {customerObject && customerObject.id && customerObject.id}
                        </Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                            {t("Name")}
                        </Grid.Col>
                        <Grid.Col span={"1"}>:</Grid.Col>
                        <Grid.Col span={"auto"}>
                            {customerObject && customerObject.name && customerObject.name}
                        </Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                            {t("Mobile")}
                        </Grid.Col>
                        <Grid.Col span={"1"}>:</Grid.Col>
                        <Grid.Col span={"auto"}>
                            {customerObject && customerObject.mobile && customerObject.mobile}
                        </Grid.Col>
                    </Grid>

                    <Grid columns={24}>
                        <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                            {t("AlternativeMobile")}
                        </Grid.Col>
                        <Grid.Col span={"1"}>:</Grid.Col>
                        <Grid.Col span={"auto"}>
                            {customerObject &&
                                customerObject.alternative_mobile &&
                                customerObject.alternative_mobile}
                        </Grid.Col>
                    </Grid>
                    <Grid columns={24}>
                        <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                            {t("Email")}
                        </Grid.Col>
                        <Grid.Col span={"1"}>:</Grid.Col>
                        <Grid.Col span={"auto"}>
                            {customerObject && customerObject.email && customerObject.email}
                        </Grid.Col>
                    </Grid>

                    <Grid columns={24}>
                        <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                            {t("ReferenceId")}
                        </Grid.Col>
                        <Grid.Col span={"1"}>:</Grid.Col>
                        <Grid.Col span={"auto"}>
                            {customerObject &&
                                customerObject.reference_id &&
                                customerObject.reference_id}
                        </Grid.Col>
                    </Grid>

                    <Grid columns={24}>
                        <Grid.Col span={"8"} align={"left"} fw={"600"} fz={"14"}>
                            {t("Created")}
                        </Grid.Col>
                        <Grid.Col span={"1"}>:</Grid.Col>
                        <Grid.Col span={"auto"}>
                            {customerObject &&
                                customerObject.created_date &&
                                customerObject.created_date}
                        </Grid.Col>
                    </Grid>
                </Box>
            );
        }
        return null;
    }, [customerObject, customerId, t]);

    useEffect(() => {
        !effectRan.current &&
        (setTimeout(() => {
            const element = document.getElementById(fieldPrefix + "name");
            if (element) {
                element.focus();
            }
        }, 100),
            (effectRan.current = true));
    }, []);
    const customerAddedForm = useForm({
        initialValues: {
            name: "",
            mobile: "",
            customer_group_id: "",
            email: "",
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            mobile: (value) => {
                if (!value) return t("MobileValidationRequired");
                return null;
            },
            email: (value) => {
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return true;
                }
                return null;
            },
        },
    });
    const receiverAddedForm = useForm({
        initialValues: {
            name: "",
            customer_id: "",
            mobile: "",
        },
        validate: {
            name: hasLength({min: 2, max: 20}),
            mobile: (value) => {
                if (!value) return t("MobileValidationRequired");
                return null;
            },
            customer_id: (value) => {
                if (!value) return t("CustomerValidationRequired");
                return null;
            },
        },
    });
    const closeModel = () => {
        if (enableTable && tableId) {
            clearTableCustomer(tableId);
            setCustomerId(null);
            setCustomerObject({});
        } else {
            setCustomerId(null);
            setCustomerObject({});
            customerAddedForm.reset();
            receiverAddedForm.reset();
        }
        setCustomerDrawer(false);
    };
    const [value, setValue] = useState("Existing");
    return (
        <>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                <Box>
                    <SegmentedControl
                        styles={{
                            label: {color: "white"},
                        }}
                        bg={"#1f2b32"}
                        color="#fa5252"
                        withItemsBorders={false}
                        fullWidth
                        pt={6}
                        value={value}
                        onChange={setValue}
                        data={[
                            {
                                label: (
                                    <Center style={{gap: 10}}>
                                        <Text fw={600}>{t("Existing")}</Text>
                                    </Center>
                                ),
                                value: "Existing",
                            },
                            {
                                label: (
                                    <Center style={{gap: 10}}>
                                        <Text fw={600}>{t("NewCustomer")}</Text>
                                    </Center>
                                ),
                                value: "New",
                            },
                            {
                                label: (
                                    <Center style={{gap: 10}}>
                                        <Text fw={600}>{t("NewReceiver")}</Text>
                                    </Center>
                                ),
                                value: "ReceivedBy",
                            },
                        ]}
                    ></SegmentedControl>
                </Box>
                {value === "New" ? (
                    <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                        <form
                            id="customerAddedForm"
                            onSubmit={customerAddedForm.onSubmit((values) => {
                                modals.openConfirmModal({
                                    title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                                    children: (
                                        <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                    ),
                                    labels: {confirm: t("Submit"), cancel: t("Cancel")},
                                    confirmProps: {color: "red"},
                                    onCancel: () => console.log("Cancel"),
                                    onConfirm: async () => {
                                        setSaveCreateLoading(true);
                                        const value = {
                                            url: "core/customer",
                                            data: values,
                                        };
                                        try {
                                            const response = await dispatch(
                                                storeEntityData(value)
                                            ).unwrap();
                                            console.log("Customer creation response:", response);

                                            notifications.show({
                                                color: "teal",
                                                title: t("CreateSuccessfully"),
                                                icon: (
                                                    <IconCheck
                                                        style={{width: rem(18), height: rem(18)}}
                                                    />
                                                ),
                                                loading: false,
                                                autoClose: 700,
                                                style: {backgroundColor: "lightgray"},
                                            });
                                            if (response && response?.data?.data) {
                                                const newCustomer = response?.data?.data;
                                                const coreCustomers = localStorage.getItem(
                                                    "core-customers"
                                                )
                                                    ? JSON.parse(localStorage.getItem("core-customers"))
                                                    : [];
                                                const updatedCustomers = [
                                                    ...coreCustomers,
                                                    newCustomer,
                                                ];
                                                localStorage.setItem(
                                                    "core-customers",
                                                    JSON.stringify(updatedCustomers)
                                                );

                                                setCustomerId(newCustomer.id);
                                                setCustomerObject(newCustomer);

                                                if (enableTable && tableId) {
                                                    updateTableCustomer(
                                                        tableId,
                                                        newCustomer.id,
                                                        newCustomer
                                                    );
                                                }
                                            }

                                            customerAddedForm.reset();
                                            setRefreshCustomerDropdown(true);
                                            // setValue("Existing");
                                            setCustomerDrawer(false);
                                            setSaveCreateLoading(false);
                                        } catch (error) {
                                            console.error("Error creating customer:", error);
                                            notifications.show({
                                                color: "red",
                                                title: t("CreateFailed"),
                                                message: error?.message || t("SomethingWentWrong"),
                                                icon: (
                                                    <IconX style={{width: rem(18), height: rem(18)}}/>
                                                ),
                                                loading: false,
                                                autoClose: 2000,
                                                style: {backgroundColor: "lightgray"},
                                            });
                                            setSaveCreateLoading(false);
                                        }
                                    },
                                });
                            })}
                        >
                            <ScrollArea
                                h={height + 18}
                                scrollbarSize={2}
                                scrollbars="y"
                                type="never"
                            >
                                <Box mt={"xs"}>
                                    <InputForm
                                        tooltip={t("NameValidateMessage")}
                                        label={t("Name")}
                                        placeholder={t("CustomerName")}
                                        required={true}
                                        nextField={fieldPrefix + "mobile"}
                                        form={customerAddedForm}
                                        name={"name"}
                                        id={fieldPrefix + "name"}
                                        leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                        rightIcon={""}
                                    />
                                </Box>
                                <Box mt={"8"}>
                                    <PhoneNumber
                                        tooltip={
                                            customerAddedForm.errors.mobile
                                                ? customerAddedForm.errors.mobile
                                                : t("MobileValidateMessage")
                                        }
                                        label={t("Mobile")}
                                        placeholder={t("Mobile")}
                                        required={true}
                                        nextField={fieldPrefix + "email"}
                                        form={customerAddedForm}
                                        name={"mobile"}
                                        id={fieldPrefix + "mobile"}
                                        rightIcon={""}
                                    />
                                </Box>
                                <Box mt={"8"}>
                                    <InputForm
                                        tooltip={t("InvalidEmail")}
                                        label={t("Email")}
                                        placeholder={t("Email")}
                                        required={false}
                                        nextField={fieldPrefix + "customer_group_id"}
                                        name={"email"}
                                        form={customerAddedForm}
                                        mt={8}
                                        id={fieldPrefix + "email"}
                                    />
                                </Box>
                                <Box mt={"8"}>
                                    <SelectForm
                                        tooltip={t("CustomerGroup")}
                                        label={t("CustomerGroup")}
                                        placeholder={t("ChooseCustomerGroup")}
                                        required={false}
                                        nextField={fieldPrefix + "location_id"}
                                        name={"customer_group_id"}
                                        form={customerAddedForm}
                                        dropdownValue={customerGroupDropdownData}
                                        mt={8}
                                        id={fieldPrefix + "customer_group_id"}
                                        searchable={false}
                                        value={customerGroupData}
                                        changeValue={setCustomerGroupData}
                                    />
                                </Box>
                                <Box mt={"8"}>
                                    <SelectForm
                                        tooltip={t("Location")}
                                        label={t("Location")}
                                        placeholder={t("ChooseLocation")}
                                        required={false}
                                        nextField={fieldPrefix + "address"}
                                        name={"location_id"}
                                        id={fieldPrefix + "location_id"}
                                        form={customerAddedForm}
                                        dropdownValue={locationDropdown}
                                        mt={8}
                                        searchable={true}
                                        value={locationData}
                                        changeValue={setLocationData}
                                    />
                                </Box>
                                <Box mt={"8"}>
                                    <TextAreaForm
                                        tooltip={t("AddressValidateMessage")}
                                        label={t("Address")}
                                        placeholder={t("Address")}
                                        required={false}
                                        nextField={fieldPrefix + "EntityCustomerFormSubmit"}
                                        name={"address"}
                                        form={customerAddedForm}
                                        mt={8}
                                        id={fieldPrefix + "address"}
                                    />
                                </Box>
                            </ScrollArea>
                        </form>
                    </Box>
                ) : value === "Existing" ? (
                    <>
                        <ScrollArea
                            h={height + 71}
                            scrollbarSize={2}
                            scrollbars="y"
                            type="never"
                        >
                            <Box pt={"6"}>
                                <Grid columns={24} gutter={{base: 8}} align="center">
                                    <Grid.Col span={18} align={"center"}>
                                        <SelectForm
                                            tooltip={t("CustomerValidateMessage")}
                                            label=""
                                            placeholder={t("Customer")}
                                            required={false}
                                            nextField={"name"}
                                            name={"customer_id"}
                                            form={customerAddedForm}
                                            dropdownValue={customersDropdownData}
                                            id={"customer_id"}
                                            mt={1}
                                            searchable={true}
                                            value={customerId}
                                            changeValue={(value) => {
                                                setCustomerId(value);
                                                if (value) {
                                                    const coreCustomers = localStorage.getItem(
                                                        "core-customers"
                                                    )
                                                        ? JSON.parse(localStorage.getItem("core-customers"))
                                                        : [];
                                                    const customer = coreCustomers.find(
                                                        (c) => String(c.id) === String(value)
                                                    );
                                                    if (customer) {
                                                        setCustomerObject(customer);
                                                        if (enableTable && tableId) {
                                                            updateTableCustomer(tableId, value, customer);
                                                        }
                                                    }
                                                } else {
                                                    setCustomerObject({});
                                                    if (enableTable && tableId) {
                                                        clearTableCustomer(tableId);
                                                    }
                                                }
                                            }}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6} align={"center"}>
                                        <Button
                                            disabled={!customerId}
                                            fullWidth
                                            size="xs"
                                            color={`green.8`}
                                            onClick={async () => {
                                                if (customerId && enableTable && tableId) {
                                                    updateTableCustomer(
                                                        tableId,
                                                        customerId,
                                                        customerObject
                                                    );
                                                }
                                                const data = {
                                                    url: 'inventory/pos/inline-update',
                                                    data: {
                                                        invoice_id: tableId,
                                                        field_name: 'customer_id',
                                                        value: customerId,
                                                    }
                                                }

                                                // Dispatch and handle response
                                                try {
                                                    const resultAction = await dispatch(storeEntityData(data));

                                                    if (resultAction.payload?.status == 200) {
                                                        setCustomerDrawer(false);
                                                    }
                                                    if (resultAction.payload?.status !== 200) {
                                                        showNotificationComponent(resultAction.payload?.message || 'Error updating invoice', 'red', '', true);
                                                    }
                                                } catch (error) {
                                                    showNotificationComponent('Request failed. Please try again.', 'red', '', true);
                                                    console.error('Error updating invoice:', error);
                                                }finally {
                                                    setReloadInvoiceData(true)
                                                }
                                            }}
                                            leftSection={<IconDeviceFloppy size={16}/>}
                                        >
                                            <Flex direction={`column`} gap={0}>
                                                <Text fz={14} fw={400}
                                                >
                                                    {t("Select")}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Box
                                mt={4}
                                p={"md"}
                                bg={"gray.1"}
                                className="boxBackground borderRadiusAll"
                                h={300}
                                w={"100%"}
                            >
                                {customerDetails}
                            </Box>
                            <Box mt={"8"} className={"borderRadiusAll"}>
                                <DataTable
                                    classNames={{
                                        root: tableCss.root,
                                        table: tableCss.table,
                                        header: tableCss.header,
                                        footer: tableCss.footer,
                                        pagination: tableCss.pagination,
                                    }}
                                    records={indexData.data}
                                    columns={[
                                        {
                                            accessor: "index",
                                            title: t("S/N"),
                                            textAlignment: "right",
                                            render: (item) => indexData.data.indexOf(item) + 1,
                                        },
                                        {accessor: "name", title: t("Name")},
                                        {accessor: "mobile", title: t("Mobile")},
                                        {accessor: "order", title: t("Order")},
                                        {
                                            accessor: "action",
                                            title: t("Action"),
                                            textAlign: "right",
                                            render: (data) => (
                                                <Group gap={4} justify="right" wrap="nowrap">
                                                    <Menu
                                                        position="bottom-end"
                                                        offset={3}
                                                        withArrow
                                                        trigger="hover"
                                                        openDelay={100}
                                                        closeDelay={400}
                                                    >
                                                        <Menu.Target>
                                                            <ActionIcon
                                                                size="sm"
                                                                variant="outline"
                                                                color="red"
                                                                radius="xl"
                                                                aria-label="Settings"
                                                            >
                                                                <IconDotsVertical
                                                                    height={"16"}
                                                                    width={"16"}
                                                                    stroke={1.5}
                                                                />
                                                            </ActionIcon>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>
                                                            <Menu.Item
                                                                onClick={() => {
                                                                    setProvisionDrawer(true);
                                                                }}
                                                                target="_blank"
                                                                component="a"
                                                                w={"200"}
                                                            >
                                                                {t("AddProvision")}
                                                            </Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                </Group>
                                            ),
                                        },
                                    ]}
                                    // fetching={fetching}
                                    // totalRecords={indexData.total}
                                    // recordsPerPage={perPage}
                                    // page={page}
                                    onPageChange={(p) => {
                                        setPage(p);
                                        setFetching(true);
                                    }}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={height - 300}
                                    scrollAreaProps={{type: "never"}}
                                />
                            </Box>
                        </ScrollArea>
                    </>
                ) : (
                    <>
                        <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                            <form
                                id="receiverAddedForm"
                                onSubmit={receiverAddedForm.onSubmit((values) => {
                                    modals.openConfirmModal({
                                        title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                                        children: (
                                            <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                                        ),
                                        labels: {confirm: t("Submit"), cancel: t("Cancel")},
                                        confirmProps: {color: "red"},
                                        onCancel: () => console.log("Cancel"),
                                        onConfirm: async () => {
                                            setSaveCreateLoading(true);
                                            console.log("values", values);
                                            setCustomerIdForReceiver(null);
                                            setValue("Existing");
                                            setSaveCreateLoading(false);
                                            receiverAddedForm.reset();
                                        },
                                    });
                                })}
                            >
                                <ScrollArea
                                    h={height + 18}
                                    scrollbarSize={2}
                                    scrollbars="y"
                                    type="never"
                                >
                                    <Box mt={"xs"}>
                                        <SelectForm
                                            tooltip={t("CustomerValidateMessage")}
                                            label=""
                                            placeholder={t("Customer")}
                                            required={false}
                                            nextField={"name"}
                                            name={"customer_id"}
                                            form={receiverAddedForm}
                                            dropdownValue={customersDropdownData}
                                            id={"customer_id"}
                                            mt={1}
                                            searchable={true}
                                            value={customerIdForReceiver}
                                            changeValue={(value) => {
                                                setCustomerIdForReceiver(value);
                                            }}
                                        />
                                    </Box>
                                    <Box mt={"xs"}>
                                        <InputForm
                                            tooltip={t("NameValidateMessage")}
                                            label={t("Name")}
                                            placeholder={t("ReceivedbyName")}
                                            required={true}
                                            nextField={fieldPrefix + "mobile"}
                                            form={receiverAddedForm}
                                            name={"name"}
                                            id={fieldPrefix + "name"}
                                            leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                            rightIcon={""}
                                        />
                                    </Box>
                                    <Box mt={"8"}>
                                        <PhoneNumber
                                            tooltip={
                                                receiverAddedForm.errors.mobile
                                                    ? receiverAddedForm.errors.mobile
                                                    : t("MobileValidateMessage")
                                            }
                                            label={t("Mobile")}
                                            placeholder={t("Mobile")}
                                            required={true}
                                            nextField={fieldPrefix + "email"}
                                            form={receiverAddedForm}
                                            name={"mobile"}
                                            id={fieldPrefix + "mobile"}
                                            rightIcon={""}
                                        />
                                    </Box>
                                    <Box mt={"8"}>
                                        <InputForm
                                            tooltip={t("InvalidEmail")}
                                            label={t("Email")}
                                            placeholder={t("Email")}
                                            required={false}
                                            nextField={fieldPrefix + "notes"}
                                            name={"email"}
                                            form={receiverAddedForm}
                                            mt={8}
                                            id={fieldPrefix + "email"}
                                        />
                                    </Box>
                                    <Box mt={"8"}>
                                        <InputForm
                                            tooltip={t("Notes")}
                                            label={t("Notes")}
                                            placeholder={t("Notes")}
                                            required={false}
                                            nextField={fieldPrefix + "EntityCustomerFormSubmit"}
                                            name={"notes"}
                                            form={receiverAddedForm}
                                            mt={8}
                                            id={fieldPrefix + "notes"}
                                        />
                                    </Box>
                                </ScrollArea>
                            </form>
                        </Box>
                    </>
                )}
                {(value === "New" || value === "ReceivedBy") && (
                    <Box
                        pl={`xs`}
                        pr={8}
                        pt={"6"}
                        pb={"6"}
                        mb={"2"}
                        mt={4}
                        className={"boxBackground borderRadiusAll"}
                    >
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
                                    ml={"4"}
                                >
                                    <IconX
                                        style={{width: "100%", height: "100%"}}
                                        stroke={1.5}
                                    />
                                </ActionIcon>
                            </Flex>

                            <Group gap={8} mih={30}>
                                <Flex justify="flex-end" align="center" h="100%">
                                    <Button
                                        variant="transparent"
                                        size="xs"
                                        color="red.4"
                                        type="reset"
                                        id=""
                                        p={0}
                                        onClick={() => {
                                            if (enableTable && tableId) {
                                                clearTableCustomer(tableId);
                                            }
                                            setCustomerId(null);
                                            setCustomerIdForReceiver(null);
                                            setCustomerObject({});
                                            customerAddedForm.reset();
                                            receiverAddedForm.reset();
                                        }}
                                        rightSection={
                                            <IconRefreshDot
                                                style={{width: "100%", height: "60%"}}
                                                stroke={1.5}
                                            />
                                        }
                                    ></Button>
                                </Flex>
                                <Stack align="flex-start">
                                    <>
                                        {!saveCreateLoading && isOnline && (
                                            <Button
                                                size="xs"
                                                className={'btnPrimaryBg'}
                                                type="submit"
                                                form={
                                                    value === "New"
                                                        ? "customerAddedForm"
                                                        : "receiverAddedForm"
                                                }
                                                id={fieldPrefix + "EntityCustomerFormSubmit"}
                                                // onClick={() => {
                                                //   console.log("Submit")
                                                // }}
                                                leftSection={<IconDeviceFloppy size={16}/>}
                                            >
                                                <Flex direction={`column`} gap={0}>
                                                    <Text fz={14} fw={400}>
                                                        {t("CreateAndSave")}
                                                    </Text>
                                                </Flex>
                                            </Button>
                                        )}
                                    </>
                                </Stack>
                            </Group>
                        </Group>
                    </Box>
                )}
            </Box>
        </>
    );
}

export default _AddCustomerFormPos;
