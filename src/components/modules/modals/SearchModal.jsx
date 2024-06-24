import React, { useEffect, useState, useRef } from "react";
import { Box, TextInput, ScrollArea, Stack, Text, Title, GridCol, Grid, CloseButton, rem, Kbd } from "@mantine/core";
import { IconSearch, IconRestore, IconXboxX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useHotkeys } from "@mantine/hooks";
import getSpotlightDropdownData from "../../global-hook/spotlight-dropdown/getSpotlightDropdownData.js";

function SearchModal({ onClose }) {
    const [filteredItems, setFilteredItems] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const ref = useRef(null);
    const scrollRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useHotkeys([['alt+c', () => {
        setValue('');
        filterList({ target: { value: '' } });
        ref.current.focus();
    }]], []);

    const getActions = () => {
        const actions = getSpotlightDropdownData(t);
        let index = 0;
        return actions.map(group => ({
            ...group,
            actions: group.actions.map(action => ({
                ...action,
                index: index++,
                group: group.group,
            })),
        }));
    };

    const filterList = (event) => {
        const updatedList = getActions().reduce((acc, group) => {
            const filteredActions = group.actions.filter(action =>
                action.label.toLowerCase().includes(event.target.value.toLowerCase())
            );
            return [...acc, ...filteredActions];
        }, []);
        setFilteredItems(updatedList);
        setSelectedIndex(-1); // Reset selectedIndex when the filtered list changes
    };

    useEffect(() => {
        setFilteredItems(getActions().reduce((acc, group) => [...acc, ...group.actions], []));
    }, []);

    useEffect(() => {
        if (selectedIndex >= 0 && filteredItems.length > 0) {
            const selectedElement = document.getElementById(`item-${filteredItems[selectedIndex].index}`);
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [selectedIndex, filteredItems]);

    const handleKeyDown = (event) => {
        if (filteredItems.length === 0) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault(); // Prevent scrolling the page with arrow keys
            setSelectedIndex((prevIndex) => {
                const nextIndex = prevIndex === filteredItems.length - 1 ? 0 : prevIndex + 1;
                return nextIndex;
            });
        } else if (event.key === 'ArrowUp') {
            event.preventDefault(); // Prevent scrolling the page with arrow keys
            setSelectedIndex((prevIndex) => {
                const nextIndex = prevIndex === 0 ? filteredItems.length - 1 : prevIndex - 1;
                return nextIndex;
            });
        } else if (event.key === 'Enter' && selectedIndex >= 0) {
            const selectedAction = filteredItems[selectedIndex];
            if (selectedAction) {
                const path = selectedAction.group === 'Production'
                    ? `inventory/${selectedAction.id}`
                    : `${selectedAction.group.toLowerCase()}/${selectedAction.id}`;
                navigate(path);
                onClose();
            }
        }
    };



    return (
        <>
            <TextInput
                w={`100%`}
                align={'center'}
                justify="space-between"
                ref={ref}
                data-autofocus
                mb={4}
                leftSection={<IconSearch size={16} c={'red'} />}
                placeholder={t('SearchMenu')}
                value={value}
                rightSectionPointerEvents="all"
                rightSection={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {value ? (
                            <>
                                <CloseButton
                                    ml={'-50'}
                                    mr={'xl'}
                                    icon={<IconRestore style={{ width: rem(20) }} stroke={2.0} />}
                                    aria-label="Clear input"
                                    onClick={() => {
                                        setValue('');
                                        filterList({ target: { value: '' } });
                                        ref.current.focus();
                                    }}
                                />
                                <Kbd ml={"-xl"} h={'24'} c={'gray.8'} fz={'12'}>Alt</Kbd> + <Kbd c={'gray.8'} h={'24'} fz={'12'} mr={'lg'}>C</Kbd>
                            </>
                        ) : (
                            <>
                                <CloseButton
                                    ml={'-50'}
                                    mr={'lg'}
                                    icon={<IconXboxX style={{ width: rem(20) }} stroke={2.0} />}
                                    aria-label="Close"
                                    onClick={() => {
                                        onClose();
                                    }}
                                />
                                <Kbd ml={"-lg"} h={'24'} c={'gray.8'} fz={'12'}>Alt </Kbd> + <Kbd c={'gray.8'} h={'24'} fz={'12'} mr={'xl'}> X</Kbd>
                            </>
                        )}
                    </div>
                }
                onChange={(event) => {
                    setValue(event.target.value);
                    filterList(event);
                }}
                onKeyDown={handleKeyDown}
                className="no-focus-outline"
            />

            <ScrollArea h={'400'} className={'boxBackground borderRadiusAll'} type="never" ref={scrollRef}>
                <Box p={'xs'}>
                    {filteredItems.reduce((groups, item) => {
                        if (!groups.length || item.group !== groups[groups.length - 1].group) {
                            groups.push({ group: item.group, items: [item] });
                        } else {
                            groups[groups.length - 1].items.push(item);
                        }
                        return groups;
                    }, []).map((groupData, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                            <Text size="md" fw="bold" c="#828282" mt={groupIndex ? 'md' : undefined}>
                                {groupData.group}
                            </Text>
                            <Grid columns={12} grow gutter={'xs'}>
                                {groupData.items.map((action, itemIndex) => (
                                    <GridCol key={itemIndex} span={6}>
                                        <Link
                                            to={
                                                action.group === 'Production'
                                                    ? `inventory/${action.id}`
                                                    : `${action.group.toLowerCase()}/${action.id}`
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(action.group === 'Production'
                                                    ? `inventory/${action.id}`
                                                    : `${action.group.toLowerCase()}/${action.id}`);
                                                onClose();
                                            }}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <Stack
                                                bg={'grey.2'}
                                                ml={'sm'}
                                                id={`item-${action.index}`}
                                                className={selectedIndex === action.index ? 'highlightedItem' : ''}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '8px'
                                                }}
                                                gap={'0'}
                                            >
                                                <Stack direction="column" mt={'xs'} gap={'0'}>
                                                    <Title order={6} mt={'2px'}>
                                                        {action.label}
                                                    </Title>
                                                    <Text size="sm" c={'#828282'}>
                                                        {action.description}
                                                    </Text>
                                                </Stack>
                                            </Stack>
                                        </Link>
                                    </GridCol>
                                ))}
                            </Grid>
                        </React.Fragment>
                    ))}
                </Box>
            </ScrollArea>
        </>
    );
}

export default SearchModal;
