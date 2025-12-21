import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    rem,
    Flex,
    Grid,
    Box,
    ScrollArea,
    Text,
    Stack,
    Container,
    Card,
    Checkbox,
    LoadingOverlay
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconCheck,
    IconDeviceFloppy,
    IconPercentage,
    IconSortAscendingNumbers,
} from "@tabler/icons-react";
import {useHotkeys} from "@mantine/hooks";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "@mantine/form";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {
    getIndexEntityData,
    storeEntityData,
} from "../../../../store/core/crudSlice.js";

import {
    setDropdownLoad
} from "../../../../store/inventory/crudSlice.js";

import InputForm from "../../../form-builders/InputForm";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import {getCategoryDropdown} from "../../../../store/inventory/utilitySlice.js";
import _ManageBranchAndFranchise from "../common/_ManageBranchAndFranchise.jsx";

function SubDomainSettingForm(props) {
    const {id} = props;
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 100; //TabList height 104
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);

    const dropdownLoad = useSelector(
        (state) => state.inventoryCrudSlice.dropdownLoad
    );
    const categoryDropdownData = useSelector(
        (state) => state.inventoryUtilitySlice.categoryDropdownData
    );
    const [selectedDomainId, setSelectedDomainId] = useState(id);
    const [reloadList, setReloadList] = useState(true)
    const [fetching, setFetching] = useState(false);

    const [percentMode, setPercentMode] = useState("Increase");

    const [subDomainCategoryData, setSubDomainCategoryData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'domain/b2b/sub-domain/setting/' + selectedDomainId, param: {}
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setSubDomainCategoryData(resultAction.payload.data);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setReloadList(false)
            }
        };

        fetchData();
    }, [dispatch, fetching, reloadList]);


    useEffect(() => {
        if (subDomainCategoryData?.sub_domain_category) {
            const ids = subDomainCategoryData.sub_domain_category.map(item => item.domain_category_id);
            subDomainCategoryData.percent_mode && setPercentMode(String(subDomainCategoryData?.percent_mode))
            form.setValues({
                percent_mode: subDomainCategoryData.percent_mode || 'Increase',
                mrp_percent: subDomainCategoryData?.mrp_percent || '',
                purchase_percent: subDomainCategoryData?.purchase_percent || '',
                bonus_percent: subDomainCategoryData?.bonus_percent || '',
                sales_target_amount: subDomainCategoryData?.sales_target_amount || '',
                categories: ids,
            });

            setSelectedCategories(ids);
        }
    }, [subDomainCategoryData, reloadList]);


    useEffect(() => {
        const value = {
            url: "inventory/select/category",
            param: {
                type: "all",
            },
        };
        dispatch(getCategoryDropdown(value));
        dispatch(setDropdownLoad(false));
    }, [dropdownLoad]);

    const form = useForm({
        initialValues: {
            percent_mode: subDomainCategoryData?.percent_mode || 'Increase',
            mrp_percent: subDomainCategoryData?.mrp_percent,
            purchase_percent: subDomainCategoryData?.purchase_percent,
            bonus_percent: subDomainCategoryData?.bonus_percent,
            sales_target_amount: subDomainCategoryData?.sales_target_amount,
            categories: subDomainCategoryData?.sub_domain_category.map(item => item.domain_category_id),
        },
        validate: {
            purchase_percent: (value) => {
                if (value !== undefined && value !== null && value !== '') {
                    const isNumber = !isNaN(value);
                    const validFormat = /^(?:[0-9]|[1-9][0-9]?)(\.\d{1,2})?$/.test(value);
                    if (!isNumber || !validFormat) {
                        return true;
                    }
                } else {
                    return true; // value is empty → fail validation
                }
                return null; // passes validation
            },
            mrp_percent: (value) => {
                if (value !== undefined && value !== null && value !== '') {
                    const isNumber = !isNaN(value);
                    const validFormat = /^(?:[0-9]|[1-9][0-9]?)(\.\d{1,2})?$/.test(value);
                    if (!isNumber || !validFormat) {
                        return true;
                    }
                } else {
                    return true; // value is empty → fail validation
                }
                return null; // passes validation
            },
        },
    });

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories((prev) => {
            const newSelection = prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId];

            form.setFieldValue("categories", newSelection);
            return newSelection;
        });
    };

    useHotkeys(
        [
            [
                "alt+n",
                () => {
                    document.getElementById("percent_mode").click();
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
                    form.reset();
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

    return (
        <Box style={{position: "relative"}}>
            <LoadingOverlay visible={reloadList || saveCreateLoading} zIndex={1000} overlayProps={{radius: "sm", blur: 2}} loaderProps={{color:"red"}}/>

            <Container fluid p={0}>
                <form
                    onSubmit={form.onSubmit((values) => {
                        if (selectedCategories.length == 0) {
                            notifications.show({
                                color: "red",
                                title: t("Error"),
                                message: t("Please select at least one category"),
                                autoClose: 2000,
                            });
                            return;
                        }
                        values.id = selectedDomainId;
                        modals.openConfirmModal({
                            title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                            children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
                            labels: {confirm: "Submit", cancel: "Cancel"},
                            confirmProps: {color: "red"},
                            onCancel: () => console.log("Cancel"),
                            onConfirm: async () => {
                                try {
                                    setSaveCreateLoading(true);
                                    setReloadList(true)

                                    const value = {
                                        url: 'domain/b2b/sub-domain/category',
                                        data: values
                                    }

                                    const resultAction = await dispatch(storeEntityData(value));

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
                                        notifications.show({
                                            color: 'teal',
                                            title: t('ProductSyncSuccessfull'),
                                            icon: <IconCheck style={{width: rem(18), height: rem(18)}}/>,
                                            loading: false,
                                            autoClose: 700,
                                            style: {backgroundColor: 'lightgray'},
                                        });
                                    }
                                } catch (err) {
                                    console.error('Unexpected error:', err);
                                } finally {
                                    setReloadList(false)
                                    setSaveCreateLoading(false)
                                }
                            },
                        });
                    })}
                >
                    <Grid columns={12} gutter={{base: 8}} mb={"xs"}>
                        <Grid.Col span={2}>
                            <_ManageBranchAndFranchise
                                classes={classes}
                                setSelectedDomainId={setSelectedDomainId}
                                selectedDomainId={selectedDomainId}
                                setReloadList={setReloadList}
                                id={id}
                                module={'setting'}
                            />
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Card
                                shadow="md"
                                radius="md"
                                className={classes.card}
                                padding="lg"
                            >
                                <Grid gutter={{base: 2}}>
                                    <Grid.Col span={10}>
                                        <Text fz="md" fw={500} className={classes.cardTitle}>
                                            {t("DiscountOverview")}
                                        </Text>
                                    </Grid.Col>
                                </Grid>
                                <Grid columns={9} gutter={{base: 8}}>
                                    <Grid.Col span={9}>
                                        <Box bg={"white"}>
                                            <Box
                                                pl={`xs`}
                                                mt={"md"}
                                                pr={"xs"}
                                                className={"borderRadiusAll"}
                                            >
                                                <ScrollArea
                                                    h={height - 27}
                                                    scrollbarSize={2}
                                                    scrollbars="y"
                                                    type="never"
                                                >
                                                    <Box mt={"xs"}>
                                                        <SelectForm
                                                            label={t("ChooseMode")}
                                                            tooltip={t("ChooseMode")}
                                                            placeholder={t("ChooseMode")}
                                                            required={false}
                                                            name={"percent_mode"}
                                                            form={form}
                                                            nextField={"mrp_percent"}
                                                            dropdownValue={["Increase", "Decrease"]}
                                                            id={"percent_mode"}
                                                            searchable={true}
                                                            value={percentMode}
                                                            changeValue={setPercentMode}
                                                        />
                                                    </Box>
                                                    <Box mt={"xs"}>
                                                        <InputForm
                                                            tooltip={t("MRPPercent")}
                                                            label={t("MRPPercent")}
                                                            placeholder={t("MRPPercent")}
                                                            required={true}
                                                            nextField={"purchase_percent"}
                                                            form={form}
                                                            name={"mrp_percent"}
                                                            mt={8}
                                                            id={"mrp_percent"}
                                                            type={"number"}
                                                            leftSection={
                                                                <IconPercentage size={16} opacity={0.5}/>
                                                            }
                                                        />
                                                    </Box>
                                                    <Box mt={"xs"}>
                                                        <InputForm
                                                            tooltip={t("PurchasePercent")}
                                                            label={t("PurchasePercent")}
                                                            placeholder={t("PurchasePercent")}
                                                            required={true}
                                                            nextField={"bonus_percent"}
                                                            form={form}
                                                            name={"purchase_percent"}
                                                            mt={8}
                                                            id={"purchase_percent"}
                                                            type={"number"}
                                                            leftSection={
                                                                <IconPercentage size={16} opacity={0.5}/>
                                                            }
                                                        />
                                                    </Box>
                                                    <Box mt={"xs"}>
                                                        <InputForm
                                                            tooltip={t("BonusPercent")}
                                                            label={t("BonusPercent")}
                                                            placeholder={t("BonusPercent")}
                                                            required={false}
                                                            nextField={"sales_target_amount"}
                                                            form={form}
                                                            name={"bonus_percent"}
                                                            mt={8}
                                                            id={"bonus_percent"}
                                                            type={"number"}
                                                            leftSection={
                                                                <IconPercentage size={16} opacity={0.5}/>
                                                            }
                                                        />
                                                    </Box>
                                                    <Box mt={"xs"}>
                                                        <InputForm
                                                            tooltip={t("MonthlyTargetAmount")}
                                                            label={t("MonthlyTargetAmount")}
                                                            placeholder={t("MonthlyTargetAmount")}
                                                            required={false}
                                                            nextField={""}
                                                            form={form}
                                                            name={"sales_target_amount"}
                                                            mt={8}
                                                            id={"sales_target_amount"}
                                                            type={"number"}
                                                            leftSection={
                                                                <IconSortAscendingNumbers
                                                                    size={16}
                                                                    opacity={0.5}
                                                                />
                                                            }
                                                        />
                                                    </Box>
                                                </ScrollArea>
                                            </Box>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Card>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Card
                                shadow="md"
                                radius="md"
                                className={classes.card}
                                padding="lg"
                            >
                                <Grid gutter={{base: 2}}>
                                    <Grid.Col span={10}>
                                        <Text fz="md" fw={500} className={classes.cardTitle}>
                                            {t("CategoryOverview")}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Stack right align="flex-end">
                                            <>
                                                <Button
                                                    size="xs"
                                                    className={'btnPrimaryBg'}
                                                    type="submit"
                                                    id="EntityFormSubmit"
                                                    leftSection={<IconDeviceFloppy size={16}/>}
                                                >
                                                    <Flex direction={`column`} gap={0}>
                                                        <Text fz={14} fw={400}>
                                                            {t("SyncProduct")}
                                                        </Text>
                                                    </Flex>
                                                </Button>
                                            </>
                                        </Stack>
                                    </Grid.Col>
                                </Grid>
                                <Grid columns={9} gutter={{base: 8}}>
                                    <Grid.Col span={9}>
                                        <Box bg={"white"}>
                                            <Box
                                                pl={`xs`}
                                                mt={"md"}
                                                pr={"xs"}
                                                className={"borderRadiusAll"}
                                            >
                                                <ScrollArea
                                                    h={height - 28}
                                                    scrollbarSize={2}
                                                    scrollbars="y"
                                                    type="never"
                                                >
                                                    {categoryDropdownData &&
                                                        categoryDropdownData.map((data, index) => (
                                                            <Box mt={"xs"} key={data.id}>
                                                                <Grid columns={12} gutter={{base: 8}}>
                                                                    <Grid.Col span={1} align="center">
                                                                        <Box mt={"xs"}>{index + 1}</Box>
                                                                    </Grid.Col>
                                                                    <Grid.Col span={10} align="flex-start">
                                                                        <Text size={"sm"} pl={14} pt={8} fw={500}>
                                                                            {data.name}
                                                                        </Text>
                                                                    </Grid.Col>
                                                                    <Grid.Col span={1}>
                                                                        <Box mt={"xs"}>
                                                                            <Checkbox
                                                                                pr="xs"
                                                                                checked={selectedCategories.includes(Number(data.id))}
                                                                                color='var(--theme-primary-color-6)'
                                                                                form={form}
                                                                                disabled={saveCreateLoading} // Disable during form submission
                                                                                onChange={() => handleCategoryToggle(data.id)}
                                                                                styles={(theme) => ({
                                                                                    input: {borderColor: "var(--theme-primary-color-6)" },
                                                                                })}
                                                                            />
                                                                        </Box>
                                                                    </Grid.Col>
                                                                </Grid>
                                                            </Box>
                                                        ))}
                                                </ScrollArea>
                                            </Box>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </form>
            </Container>
        </Box>
    );
}

export default SubDomainSettingForm;
