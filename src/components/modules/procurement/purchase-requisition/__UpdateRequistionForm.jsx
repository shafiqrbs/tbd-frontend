import {isNotEmpty, useForm} from "@mantine/form";
import React from "react";
import {Box, Text, ActionIcon, Group, TextInput} from "@mantine/core";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import {useTranslation} from "react-i18next";
import {IconSum, IconX} from "@tabler/icons-react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {useDispatch} from "react-redux";
import {updateEntityData} from "../../../../store/inventory/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import __UpdateRequistionInvoiceSection from "./__UpdateRequistionInvoiceSection.jsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

export default function __UpdateRequistionForm(props) {
    const {
        isSMSActive,
        currencySymbol,
        tempCardProducts,
        setLoadCardProducts,
        loadCardProducts,
        vendorData, vendorObject, vendorsDropdownData, editedData, setTempCardProducts
    } = props;

    //common hooks
    const {t} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 170;
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // form
    dayjs.extend(customParseFormat);
    const form = useForm({
        initialValues: {
            expected_date: editedData.expected_date ? dayjs(editedData.expected_date, "DD-MM-YYYY").toDate() : new Date(),
            invoice_date: editedData.invoice_date ? dayjs(editedData.invoice_date, "DD-MM-YYYY").toDate() : new Date(),
            vendor_id: editedData.vendor_id,
            narration: editedData.remark,
        },
        validate: {
            vendor_id: isNotEmpty(),
            expected_date: isNotEmpty(),
        },
    });
    // requistion
    let purchaseSubTotalAmount = tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

    const handleFormSubmit = async (values) => {
        let createdBy = JSON.parse(localStorage.getItem("user"));
        let transformedArray = tempCardProducts.map((product) => {
            return {
                product_id: product.product_id,
                display_name: product.display_name,
                unit_name: product.unit_name,
                quantity: product.quantity,
                purchase_price: product.purchase_price,
                sales_price: product.sales_price,
                sub_total: product.sub_total,
                warehouse_id: product.warehouse_id,
            };
        });

        const options = {year: "numeric", month: "2-digit", day: "2-digit"};
        const formValue = {};

        formValue["invoice_date"] = values.invoice_date
            ? new Date(values.invoice_date).toLocaleDateString("en-CA", options)
            : new Date().toLocaleDateString("en-CA");
        formValue["expected_date"] =
            values.expected_date &&
            new Date(values.expected_date).toLocaleDateString("en-CA", options);
        formValue["remark"] = values.narration;
        formValue["created_by_id"] = createdBy?.id;
        formValue["items"] = transformedArray ? transformedArray : [];
        formValue["process"] = "Created";
        formValue["vendor_id"] = form.values.vendor_id;

        const value = {
            url: 'inventory/requisition/' + editedData.id,
            data: formValue
        }

        const result = await dispatch(updateEntityData(value)).unwrap();
        if (result.data.status === 200) {
            showNotificationComponent(t('UpdateSuccessfully'), 'teal', null, false, 1000)
            navigate('/procurement/requisition', {replace: true})
        } else {
            showNotificationComponent(t('FailedToUpdateData'), 'red', null, false, 1000)
        }
    }

    return (
        <>
            <form
                onSubmit={form.onSubmit(handleFormSubmit)}
            >
                <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                    <Box className={"borderRadiusAll"}>
                        <DataTable
                            classNames={{
                                root: tableCss.root,
                                table: tableCss.table,
                                header: tableCss.header,
                                footer: tableCss.footer,
                                pagination: tableCss.pagination,
                            }}
                            records={tempCardProducts}
                            columns={[
                                {
                                    accessor: "index",
                                    title: t("S/N"),
                                    textAlign: "right",
                                    render: (item) => tempCardProducts.indexOf(item) + 1,
                                },
                                {
                                    accessor: "display_name",
                                    title: t("Name"),
                                    width: "50%",
                                },
                                {
                                    accessor: "quantity",
                                    title: t("Quantity"),
                                    width: "10%",
                                    render: (item) => {
                                        const handleQuantityChange = (e) => {
                                            const newQuantity = Number(e.currentTarget.value);

                                            const updatedProducts = tempCardProducts.map((product) => {
                                                if (product.product_id === item.product_id) {
                                                    return {
                                                        ...product,
                                                        quantity: newQuantity,
                                                        sub_total: newQuantity * item.purchase_price,
                                                    };
                                                }
                                                return product;
                                            });

                                            setTempCardProducts(updatedProducts)
                                        };

                                        return (
                                            <TextInput
                                                type="number"
                                                size="xs"
                                                value={item.quantity ?? ""}
                                                onChange={handleQuantityChange}
                                            />
                                        );
                                    },
                                },
                                {
                                    accessor: "unit_name",
                                    title: t("UOM"),
                                    width: "10%",
                                    textAlign: "center",
                                },
                                {
                                    accessor: "purchase_price",
                                    title: t("Price"),
                                    width: "10%",
                                    textAlign: "center",
                                },

                                {
                                    accessor: "sub_total",
                                    title: t("SubTotal"),
                                    width: "15%",
                                    textAlign: "right",
                                    render: (item) => {
                                        return item.sub_total && Number(item.sub_total).toFixed(2);
                                    },
                                    footer: (
                                        <Group spacing="xs" justify="flex-end">
                                            <IconSum size="1.25em"/>
                                            <Text fw={"600"} fz={"md"}>
                                                {purchaseSubTotalAmount.toFixed(2)}
                                            </Text>
                                        </Group>
                                    ),
                                },
                                {
                                    accessor: "action",
                                    title: t("Action"),
                                    textAlign: "right",
                                    render: (item) => (
                                        <Group gap={4} justify="right" wrap="nowrap">
                                            <ActionIcon
                                                size="sm"
                                                variant="subtle"
                                                color='var(--theme-primary-color-6)'
                                                onClick={() => {
                                                    setTempCardProducts(tempCardProducts.filter(
                                                        (d) => d.product_id !== item.product_id
                                                    ));
                                                }}
                                            >
                                                <IconX
                                                    size={16}
                                                    style={{width: "70%", height: "70%"}}
                                                    stroke={1.5}
                                                />
                                            </ActionIcon>
                                        </Group>
                                    ),
                                },
                            ]}
                            fetching={loadCardProducts}
                            totalRecords={100}
                            recordsPerPage={10}
                            loaderSize="xs"
                            loaderColor="grape"
                            height={height - 88} // 17
                            scrollAreaProps={{type: "never"}}
                        />
                    </Box>
                </Box>
                <Box>
                    <__UpdateRequistionInvoiceSection
                        purchaseSubTotalAmount={purchaseSubTotalAmount}
                        form={form}
                        currencySymbol={currencySymbol}
                        setLoadCardProducts={setLoadCardProducts}
                        isSMSActive={isSMSActive}
                        vendorData={vendorData}
                        vendorObject={vendorObject}
                        vendorsDropdownData={vendorsDropdownData}
                    />
                </Box>
            </form>
        </>
    );
}
