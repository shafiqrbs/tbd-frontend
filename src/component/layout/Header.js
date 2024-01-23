import {
    createStyles,
    Header,
    HoverCard,
    Group,
    Button,
    UnstyledButton,
    Text,
    SimpleGrid,
    ThemeIcon,
    Anchor,
    Divider,
    Center,
    Box,
    Burger,
    Drawer,
    Collapse,
    ScrollArea,
    Autocomplete,
    rem,
    MediaQuery,
    Tooltip,Menu,

} from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight } from '@tabler/icons-react';
import { TextInput, TextInputProps, ActionIcon, useMantineTheme } from '@mantine/core';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { IconChevronRight,IconLogout,IconWindowMaximize,IconWindowMinimize } from '@tabler/icons-react';
import {IconScreenShare } from '@tabler/icons-react';


import { MantineLogo } from '@mantine/ds';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {
    IconNotification,
    IconCode,
    IconBook,
    IconChartPie3,
    IconFingerprint,
    IconCoin,
    IconChevronDown,
} from '@tabler/icons-react';
import {useState} from "react";
import Dictaphone from "../SpeechRecognition";
const useStyles = createStyles((theme) => ({
    link: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,

        [theme.fn.smallerThan('sm')]: {
            height: rem(42),
            display: 'flex',
            alignItems: 'center',
            width: '100%',
        },

        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        }),
    },

    subLink: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: theme.radius.md,

        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        }),

        '&:active': theme.activeStyles,
    },

    dropdownFooter: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        margin: `calc(${theme.spacing.md} * -1)`,
        marginTop: theme.spacing.sm,
        padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
        paddingBottom: theme.spacing.xl,
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
        }`,
    },

    hiddenMobile: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    hiddenDesktop: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },
}));

const mockdata = [
    {
        icon: IconCode,
        title: 'Open source',
        description: 'This Pokémon’s cry is very loud and distracting',
    },
    {
        icon: IconCoin,
        title: 'Free for everyone',
        description: 'The fluid of Smeargle’s tail secretions changes',
    },
    {
        icon: IconBook,
        title: 'Documentation',
        description: 'Yanma is capable of seeing 360 degrees without',
    },
    {
        icon: IconFingerprint,
        title: 'Security',
        description: 'The shell’s rounded shape and the grooves on its.',
    },
    {
        icon: IconChartPie3,
        title: 'Analytics',
        description: 'This Pokémon uses its flying ability to quickly chase',
    },
    {
        icon: IconNotification,
        title: 'Notifications',
        description: 'Combusken battles with the intensely hot flames it spews',
    },
];

export function HeaderMegaMenu() {

    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const { classes, theme } = useStyles();
    const [opened, setOpened] = useState(false);
    const largeScreen = useMediaQuery('(min-width: 60em)');
    const { toggle, fullscreen } = useFullscreen();
    const links = mockdata.map((item) => (
        <UnstyledButton className={classes.subLink} key={item.title}>
            <Group noWrap align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon size={rem(22)} color={theme.fn.primaryColor()} />
                </ThemeIcon>
                <div>
                    <Text size="sm" fw={500}>
                        {item.title}
                    </Text>
                    <Text size="xs" color="dimmed">
                        {item.description}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    ));

    return (
        <Box pb={120}>
            <Header height={56} px="md">
                <div className="flex py-3">
                    <div className="flex-none w-60 ... " >
                        <Group position="apart" sx={{ height: '100%' }}>
                            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="xl"
                                />
                            </MediaQuery>
                            <MediaQuery largerThan="sm">
                                <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
                                    <MantineLogo size={30} className={classes.hiddenMobile} />
                                </Group>
                            </MediaQuery>

                        </Group>
                    </div>

                    <div className="flex-none w-40 ... " >
                        <Group position="apart" sx={{ height: '100%' }}>
                            <MediaQuery largerThan="sm">
                                <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
                                    <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                                        <HoverCard.Target>
                                            <a href="#" className={classes.link}>
                                                <Center inline>
                                                    <Box component="span" mr={5}>
                                                        Shortcuts
                                                    </Box>
                                                    <IconChevronDown size={16} color={theme.fn.primaryColor()} />
                                                </Center>
                                            </a>
                                        </HoverCard.Target>

                                        <HoverCard.Dropdown sx={{ overflow: 'hidden' }}>
                                            <Group position="apart" px="md">
                                                <Text fw={500}>Features</Text>
                                                <Anchor href="#" fz="xs">
                                                    View all
                                                </Anchor>
                                            </Group>

                                            <Divider
                                                my="sm"
                                                mx="-md"
                                                color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
                                            />

                                            <SimpleGrid cols={2} spacing={0}>
                                                {links}
                                            </SimpleGrid>

                                            <div className={classes.dropdownFooter}>
                                                <Group position="apart">
                                                    <div>
                                                        <Text fw={500} fz="sm">
                                                            Get started
                                                        </Text>
                                                        <Text size="xs" color="dimmed">
                                                            Their food sources have decreased, and their numbers
                                                        </Text>
                                                    </div>
                                                    <Button variant="default">Get started</Button>
                                                </Group>
                                            </div>
                                        </HoverCard.Dropdown>
                                    </HoverCard>
                                </Group>
                            </MediaQuery>
                        </Group>
                    </div>
                    <div className="flex-none w-40 ... " >
                        <Group position="apart" sx={{ height: '100%' }}>
                            <MediaQuery largerThan="sm">
                                <Tooltip label="All Navigation here"
                                         color="red"
                                         position="top"
                                         withArrow>
                                    <a href="#" className={classes.link}>
                                        <Center inline>
                                            <Box component="span" mr={5}>
                                                Menu
                                            </Box>
                                        </Center>
                                    </a>
                                </Tooltip>
                            </MediaQuery>
                        </Group>
                    </div>
                    <div className="flex-auto w-32 ...">
                        <Autocomplete
                            icon={<IconSearch size="1.1rem" stroke={1.5} />}
                            className={classes.search}
                            placeholder="Search"
                            mx="auto"
                            style={{ width: '100%' }}
                            position="center"
                            rightSection={
                                <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
                                    {theme.dir === 'ltr' ? (
                                        <IconArrowRight size="1.1rem" stroke={1.5} />
                                    ) : (
                                        <IconArrowLeft size="1.1rem" stroke={1.5} />
                                    )}
                                </ActionIcon>
                            }
                            data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
                        />

                    </div>
                    <div className="flex-none px-2 float-right">
                        <Group position="apart" sx={{ height: '100%' }}>
                            <Group className={classes.hiddenMobile}>
                                <Menu>
                                    <Menu.Target>
                                        <Tooltip label="Click Setting Navigation"
                                                 color="green"
                                                 position="bottom"
                                                 withArrow>
                                        <Button className="text-green-600 pl-4 pr-1 hover:bg-transparent hover:text-green-700">
                                            <IconSettings size='20' className="text"></IconSettings>
                                        </Button>
                                        </Tooltip>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Label>Application</Menu.Label>
                                        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
                                        <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
                                        <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
                                        <Menu.Item
                                            icon={<IconSearch size={14} />}
                                            rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
                                        >
                                            Search
                                        </Menu.Item>

                                        <Menu.Divider />

                                        <Menu.Label>Danger zone</Menu.Label>
                                        <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
                                        <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
                                    </Menu.Dropdown>
                                    <Tooltip label="Full Screen"
                                             color="blue"
                                             position="bottom"
                                             withArrow>
                                    <Button className="text-blue-600 pl-2 pr-2 hover:bg-transparent hover:text-blue-700" onClick={toggle} color={fullscreen ? 'red' : 'blue'}>
                                        {fullscreen ? <IconWindowMaximize size='20' className="text"></IconWindowMaximize> : <IconWindowMinimize size='20' className="text"></IconWindowMinimize>}
                                    </Button>
                                    </Tooltip>
                                    <Tooltip label="Log out"
                                             color="red"
                                             position="bottom"
                                             withArrow>
                                    <Button className="text-red-600 pl-2 pr-2 hover:bg-transparent hover:text-rede-700">
                                        <IconLogout size='20' className="text"></IconLogout>
                                    </Button>
                                    </Tooltip>
                                </Menu>
                            </Group>
                        </Group>
                    </div>
                </div>

            </Header>
        </Box>
    );
}