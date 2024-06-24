import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Flex, Progress, Box, Grid, rem, CloseButton, Kbd, Stack, Title, Text, ScrollArea } from '@mantine/core';
import SampleModal from './SampleModal';
import { IconCross, IconPrinter, IconSearch, IconRestore, IconXboxX } from '@tabler/icons-react';
import ReactToPrint from 'react-to-print';
import { useOutletContext } from "react-router-dom";
import SalesPrint from './SalesPrint';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AccountingHeaderNavbar from '../accounting/AccountingHeaderNavbar';
import { getLoadingProgress } from '../../global-hook/loading-progress/getLoadingProgress';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { useState } from 'react';
import getSpotlightDropdownData from '../../global-hook/spotlight-dropdown/getSpotlightDropdownData';
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useHotkeys } from '@mantine/hooks';



function SampleModalIndex() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const ref = useRef(null);
    const scrollRef = useRef(null);
    const progress = getLoadingProgress()
    const { height, } = useOutletContext()
    useHotkeys([['alt+c', () => {
        setQuery('');
        ref.current?.focus();
    }]], []);

    const actions = getSpotlightDropdownData(t);

    return (
        <>
            <Spotlight.Root query={query} onQueryChange={setQuery} size={'lg'}>
                <Spotlight.Search
                    ref={ref}
                    placeholder={t('SearchMenu')}
                    leftSection={<IconSearch size={16} color="red" />}
                    rightSection={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {query ? (
                                <>
                                    <CloseButton
                                        icon={<IconRestore style={{ width: rem(20) }} stroke={2.0} />}
                                        aria-label="Clear input"
                                        onClick={() => setQuery('')}
                                    />
                                    <Kbd>Alt</Kbd> + <Kbd>C</Kbd>
                                </>
                            ) : (
                                <>
                                    <CloseButton
                                        icon={<IconXboxX style={{ width: rem(20) }} stroke={2.0} />}
                                        aria-label="Close"
                                        onClick={spotlight.close}
                                    />
                                    <Kbd>Alt</Kbd> + <Kbd>X</Kbd>
                                </>
                            )}
                        </div>
                    }
                />
                <Spotlight.ActionsList size={'lg'}>
                    <ScrollArea h={600} className={'boxBackground borderRadiusAll'} type="never" >
                        <Box p={'xs'}>
                            {Object.entries(groupedItems).map(([group, items], groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    <Text size="md" fw="bold" c="#828282" mt={groupIndex ? 'md' : undefined}>
                                        {group}
                                    </Text>
                                    <Grid columns={12} grow gutter={'xs'}>
                                        {items.map((action, itemIndex) => (
                                            <Grid.Col key={itemIndex} span={6}>
                                                <Spotlight.Action onClick={() => {
                                                    navigate(action.group === 'Inventory'
                                                        ? `inventory/${action.id}`
                                                        : `${action.group.toLowerCase()}/${action.id}`);
                                                    spotlight.close();
                                                }}>
                                                    <Stack
                                                        bg={'grey.2'}
                                                        ml={'sm'}
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
                                                </Spotlight.Action>
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Box>
                    </ScrollArea>
                </Spotlight.ActionsList>
            </Spotlight.Root>

            {progress !== 100 && <Progress color="red" size={"xs"} striped animated value={progress} />}
            {progress === 100 &&
                <>
                    <AccountingHeaderNavbar
                        pageTitle={t('ManageCustomer')}
                        roles={t('Roles')}
                        allowZeroPercentage=''
                        currencySymbol=''
                    />
                    <Box p={'8'}>
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={24} >
                                <Box bg={'white'} p={'xs'} className={'borderRadiusAll'} h={height} >

                                    <Button onClick={Spotlight.open} m={'lg'}>Open Modal</Button>
                                </Box>
                            </Grid.Col>

                        </Grid>
                    </Box>
                </>
            }
        </>
    );
}

export default SampleModalIndex;