import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Grid,
    Box,
    ScrollArea,
    Title,
    LoadingOverlay,
    TextInput,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "@mantine/form";

import {
    getIndexEntityData,
    setFormLoading,
} from "../../../../store/core/crudSlice.js";
import {DataTable} from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getNbrTariffDropdownData from "../../../global-hook/dropdown/nbr/getNbrTariffDropdownData.js";
import {notifications} from "@mantine/notifications";
import {inlineUpdateEntityData} from "../../../../store/inventory/crudSlice.js";

function _VatManagement(props) {
    const {id} = props;
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight / 2 + 1; //TabList height 104

    const [setFormData, setFormDataForUpdate] = useState(false);
    const [formLoad, setFormLoad] = useState(true);

    const entityEditData = useSelector((state) => state.crudSlice.entityEditData);
    const formLoading = useSelector((state) => state.crudSlice.formLoading);

    const [vatInput, setVatInput] = useState(true);
    const [tariffData, setTariffData] = useState(null);

    const tariffDropDown = getNbrTariffDropdownData('tariff')
    const [editedValues, setEditedValues] = useState({}); // To store locally edited values
    const [loadingFields, setLoadingFields] = useState({}); // Keep track of which fields are loading (e.g., during API update)
    const [indexData, setIndexData] = useState([])

    const form = useForm({
        initialValues: {
            hscode_id: "",
        }
    });

    useEffect(() => {
        setFormLoad(true);
        setFormDataForUpdate(true);
    }, [dispatch, formLoading]);
    useEffect(() => {
        form.setValues({});

        dispatch(setFormLoading(false));
        setTimeout(() => {
            setFormLoad(false);
            setFormDataForUpdate(false);
        }, 500);
    }, [entityEditData, dispatch, setFormData]);

    useEffect(() => {
        const fetchData = async () => {
            setFormLoad(true); // Start loading

            const value = {
                url: 'inventory/product/nbr-tariff/' + props.id,
                param: {
                    term: '',
                },
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setIndexData(resultAction.payload.data);
                    setTariffData(String(resultAction?.payload?.data[0]?.hscode_id));
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setFormLoad(false); // End loading
            }
        };

        fetchData(); // Call fetchData once on component mount
        // No dependency on `formLoad` to avoid infinite loop
    }, [dispatch, props.id,formLoad]); // Reload only when `dispatch` or `props.id` changes
    const handleInputChange = (e, fieldName) => {
        const value = e.currentTarget.value;
        setEditedValues((prev) => ({
            ...prev,
            [fieldName]: value, // Temporarily store new value for this field.
        }));
    };

    const handleBlur = async (e, fieldName, rowId) => {
        const newValue = editedValues[fieldName]; // The new value to persist
        if (!tariffData || (typeof tariffData != "number" && isNaN(tariffData))) {
            // Validate HS Code selection
            notifications.show({
                loading: true,
                color: "red",
                title: "Choose HS code",
                message: "Data will be loaded in 3 seconds, you cannot close this yet",
                autoClose: 2000,
                withCloseButton: true,
            });
            return;
        }

        // Set the field as loading
        setLoadingFields((prev) => ({...prev, [fieldName]: true}));

        const updateData = {
            url: `inventory/product/nbr-tariff/inline-update/${rowId}`, // Pass the correct id
            data: {
                field_name: fieldName,
                value: newValue,
                hscode_id: tariffData,
            },
        };

        try {
            // Optimistically update the UI without waiting for backend response.
            dispatch(inlineUpdateEntityData(updateData));

            // Optionally, after success, clear loading state.
        } catch (error) {if (isDev) {
        return; // Skip unnecessary dev calls
    }

            console.error("Error updating data:", error);

            notifications.show({
                loading: false,
                color: "red",
                title: "Error!",
                message: "Failed to update inline value.",
                autoClose: 2000,
                withCloseButton: true,
            });

            // Optionally roll back to the old value:
            setEditedValues((prev) => ({
                ...prev,
                [fieldName]: item.value, // Reset the field to the server-provided value
            }));
        } finally {
            // No longer loading
            setLoadingFields((prev) => ({...prev, [fieldName]: false}));
        }
    };

    const handleHsCode = async (e) => {
        setTariffData(e)
        const updateData = {
            url: `inventory/product/nbr-tariff/inline-update/${id}`, // Pass the correct id
            data: {
                field_name: 'hscode_id',
                value: e,
                hscode_id: e,
            },
        };

        try {
            // Optimistically update the UI without waiting for backend response.
            dispatch(inlineUpdateEntityData(updateData));
            setEditedValues({})
            setIndexData([])
            setFormLoad(true)

            // Optionally, after success, clear loading state.
        } catch (error) {
            console.error("Error updating data:", error);

            notifications.show({
                loading: false,
                color: "red",
                title: "Error!",
                message: "Failed to update inline value.",
                autoClose: 2000,
                withCloseButton: true,
            });
        }
    }

    return (
        <Box>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                <Box
                    pl={`xs`}
                    pb={"6"}
                    pr={8}
                    pt={"6"}
                    mb={"4"}
                    className={"boxBackground borderRadiusAll"}
                >
                    <Grid>
                        <Grid.Col span={12}>
                            <Title order={6} pt={"6"}>
                                {t("VatManagement")}
                            </Title>
                        </Grid.Col>
                    </Grid>
                </Box>
                <Box className={"borderRadiusAll"}>
                    <ScrollArea scrollbars="y" type="never">
                        <Box>
                            <LoadingOverlay
                                visible={formLoad}
                                zIndex={1000}
                                overlayProps={{radius: "sm", blur: 2}}
                            />
                        </Box>
                        <Box>
                            <form>
                                <>
                                    <Box
                                        pl={8}
                                        pr={8}
                                        pt={"4"}
                                        pb={2}
                                        className={"boxBackground  border-bottom-none"}
                                    >
                                        {/* not sure about the language file naming for hs */}
                                        <Grid columns={12}>
                                            <Grid.Col span={12}>
                                                <SelectForm
                                                    tooltip={t("ChooseHS")}
                                                    placeholder={t("ChooseHS")}
                                                    name={"hscode_id"}
                                                    form={form}
                                                    dropdownValue={tariffDropDown}
                                                    mt={0}
                                                    id={"hscode_id"}
                                                    nextField={""}
                                                    searchable={true}
                                                    value={tariffData}
                                                    changeValue={handleHsCode}
                                                    clearable={false}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </>
                            </form>

                            <Box className={"border-top-none"}>
                                <DataTable
                                    classNames={{
                                        root: tableCss.root,
                                        table: tableCss.table,
                                        header: tableCss.header,
                                        footer: tableCss.footer,
                                        pagination: tableCss.pagination,
                                    }}
                                    records={indexData}
                                    columns={[

                                        {
                                            accessor: "field_label",
                                            title: t("Name"),
                                            width: 100,
                                        },
                                        {
                                            accessor: "value",
                                            title: t("Percent(%)"),
                                            textAlign: "center",
                                            width: 100,
                                            render: (item) => {
                                                const fieldName = item.field_name; // Dynamic field name
                                                const value = fieldName in editedValues ? editedValues[fieldName] : item.value; // Use local state if edited, otherwise fallback to item.value
                                                const isLoading = loadingFields[fieldName]; // Show spinner if the field is being updated

                                                return vatInput ? (
                                                    <>
                                                        <TextInput
                                                            type="number"
                                                            size="xs"
                                                            name={fieldName}
                                                            id={fieldName}
                                                            value={isLoading ? "Loading..." : value}
                                                            onChange={(e) => handleInputChange(e, fieldName)}
                                                            onBlur={(e) => handleBlur(e, fieldName, id)} // Send fieldName and rowId (id)
                                                            disabled={isLoading} // Disable field if it's currently being updated
                                                        />
                                                    </>
                                                ) : (
                                                    1000
                                                );
                                            },
                                        },
                                        {
                                            accessor: "nbr_vat",
                                            title: "Nbr Vat (%)",
                                            width: 50
                                        },
                                    ]}
                                    loaderSize="xs"
                                    loaderColor="grape"
                                    height={height - 160}
                                    scrollAreaProps={{type: "never"}}
                                />
                            </Box>
                        </Box>

                    </ScrollArea>
                </Box>
            </Box>
        </Box>
    );
}

export default _VatManagement;
