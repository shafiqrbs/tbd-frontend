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
  Notification,
} from "@mantine/core";
import Logo from "../../assets/images/tbd-logo.png";

import { useFullscreen } from "@mantine/hooks";
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
  IconHome,
  IconDashboard,
  IconFileText,
  IconWindowMaximize,
  IconWindowMinimize,
  IconChevronLeft,
  IconChevronRight,
  IconMenu,
  IconWifiOff,
  IconWifi,
  IconWifi0,
  IconWifi1,
  IconMenu2,
} from "@tabler/icons-react";
import HeaderStyle from "./../../assets/css/Header.module.css";
import LanguagePickerStyle from "./../../assets/css/LanguagePicker.module.css";
import { Spotlight, spotlight } from "@mantine/spotlight";
import "@mantine/spotlight/styles.css";
import { useEffect, useState } from "react";
import flagBD from "../../assets/images/flags/bd.svg";
import flagGB from "../../assets/images/flags/gb.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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


const actions  = [
  {
    group: 'Pages',
    actions: [
      { id: 'home', label: 'Home page', description: 'Where we present the product' },
      { id: 'careers', label: 'Careers page', description: 'Where we list open positions' },
      { id: 'about-us', label: 'About us page', description: 'Where we tell what we do' },
    ],
  },

  {
    group: 'Apps',
    actions: [
      { id: 'svg-compressor', label: 'SVG compressor', description: 'Compress SVG images' },
      { id: 'base64', label: 'Base 64 converter', description: 'Convert data to base 64 format' },
      { id: 'fake-data', label: 'Fake data generator', description: 'Lorem ipsum generator' },
    ],
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { toggle, fullscreen } = useFullscreen();
  const [languageOpened, setLanguageOpened] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(
    languages.find((item) => item.value === i18n.language)
  );

  // console.log(languageSelected)


  // console.log(localStorage.getItem('language'))

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

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
      <Box h={`100%`} pos={`relative`}>
        <Group justify="space-between" h="100%" px={`xs`}>
          <Group>
            <Tooltip
              label={navbarOpened ? t("collapse_navbar") : t("expand_navbar")}
              bg={`green`}
            >
              <Burger onClick={toggleNavbar} size="sm" />
            </Tooltip>
            <Image src={Logo} w={140} />
            <HoverCard
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
                  style={{ cursor: "default" }}
                >
                  <Box component="span" mr={5}>
                    {t("shortcuts")}
                  </Box>
                  <IconChevronDown
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.blue[6]}
                  />
                </Center>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }} mt={"xs"}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

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
            </HoverCard>
          </Group>

          <Button
            leftSection={
              <>
                <IconSearch size={16} color="rgba(158, 158, 158, 0.3)" />
                <Text fz={`xs`} c={`gray.3`}>
                  {t("search")}
                </Text>
              </>
            }
            variant="transparent"
            rightSection={
              <>
                <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
              </>
            }
            w={`50%`}
            justify="space-between"
            style={{ border: `1px solid var(--mantine-color-gray-2)` }}
            color={`gray`}
            onClick={spotlight.open}
          ></Button>

          <Group>
            <Menu
              onOpen={() => setLanguageOpened(true)}
              onClose={() => setLanguageOpened(false)}
              radius="md"
              width="target"
              withinPortal
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
                      width={22}
                      height={22}
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
              <Menu.Dropdown className={LanguagePickerStyle.dropdown}>
                {languages.map((item) => (
                  <Menu.Item
                    p={2}
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
              label={fullscreen ? t("normal_screen") : t("fullscreen")}
              bg={`green`}
            >
              <ActionIcon onClick={toggle} variant="subtle" color={`green.3`}>
                {fullscreen ? (
                  <IconWindowMinimize size={20} />
                ) : (
                  <IconWindowMaximize size={20} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("log_out")} bg={`red`}>
              <ActionIcon onClick={() => logout()} variant="subtle" color="red">
                <IconLogout size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={
                rightSidebarOpened
                  ? t("collapse_right_sidebar")
                  : t("expand_right_sidebar")
              }
              bg={`indigo`}
            >
              <ActionIcon
                onClick={toggleRightSideBar}
                variant="light"
                color="indigo"
                size={20}
                radius={`xs`}
              >
                {rightSidebarOpened ? (
                  <IconChevronRight />
                ) : (
                  <IconChevronLeft />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>


        <Spotlight
            actions={actions}
            nothingFound="Nothing found..."
            highlightQuery
            searchProps={{
              leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
              placeholder: 'Search...',
            }}
        />

        {/*<Spotlight
          actions={actions}
          nothingFound="Nothing found..."
          highlightQuery
          searchProps={{
            leftSection: (
              <IconSearch
                style={{ width: rem(20), height: rem(20) }}
                stroke={1.5}
              />
            ),
            placeholder: "Search...",
          }}
        />*/}

        <Notification
          pos={`absolute`}
          display={isOnline ? "none" : ""}
          right={0}
          top={5}
          // loading
          withCloseButton={false}
          icon={<IconWifiOff />}
          color={`yellow`}
          radius="xs"
          title={t("you_are_offline_now")}
        ></Notification>
      </Box>
    </>
  );
}
