import {
    Grid,
    Box,
    Title,
    ScrollArea,
    Text,
    Flex,
    Checkbox,
    Overlay, LoadingOverlay, Group, Tooltip, rem, TextInput,
} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import Shortcut from "../../shortcut/Shortcut.jsx";
import {useForm} from "@mantine/form";
import {IconCheck, IconCurrencyDollar} from "@tabler/icons-react";
import {getIndexEntityData, storeEntityData} from "../../../../store/core/crudSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {notifications} from "@mantine/notifications";

export default function BranchManagementForm() {
    const {t} = useTranslation();
    const {mainAreaHeight, isOnline} = useOutletContext();
    const height = mainAreaHeight - 26;
    const dispatch = useDispatch();

    const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : [];
    const [moduleChecked, setModuleChecked] = useState([]);


    // Select data, error, and fetching state from Redux
    const indexEntityData = useSelector((state) => state.crudSlice.indexEntityData);
    const fetching = useSelector((state) => state.crudSlice.fetching);
    const [reloadDomainData, setReloadDomainData] = useState(false)

    // Filtered domainsData excluding the `configData.domain_id`
    const domainsData = indexEntityData?.data
        ? indexEntityData.data.filter((item) => item.id !== configData.domain_id)
        : []; // Default to empty array

    // Merge all check_category values when branches change
    useEffect(() => {
        // Flatten all check_category arrays from all branches
        const mergedCategories = domainsData.flatMap((branch) => branch?.check_category || []);
        setModuleChecked(mergedCategories); // Set the merged values
    }, [domainsData]);

    const [checkedStates, setCheckedStates] = useState({});
    const [customer, setCustomer] = useState({});
    const [checkboxDisable, setCheckboxDisable] = useState({}); // Track loading for each checkbox

    // Fetch domains on component mount and when `reloadDomainData` changes
    useEffect(() => {
        const value = {
            url: "domain/manage/branch",
            param: {
                term: null,
                page: null,
                offset: null,
            },
        };
        dispatch(getIndexEntityData(value)); // Dispatch thunk
        setReloadDomainData(false);
    }, [dispatch, reloadDomainData]);

    // Initialize checked states based on `domainsData`
    useEffect(() => {
        if (domainsData?.length > 0) {
            const newState = domainsData.reduce((state, item) => {
                if (item?.is_sub_domain) {
                    state[item.id] = true;
                }
                return state;
            }, {});
            setCheckedStates(newState);
        }
    }, [domainsData]);

    const handleCheckboxChange = async (branch_id, isChecked) => {
        const previousState = checkedStates[branch_id];

        // Set the checkbox to loading (disabled)
        setCheckboxDisable((prevStates) => ({
            ...prevStates,
            [branch_id]: true,
        }));

        if (!isChecked) {
            // Optimistically update the checked state
            setCheckedStates((prevStates) => ({
                ...prevStates,
                [branch_id]: isChecked,
            }));
            // return
        } // Exit early if unchecked

        const payload = {
            url: "domain/manage/branch/create",
            data: {
                child_domain_id: branch_id,
                checked: isChecked,
                parent_domain_id: configData?.domain?.id,
            },
        };

        try {
            const resultAction = await dispatch(storeEntityData(payload));

            if (storeEntityData.rejected.match(resultAction)) {
                console.log(resultAction.payload.errors);

                // Revert the optimistic update if the API call fails
                setCheckedStates((prevStates) => ({
                    ...prevStates,
                    [branch_id]: previousState,
                }));
            } else if (storeEntityData.fulfilled.match(resultAction)) {
                setCustomer(resultAction.payload.data.data);
                notifications.show({
                    color: "teal",
                    title: t("CreateSuccessfully"),
                    icon: <IconCheck style={{width: "1em", height: "1em"}}/>,
                    loading: false,
                    autoClose: 700,
                    style: {backgroundColor: "lightgray"},
                });
            }
            // Force reload to ensure data is accurate
            setReloadDomainData(true);
        } catch (error) {
            console.error("An error occurred:", error);
            // Revert the change in case of unexpected errors
            setCheckedStates((prevStates) => ({
                ...prevStates,
                [branch_id]: previousState,
            }));
        } finally {
            // Clear the loading state regardless of success or failure
            setCheckboxDisable((prevStates) => ({
                ...prevStates,
                [branch_id]: false,
            }));
        }
    };


    const [amounts, setAmounts] = useState({}); // Dynamic state object for tracking all amounts
    const handlePriceData = async (fieldId, value, index, customer_id) => {
        const fieldNames = ['discount_percent', 'bonus_percent', 'monthly_target_amount'];
        const fieldName = fieldNames[index] || 'discount_percent'; // Optionally handle out-of-bounds indices

        if (!value || value <= 0) return; // Exit early if unchecked

        const data = {
            url: 'domain/manage/branch/price/update',
            data: {
                field_name: fieldName,
                customer_id: customer_id,
                value: value,
            },
        };

        const resultAction = await dispatch(storeEntityData(data));
        if (storeEntityData.rejected.match(resultAction)) {
            console.log(resultAction.payload.errors);
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            // console.log(resultAction.payload.data.data)
        }
    };

    const [shadowOverlay, setShadowOverlay] = useState({})
    const handleCategoryData = async (value, slug,isChecked) => {
        setShadowOverlay((prevStates) => ({
            ...prevStates,
            [slug]: slug,
        }));
        const data = {
            url: 'domain/manage/branch/category/update',
            data: {
                value: value,
                check : isChecked
            },
        };

        const resultAction = await dispatch(storeEntityData(data));

        if (resultAction?.payload?.message){
            notifications.show({
                loading: true,
                color: "red",
                title: resultAction?.payload?.message,
                message:
                    "Data will be loaded in 3 seconds, you cannot close this yet",
                autoClose: 1000,
                withCloseButton: true,
            });
        }
        if (storeEntityData.rejected.match(resultAction)) {
            console.log(resultAction.payload);
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            // console.log(resultAction.payload.data.data)
            setReloadDomainData(true)
            setTimeout(() => {
                setShadowOverlay({})
            }, 500)
        }else {
            notifications.show({
                loading: true,
                color: "red",
                title: "Something went wrong",
                message:
                    "Data will be loaded in 3 seconds, you cannot close this yet",
                autoClose: 1000,
                withCloseButton: true,
            });
        }
    }


    const form = useForm({
        initialValues: {
            discount_percent: null,
            bonus_percent: null,
            monthly_target_amount: null,
        },
    });

    const maxSwitchesInBox = Math.max(
        ...domainsData.map((domain) =>
            Math.max((domain?.prices?.length || 0), 5)
        )
    );

    return (
        <Grid columns={24} gutter={{base: 8}}>
            <Grid.Col span={23}>
                <ScrollArea
                    h={height + 1}
                    scrollbarSize={2}
                    scrollbars="y"
                    type="never"
                    bg={"white"}
                    className="borderRadiusAll"
                    pl="xs"
                    pr="xs"
                    pb="8"
                    pt={6}
                >
                    <LoadingOverlay visible={fetching} zIndex={1000}
                                    overlayProps={{radius: "sm", blur: .5, color: "grape"}}/>

                    <Box
                        style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 100,
                            backgroundColor: "white",
                            width: "100%",
                        }}
                        mb={"4"}
                    >
                        <Grid columns={23} gutter={{base: 8}}>
                            {/* Branches Header */}
                            <Grid.Col span={7}>
                                <Box
                                    pl="xs"
                                    pr={8}
                                    pt="8"
                                    pb="10"
                                    mb="4"
                                    className="boxBackground borderRadiusAll"
                                >
                                    <Grid>
                                        <Grid.Col>
                                            <Title order={6} pt="4">
                                                {t("Branches")}
                                            </Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Grid.Col>


                            {/* Prices Header */}
                            <Grid.Col span={8}>
                                <Box
                                    pl="xs"
                                    pr={8}
                                    pt="8"
                                    pb="10"
                                    mb="4"
                                    className="boxBackground borderRadiusAll"
                                >
                                    <Grid>
                                        <Grid.Col>
                                            <Title order={6} pt="4">
                                                {t("Prices")}
                                            </Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Grid.Col>

                            {/* Settings Header */}
                            <Grid.Col span={8}>
                                <Box
                                    pl="xs"
                                    pr={8}
                                    pt="8"
                                    pb="10"
                                    mb="4"
                                    className="boxBackground borderRadiusAll"
                                >
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Title order={6} pt="4">
                                                {t("CategoryForProduct")}
                                            </Title>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </Grid.Col>
                        </Grid>
                    </Box>

                    {/* Branches Content */}
                    <Grid columns={23} gutter={{base: 8}}>
                        {domainsData.map((branch, index) => (
                            <React.Fragment key={`branch-container-${branch.id}`}>
                                {/* Branches Column */}
                                <Grid.Col span={7}>
                                    <Box bg="white" className="borderRadiusAll">
                                        <Grid
                                            justify="center"
                                            align="center"
                                            columns={12}
                                            gutter={{base: 8}}
                                        >
                                            <Grid.Col span={5}>
                                                <Flex
                                                    mih={`${maxSwitchesInBox * 40.4}px`}
                                                    gap="md"
                                                    justify="flex-end"
                                                    align="center"
                                                    direction="row"
                                                    wrap="wrap"
                                                >
                                                    <Checkbox
                                                        pr="xs"
                                                        checked={!!checkedStates[branch.id]}
                                                        color="red"
                                                        form={form}
                                                        disabled={!!checkboxDisable[branch.id]} // Disable if loading
                                                        onChange={(event) =>
                                                            handleCheckboxChange(
                                                                branch.id,
                                                                event.currentTarget.checked
                                                            )
                                                        }
                                                        styles={(theme) => ({
                                                            input: {
                                                                borderColor: "red",
                                                            },
                                                        })}
                                                    />
                                                </Flex>
                                            </Grid.Col>
                                            <Grid.Col span={7}>
                                                <Flex
                                                    mih={`${maxSwitchesInBox * 40.4}px`}
                                                    gap="md"
                                                    justify="flex-start"
                                                    align="center"
                                                    direction="row"
                                                    wrap="wrap"
                                                >
                                                    <Text fz="16" fw={600} pt="3">
                                                        {branch.name}
                                                    </Text>
                                                </Flex>
                                            </Grid.Col>
                                        </Grid>
                                    </Box>
                                </Grid.Col>

                                {/* Prices Column */}
                                <Grid.Col span={8} key={`branch-${index}-prices`}>
                                    <Box bg="white" className="">
                                        <Box className="borderRadiusAll">
                                            <ScrollArea
                                                pb={"xs"}
                                                pt={"xs"}
                                                h={`${maxSwitchesInBox * 40}px`}
                                                scrollbarSize={2}
                                                scrollbars="y"
                                                type="never"
                                                // viewportRef={priceScrollRef}
                                            >
                                                {!checkedStates[branch.id] && (
                                                    <Overlay
                                                        color="#ffe3e3"
                                                        backgroundOpacity={0.8}
                                                        zIndex={1}
                                                    />
                                                )}


                                                {branch?.prices?.map((price, priceIndex) => {
                                                    // Unique field identifiers
                                                    const currentFieldId = `branches.${index}.prices.${priceIndex}.price`;
                                                    const nextFieldId =
                                                        priceIndex < branch?.prices.length - 1
                                                            ? `branches.${index}.prices.${priceIndex + 1}.price`
                                                            : `branch-${index}-setting-${branch?.categories[0]?.id}`;

                                                    return (
                                                        <Box key={`price-${priceIndex}-${index}`}>
                                                            <Box key={priceIndex} p="xs">
                                                                <Grid columns={12} gutter={{base: 8}}>
                                                                    <Grid.Col span={4}>
                                                                        <Text
                                                                            fw={600}
                                                                            fz={"sm"}
                                                                            mt={"8"}
                                                                            ta={"left"}
                                                                            pl={"xs"}
                                                                        >
                                                                            {price.label}
                                                                        </Text>
                                                                    </Grid.Col>
                                                                    <Grid.Col span={8}>
                                                                        <Box pr={"xs"}>

                                                                            <TextInput
                                                                                id={currentFieldId}
                                                                                size="sm"
                                                                                placeholder={price.label}
                                                                                autoComplete="off"
                                                                                value={amounts[`${index}-${priceIndex}`] || (priceIndex == 0 ? price.discount_percent : (priceIndex == 1 ? price.bonus_percent : price.monthly_target_amount))} // Ensure value is derived dynamically
                                                                                onChange={(e) => {
                                                                                    // Dynamically update the specific field state
                                                                                    setAmounts((prev) => ({
                                                                                        ...prev,
                                                                                        [`${index}-${priceIndex}`]: e.target.value,
                                                                                    }));
                                                                                }}
                                                                                onBlur={(e) => {
                                                                                    // Handle value when the input loses focus
                                                                                    handlePriceData(currentFieldId, e.target.value, priceIndex, branch.customer_id);
                                                                                }}
                                                                                leftSection={<IconCurrencyDollar
                                                                                    size={16} opacity={0.5}/>}
                                                                                inputWrapperOrder={["label", "input", "description"]}
                                                                            />

                                                                        </Box>
                                                                    </Grid.Col>
                                                                </Grid>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </ScrollArea>
                                        </Box>
                                    </Box>
                                </Grid.Col>

                                {/* Settings Column */}
                                <Grid.Col span={8} key={`branch-${index}-settings`}>
                                    <Box bg="white" p="" className="">
                                        <Box className="borderRadiusAll">
                                            <ScrollArea
                                                pb={"xs"}
                                                pt={"xs"}
                                                h={`${maxSwitchesInBox * 40}px`}
                                                scrollbarSize={2}
                                                scrollbars="y"
                                                type="never"
                                            >
                                                {(!checkedStates[branch.id] || shadowOverlay[branch.id]) && (
                                                    <Overlay
                                                        color="#ffe3e3"
                                                        backgroundOpacity={0.8}
                                                        zIndex={1}
                                                    />
                                                )}

                                                <Checkbox.Group
                                                    label={''}
                                                    description={''}
                                                    value={moduleChecked || []}
                                                    onChange={setModuleChecked}
                                                >
                                                    <Group mt="xs" spacing="md" style={{flexWrap: 'wrap', gap: '1rem'}}>
                                                        {branch?.categories?.map((category, categoryIndex) => (
                                                            <Tooltip key={categoryIndex} mt="8" label={category.name}>
                                                                <Checkbox
                                                                    pr="xs"
                                                                    value={category.id + '#' + branch.id}
                                                                    label={category.name}
                                                                    color="red"
                                                                    onChange={(e) => {
                                                                        handleCategoryData(e.currentTarget.value, branch.id,e.currentTarget.checked)
                                                                    }}
                                                                    style={{
                                                                        paddingLeft: categoryIndex % 3 === 0 ? '16px' : '0px', // Apply left padding for the first column
                                                                        flex: '1 1 calc(33.33% - 16px)',
                                                                        input: {
                                                                            borderColor: "red",
                                                                        },
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        ))}
                                                    </Group>
                                                </Checkbox.Group>
                                            </ScrollArea>
                                        </Box>
                                    </Box>
                                </Grid.Col>
                            </React.Fragment>
                        ))}
                    </Grid>
                </ScrollArea>
            </Grid.Col>

            <Grid.Col span={1}>
                <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
                    <Shortcut
                        FormSubmit={"EntityFormSubmit"}
                        Name={"name"}
                        inputType="select"
                    />
                </Box>
            </Grid.Col>
        </Grid>
    );
}
