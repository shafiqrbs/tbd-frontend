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
        filterList('');
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

    const filterList = (searchValue) => {
        const updatedList = getActions().reduce((acc, group) => {
            const filteredActions = group.actions.filter(action =>
                action.label.toLowerCase().includes(searchValue.toLowerCase())
            );
            return [...acc, ...filteredActions];
        }, []);

        setFilteredItems(updatedList);
        setSelectedIndex(-1);
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
            event.preventDefault();
            setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex((prevIndex) =>
                prevIndex <= 0 ? filteredItems.length - 1 : prevIndex - 1
            );
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
                                        filterList('');
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
                                    onClick={onClose}
                                />
                                <Kbd ml={"-lg"} h={'24'} c={'gray.8'} fz={'12'}>Alt </Kbd> + <Kbd c={'gray.8'} h={'24'} fz={'12'} mr={'xl'}> X</Kbd>
                            </>
                        )}
                    </div>
                }
                onChange={(event) => {
                    setValue(event.target.value);
                    filterList(event.target.value);
                }}
                onKeyDown={handleKeyDown}
                className="no-focus-outline"
            />

            <ScrollArea h={'400'} className={'boxBackground borderRadiusAll'} type="never" ref={scrollRef}>
                <Box p={'xs'}>
                    {filteredItems.length > 0 ? (

                        filteredItems.reduce((groups, item) => {
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
                                                    className={filteredItems.indexOf(action) === selectedIndex ? 'highlightedItem' : ''}
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: '8px'
                                                    }}
                                                    gap={'0'}
                                                >
                                                    <Stack direction="column" mt={'xs'} gap={'0'} pl={'xs'}>
                                                        <Title order={6} mt={'2px'} className="title">
                                                            {action.label}
                                                        </Title>
                                                        <Text size="sm" c={'#828282'} className="description">
                                                            {action.description}
                                                        </Text>
                                                    </Stack>
                                                </Stack>
                                            </Link>
                                        </GridCol>
                                    ))}
                                </Grid>
                            </React.Fragment>
                        ))
                    )
                        : (
                            <Text align="center" size="md" c="#828282" mt="md">
                                {t('NoResultsFound.TryDifferentSearchTerm.')}
                            </Text>
                        )
                    }
                </Box>
            </ScrollArea>
        </>
    );
}

export default SearchModal;