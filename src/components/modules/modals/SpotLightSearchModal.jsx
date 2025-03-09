import React, {useEffect, useRef, useState} from "react";
import {
    Box, CloseButton, Grid, GridCol, Kbd, LoadingOverlay, rem, ScrollArea, Stack, Text, TextInput, Title
} from "@mantine/core";
import {IconRestore, IconSearch, IconXboxX} from "@tabler/icons-react";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import {useHotkeys} from "@mantine/hooks";
import getSpotlightDropdownData from "../../global-hook/spotlight-dropdown/getSpotlightDropdownData.js";
import getConfigData from "../../global-hook/config-data/getConfigData.js";

function SpotLightSearchModal({onClose}) {
    const [filteredItems, setFilteredItems] = useState([]);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [value, setValue] = useState("");
    const ref = useRef(null);
    const scrollRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Initialize the loading state as true
    const [visible, setVisible] = useState(true);

    const {configData, fetchData} = getConfigData()

    localStorage.setItem("config-data", JSON.stringify(configData));

    const [configDataSpot, setConfigData] = useState(configData);

    // Fetch the configData from local storage and set loading
    useEffect(() => {
        const checkConfigData = () => {
            const storedConfigData = localStorage.getItem("config-data");
            if (storedConfigData) {
                setConfigData(JSON.parse(storedConfigData));
            } else {
                navigate("/login");
            }
        };

        const timeoutId = setTimeout(checkConfigData, 500);

        return () => clearTimeout(timeoutId);
    }, [navigate]);

    useHotkeys([["alt+c", () => {
        setValue("");
        filterList("");
        ref.current.focus();
    },],]);

    // Get actions filtered from Spotlight based on configData
    const getActions = () => {
        const actions = getSpotlightDropdownData(t, configDataSpot);
        let index = 0;

        // Assign an index to each action
        return actions.map((group) => ({
            ...group, actions: group.actions.map((action) => ({
                ...action, index: index++, group: group.group,
            })),
        }));
    };

    // Filter the actions based on searchValue
    const filterList = (searchValue) => {
        const updatedList = getActions().reduce((acc, group) => {
            const filteredActions = group.actions.filter((action) => action.label.toLowerCase().includes(searchValue.toLowerCase()));
            return [...acc, ...filteredActions];
        }, []);

        setFilteredItems(updatedList);
        setSelectedIndex(-1);
    };

    // Initialize the filtered list when component mounts
    useEffect(() => {
        if (configDataSpot) {
            const allActions = getActions().reduce((acc, group) => [...acc, ...group.actions], []);
            setFilteredItems(allActions);
            setTimeout(() => {
                if (allActions) {
                    setVisible(false); // Hide the loader when data has been fetched
                }
            },1000)
        }
    }, [configDataSpot]);

    useEffect(() => {
        if (selectedIndex >= 0 && filteredItems.length > 0) {
            const selectedElement = document.getElementById(`item-${filteredItems[selectedIndex].index}`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: "smooth", block: "nearest",
                });
            }
        }
    }, [selectedIndex, filteredItems]);

    const handleKeyDown = (event) => {
        if (filteredItems.length === 0) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedIndex((prevIndex) => prevIndex <= 0 ? filteredItems.length - 1 : prevIndex - 1);
        } else if (event.key === "Enter" && selectedIndex >= 0) {
            const selectedAction = filteredItems[selectedIndex];
            if (selectedAction) {
                const path = selectedAction.group === "Production" || selectedAction.group === "প্রোডাকশন" ? `production/${selectedAction.id}` : selectedAction.group === "Core" || selectedAction.group === "কেন্দ্র" ? `core/${selectedAction.id}` : selectedAction.group === "Inventory" || selectedAction.group === "ইনভেন্টরি" ? `inventory/${selectedAction.id}` : selectedAction.group === "Domain" || selectedAction.group === "ডোমেইন" ? `domain/${selectedAction.id}` : selectedAction.group === "Accounting" || selectedAction.group === "একাউন্টিং" ? `accounting/${selectedAction.id}` : selectedAction.group === "Procurement" ? `procurement/${selectedAction.id}` : selectedAction.group === "Sales & Purchase" ? `inventory/${selectedAction.id}` : `/sitemap`;

                navigate(path);
                onClose();
            }
        }
    };
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (<>
            {filteredItems && (<>
                    <TextInput
                        w={`100%`}
                        align={"center"}
                        justify="space-between"
                        ref={ref}
                        data-autofocus
                        mb={4}
                        leftSection={<IconSearch size={16} c={"red"}/>}
                        placeholder={t("SearchMenu")}
                        value={value}
                        rightSectionPointerEvents="all"
                        rightSection={<div style={{display: "flex", alignItems: "center"}}>
                            {value ? (<>
                                    <CloseButton
                                        ml={"-50"}
                                        mr={"xl"}
                                        icon={<IconRestore style={{width: rem(20)}} stroke={2.0}/>}
                                        aria-label="Clear input"
                                        onClick={() => {
                                            setValue("");
                                            filterList("");
                                            ref.current.focus();
                                        }}
                                    />
                                    <Kbd ml={"-xl"} h={"24"} c={"gray.8"} fz={"12"}>
                                        Alt
                                    </Kbd>{" "}
                                    +{" "}
                                    <Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"lg"}>
                                        C
                                    </Kbd>
                                </>) : (<>
                                    <CloseButton
                                        ml={"-50"}
                                        mr={"lg"}
                                        icon={<IconXboxX style={{width: rem(20)}} stroke={2.0}/>}
                                        aria-label="Close"
                                        onClick={onClose}
                                    />
                                    <Kbd ml={"-lg"} h={"24"} c={"gray.8"} fz={"12"}>
                                        Alt{" "}
                                    </Kbd>{" "}
                                    +{" "}
                                    <Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"xl"}>
                                        X
                                    </Kbd>
                                </>)}
                        </div>}
                        onChange={(event) => {
                            setValue(event.target.value);
                            filterList(event.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        className="no-focus-outline"
                    />

                    <ScrollArea
                        h={"400"}
                        className={"boxBackground borderRadiusAll"}
                        type="never"
                        ref={scrollRef}
                    >
                        <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}
                                        loaderProps={{color: 'red'}}/>
                        <Box p={"xs"}>
                            {filteredItems.length > 0 ? (filteredItems
                                    .reduce((groups, item) => {
                                        if (!groups.length || item.group !== groups[groups.length - 1].group) {
                                            groups.push({group: item.group, items: [item]});
                                        } else {
                                            groups[groups.length - 1].items.push(item);
                                        }
                                        return groups;
                                    }, [])
                                    .map((groupData, groupIndex) => (<React.Fragment key={groupIndex}>
                                            <Text
                                                size="md"
                                                fw="bold"
                                                c="#828282"
                                                mt={groupIndex ? "md" : undefined}
                                            >
                                                {groupData.group}
                                            </Text>
                                            <Grid columns={12} grow gutter={"xs"}>
                                                {/*{groupData.items.map((action, itemIndex) => (
                                                    {
                                                        action?.isShow && (
                                                        <GridCol key={itemIndex} span={6}>
                                                            <Link
                                                                to={action.id === "inhouse" ? "#" : action.group === "Production" || action.group === "প্রোডাকশন" ? `production/${action.id}` : action.group === "Core" || action.group === "কেন্দ্র" ? `core/${action.id}` : action.group === "Inventory" || action.group === "ইনভেন্টরি" ? `inventory/${action.id}` : action.group === "Domain" || action.group === "ডোমেইন" ? `domain/${action.id}` : action.group === "Accounting" || action.group === "একাউন্টিং" ? `accounting/${action.id}` : action.group === "Procurement" ? `procurement/${action.id}` : action.group === "Sales & Purchase" ? `inventory/${action.id}` : `/sitemap`}
                                                                onClick={(e) => {
                                                                    navigate(action.group === "Production" || action.group === "প্রোডাকশন" ? `production/${action.id}` : action.group === "Core" || action.group === "কেন্দ্র" ? `core/${action.id}` : action.group === "Inventory" || action.group === "ইনভেন্টরি" ? `inventory/${action.id}` : action.group === "Domain" || action.group === "ডোমেইন" ? `domain/${action.id}` : action.group === "Accounting" || action.group === "একাউন্টিং" ? `accounting/${action.id}` : action.group === "Sales & Purchase" ? `inventory/${action.id}` : `/sitemap`);
                                                                    onClose();
                                                                }}
                                                                style={{textDecoration: "none", color: "inherit"}}
                                                                onMouseEnter={() => {
                                                                    setHoveredIndex(action.index);
                                                                    setSelectedIndex(-1);
                                                                }}
                                                                onMouseLeave={() => setHoveredIndex(null)}
                                                            >
                                                                <Stack
                                                                    bg={"grey.2"}
                                                                    ml={"sm"}
                                                                    id={`item-${action.index}`}
                                                                    className={`
                                                        ${filteredItems.indexOf(action) === selectedIndex ? "highlightedItem" : ""}
                                                        ${hoveredIndex === action.index ? "hoveredItem" : ""}
                                                    `}
                                                                    style={{
                                                                        cursor: "pointer", padding: "8px",
                                                                    }}
                                                                    gap={"0"}
                                                                >
                                                                    <Stack
                                                                        direction="column"
                                                                        mt={"xs"}
                                                                        gap={"0"}
                                                                        pl={"xs"}
                                                                    >
                                                                        <Title order={6} mt={"2px"} className="title">
                                                                            {action.label}
                                                                        </Title>
                                                                        <Text
                                                                            size="sm"
                                                                            c={"#828282"}
                                                                            className="description"
                                                                        >
                                                                            {action.description}
                                                                        </Text>
                                                                    </Stack>
                                                                </Stack>
                                                            </Link>
                                                        </GridCol>
                                                    )
                                                    }

                                                    ))}*/}

                                                {groupData.items.map((action, itemIndex) => (
                                                    action.isShow && (
                                                        <GridCol key={itemIndex} span={6}>
                                                            <Link
                                                                to={action.id === "inhouse" ? "#" : action.group === "Production" || action.group === "প্রোডাকশন" ? `production/${action.id}` : action.group === "Core" || action.group === "কেন্দ্র" ? `core/${action.id}` : action.group === "Inventory" || action.group === "ইনভেন্টরি" ? `inventory/${action.id}` : action.group === "Domain" || action.group === "ডোমেইন" ? `domain/${action.id}` : action.group === "Accounting" || action.group === "একাউন্টিং" ? `accounting/${action.id}` : action.group === "Procurement" ? `procurement/${action.id}` : action.group === "Sales & Purchase" ? `inventory/${action.id}` : `/sitemap`}
                                                                onClick={(e) => {
                                                                    navigate(action.group === "Production" || action.group === "প্রোডাকশন" ? `production/${action.id}` : action.group === "Core" || action.group === "কেন্দ্র" ? `core/${action.id}` : action.group === "Inventory" || action.group === "ইনভেন্টরি" ? `inventory/${action.id}` : action.group === "Domain" || action.group === "ডোমেইন" ? `domain/${action.id}` : action.group === "Accounting" || action.group === "একাউন্টিং" ? `accounting/${action.id}` : action.group === "Sales & Purchase" ? `inventory/${action.id}` : `/sitemap`);
                                                                    onClose();
                                                                }}
                                                                style={{textDecoration: "none", color: "inherit"}}
                                                                onMouseEnter={() => {
                                                                    setHoveredIndex(action.index);
                                                                    setSelectedIndex(-1);
                                                                }}
                                                                onMouseLeave={() => setHoveredIndex(null)}
                                                            >
                                                                <Stack
                                                                    bg={"grey.2"}
                                                                    ml={"sm"}
                                                                    id={`item-${action.index}`}
                                                                    className={`
                                                        ${filteredItems.indexOf(action) === selectedIndex ? "highlightedItem" : ""}
                                                        ${hoveredIndex === action.index ? "hoveredItem" : ""}
                                                    `}
                                                                    style={{
                                                                        cursor: "pointer", padding: "8px",
                                                                    }}
                                                                    gap={"0"}
                                                                >
                                                                    <Stack
                                                                        direction="column"
                                                                        mt={"xs"}
                                                                        gap={"0"}
                                                                        pl={"xs"}
                                                                    >
                                                                        <Title order={6} mt={"2px"} className="title">
                                                                            {action.label}
                                                                        </Title>
                                                                        <Text
                                                                            size="sm"
                                                                            c={"#828282"}
                                                                            className="description"
                                                                        >
                                                                            {action.description}
                                                                        </Text>
                                                                    </Stack>
                                                                </Stack>
                                                            </Link>
                                                        </GridCol>
                                                    )
                                                ))}

                                            </Grid>
                                        </React.Fragment>))) : (<Text align="center" size="md" c="#828282" mt="md">
                                    {t("NoResultsFoundTryDifferentSearchTerm")}
                                </Text>)}
                        </Box>
                    </ScrollArea>
                </>)}
        </>);
}

export default SpotLightSearchModal;
