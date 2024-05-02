import {
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
    rem,
    useMantineTheme,
    Image,
    ActionIcon,
    Tooltip,
    Kbd,
    Menu,
    Modal,
    Notification, NavLink, Container, Flex, ScrollArea
} from "@mantine/core";
import Logo from "../../assets/images/tbd-logo.png";

import { useDisclosure, useFullscreen, useHotkeys } from "@mantine/hooks";
import {
    IconNotification,
    IconCode,
    IconBook,
    IconChartPie3,
    IconFingerprint,
    IconCoin,
    IconChevronDown,
    IconLogout,
    IconSearch,
    IconWindowMaximize,
    IconWindowMinimize,
    IconChevronLeft,
    IconChevronRight,
    IconWifiOff,
    IconTableShortcut,
    IconCategory
} from "@tabler/icons-react";
import HeaderStyle from "./../../assets/css/Header.module.css";
import LanguagePickerStyle from "./../../assets/css/LanguagePicker.module.css";
import { Spotlight, spotlight } from "@mantine/spotlight";
import "@mantine/spotlight/styles.css";
import React, { useEffect, useState } from "react";
import flagBD from "../../assets/images/flags/bd.svg";
import flagGB from "../../assets/images/flags/gb.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import getSpotlightDropdownData from "../global-hook/spotlight-dropdown/getSpotlightDropdownData.js";
import getConfigData from "../global-hook/config-data/getConfigData.js";
import SearchModal from "../modules/modals/SearchModal.jsx";

const mockdata = [
    {
        icon: IconCode,
        title: "Open source",
        description: "This Pokémon’s cry is very loud and distracting",
    },
    {
        icon: IconCoin,
        title: "Free for everyone",
        description: "The fluid of Smeargle’s tail secretions changes",
    },
    {
        icon: IconBook,
        title: "Documentation",
        description: "Yanma is capable of seeing 360 degrees without",
    },
    {
        icon: IconFingerprint,
        title: "Security",
        description: "The shell’s rounded shape and the grooves on its.",
    },
    {
        icon: IconChartPie3,
        title: "Analytics",
        description: "This Pokémon uses its flying ability to quickly chase",
    },
    {
        icon: IconNotification,
        title: "Notifications",
        description: "Combusken battles with the intensely hot flames it spews",
    },
];


const languages = [
    { label: "EN", value: "en", flag: flagGB },
    { label: "BN", value: "bn", flag: flagBD },
];

export default function Header({
    isOnline,
    navbarOpened,
    toggleNavbar,
    rightSidebarOpened,
    toggleRightSideBar,
}) {
    const [opened, { open, close }] = useDisclosure(false);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { toggle, fullscreen } = useFullscreen();
    const [languageOpened, setLanguageOpened] = useState(false);
    const [languageSelected, setLanguageSelected] = useState(
        languages.find((item) => item.value === i18n.language)
    );
    const configData = getConfigData()

    function logout() {
        localStorage.clear();
        navigate("/login");
    }

    useHotkeys([['alt+k', () => {
        open()
    }]], []);
    useHotkeys([['alt+x', () => {
        close()
    }]], []);

    const links = mockdata.map((item) => (
        <UnstyledButton className={HeaderStyle.subLink} key={item.title}>
            <Group wrap="nowrap" align="flex-start">
                <ThemeIcon size={34} variant="default" radius="md">
                    <item.icon
                        style={{ width: rem(22), height: rem(22) }}
                        color={theme.colors.blue[6]}
                    />
                </ThemeIcon>
                <div>
                    <Text size="sm" fw={500}>
                        {item.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                        {item.description}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    ));
    return (
        <>
            <Modal.Root
                opened={opened}
                onClose={close}
                size="60%"
            >
                <Modal.Overlay />
                <Modal.Content p={'xs'}>
                    <Modal.Header>
                        <Modal.Title>{configData && configData.domain ? configData.domain.name : 'Store Name'}</Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <SearchModal onClose={close} />
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
            <Box bg={'white'} h={`100%`} pos={`relative`}>
                <Group justify="space-between" h="100%" pl={'md'} px={`xs`} mr={'4'}>
                    <Group>
                        <NavLink
                            href="/"
                            c={'red'}
                            fw={'800'}
                            component="button"
                            label={configData && configData.domain ? configData.domain.name : 'Store Name'}
                            onClick={(e) => { navigate('/') }}
                        />
                        {/*<Tooltip
                            label={navbarOpened ? t("collapse_navbar") : t("expand_navbar")}
                            bg={`red.4`}
                            position="right-center"
                            color="red"
                            withArrow
                        >
                            <Burger onClick={toggleNavbar} size="sm"/>
                        </Tooltip>*/}
                        {/*  <HoverCard
                            width={600}
                            position="bottom"
                            radius="md"
                            shadow="md"
                            withinPortal
                        >
                            <HoverCard.Target>
                                <Center
                                    inline
                                    fw={500}
                                    fz={`var(--mantine-font-size-sm)`}
                                    style={{cursor: "default"}}
                                >
                                    <Box component="span" mr={5}>
                                        {t("QuickMenu")}
                                    </Box>
                                    <IconChevronDown
                                        style={{width: rem(16), height: rem(16)}}
                                        color={theme.colors.blue[6]}
                                    />
                                </Center>
                            </HoverCard.Target>
                            <HoverCard.Dropdown style={{overflow: "hidden"}} mt={"xs"}>
                                <Group justify="space-between" px="md">
                                    <Text fw={500}>Features</Text>
                                    <Anchor href="#" fz="xs">
                                        View all
                                    </Anchor>
                                </Group>

                                <Divider my="sm"/>

                                <SimpleGrid cols={2}>{links}</SimpleGrid>

                                <div className={HeaderStyle.dropdownFooter}>
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={500} fz="sm">
                                                Get started
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                Their food sources have decreased, and their numbers
                                            </Text>
                                        </div>
                                        <Button variant="default">Get started</Button>
                                    </Group>
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard>*/}
                    </Group>
                    <Group>
                        <Flex direction={`column`} align={'center'} w={'600'}>
                            <Button
                                leftSection={
                                    <>
                                        <IconSearch size={16} c={'red.5'} />
                                        <Text fz={`xs`} pl={'xs'} c={'gray.8'}>{t("SearchMenu")}</Text>
                                    </>
                                }
                                fullWidth
                                variant="transparent"
                                rightSection={
                                    <>
                                        <Kbd h={'24'} c={'gray.8'} fz={'12'}>Alt </Kbd> + <Kbd c={'gray.8'} h={'24'}
                                            fz={'12'}> K</Kbd>
                                    </>
                                }
                                w={`100%`}
                                h={'32'}
                                justify="space-between"
                                style={{ border: `2px solid var(--mantine-color-gray-5)` }}
                                color={`gray`}
                                onClick={open}
                            />
                        </Flex>

                    </Group>
                    <Group>
                        <Menu
                            onOpen={() => setLanguageOpened(true)}
                            onClose={() => setLanguageOpened(false)}
                            radius="md"
                            width="target"
                            withinPortal
                            withArrow arrowPosition="center"
                        >
                            <Menu.Target>
                                <UnstyledButton
                                    p={2}
                                    className={LanguagePickerStyle.control}
                                    data-expanded={languageOpened || undefined}
                                >
                                    <Group gap="xs">
                                        <Image
                                            src={languageSelected?.flag}
                                            width={18}
                                            height={18}
                                        />
                                        <span className={LanguagePickerStyle.label}>
                                            {languageSelected?.label}
                                        </span>
                                    </Group>
                                    <IconChevronDown
                                        size="1rem"
                                        className={LanguagePickerStyle.icon}
                                        stroke={1}
                                    />
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown p={4} className={LanguagePickerStyle.dropdown}>
                                {languages.map((item) => (
                                    <Menu.Item
                                        p={4}
                                        leftSection={
                                            <Image src={item.flag} width={18} height={18} />
                                        }
                                        onClick={() => {
                                            setLanguageSelected(item);
                                            i18n.changeLanguage(item.value);
                                        }}
                                        key={item.label}
                                    >
                                        {item.label}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                        <Tooltip
                            label={fullscreen ? t("NormalScreen") : t("Fullscreen")}
                            bg={`red.5`} withArrow
                            position={"left"}
                        >
                            <ActionIcon onClick={toggle} variant="subtle" color={`red.4`}>
                                {fullscreen ? (
                                    <IconWindowMinimize size={24} />
                                ) : (
                                    <IconWindowMaximize size={24} />
                                )}
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t("Logout")} bg={`red.5`} withArrow position={"left"}>
                            <ActionIcon onClick={() => logout()} variant="subtle" color={`gray.6`}>
                                <IconLogout size={24} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
                {/*<Spotlight
                    actions={getSpotlightDropdownData()}
                    nothingFound={t("NothingFound")}
                    highlightQuery
                    searchProps={{
                        leftSection: <IconSearch size={'xs'} style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
                        placeholder: t("SearchMenu"),
                    }}
                />*/}
                <Notification
                    pos={`absolute`}
                    display={isOnline ? "none" : ""}
                    right={0}
                    top={5}
                    withCloseButton={false}
                    icon={<IconWifiOff />}
                    color={`yellow`}
                    radius="xs"
                    title={t("Offline")}
                ></Notification>
            </Box>
        </>
    );
}
