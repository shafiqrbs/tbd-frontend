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
  rem,
  useMantineTheme,
  Image,
  ActionIcon,
  Tooltip,
  Kbd,
  Menu,
  Modal,
  NavLink,
  Flex,
  Grid,
  Stack,
  Title,
} from "@mantine/core";

import { useDisclosure, useFullscreen, useHotkeys } from "@mantine/hooks";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCircleCheck,
  IconChevronDown,
  IconLogout,
  IconSearch,
  IconWindowMaximize,
  IconWindowMinimize,
  IconWifiOff,
  IconWifi,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import HeaderStyle from "./../../assets/css/Header.module.css";
import classes from "./../../assets/css/Header.module.css";
import LanguagePickerStyle from "./../../assets/css/LanguagePicker.module.css";
import "@mantine/spotlight/styles.css";
import React, { useEffect, useState } from "react";
import flagBD from "../../assets/images/flags/bd.svg";
import flagGB from "../../assets/images/flags/gb.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SpotLightSearchModal from "../modules/modals/SpotLightSearchModal.jsx";
import { useDispatch } from "react-redux";
import { setInventoryShowDataEmpty } from "../../store/inventory/crudSlice.js";
import shortcutDropdownData from "../global-hook/shortcut-dropdown/shortcutDropdownData.js";

const languages = [
  { label: "EN", value: "en", flag: flagGB },
  { label: "BN", value: "bn", flag: flagBD },
];

export default function Header({ isOnline, configData }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useMantineTheme();
  const { toggle, fullscreen } = useFullscreen();
  const [languageOpened, setLanguageOpened] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(
    languages.find((item) => item.value === i18n.language)
  );
  const [visible, setVisible] = useState(true);

  const [configDataSpot, setConfigData] = useState(null);
  useEffect(() => {
    const checkConfigData = () => {
      const storedConfigData = localStorage.getItem("config-data");
      if (storedConfigData) {
        setConfigData(JSON.parse(storedConfigData));
        setVisible(false);
      } else {
        setVisible(false);
        navigate("/login");
      }
    };

    const timeoutId = setTimeout(checkConfigData, 500);

    return () => clearTimeout(timeoutId);
  }, [navigate]);
  const getActions = () => {
    const actions = shortcutDropdownData(t, configDataSpot);
    let index = 0;

    // Assign an index to each action
    return actions.map((group) => ({
      ...group,
      actions: group.actions.map((action) => ({
        ...action,
        index: index++,
        group: group.group,
      })),
    }));
  };
  function logout() {
    dispatch(setInventoryShowDataEmpty());
    localStorage.clear();
    navigate("/login");
  }
  const list = getActions().reduce(
    (acc, group) => [...acc, ...group.actions],
    []
  );

  useHotkeys(
    [
      [
        "alt+k",
        () => {
          open();
        },
      ],
    ],
    []
  );
  useHotkeys(
    [
      [
        "alt+x",
        () => {
          close();
        },
      ],
    ],
    []
  );

  const shortcuts = (
    <Stack spacing="xs">
      {list
        .reduce((groups, item) => {
          const lastGroup = groups[groups.length - 1];
          if (!lastGroup || item.group !== lastGroup.group) {
            groups.push({ group: item.group, items: [item] });
          } else {
            lastGroup.items.push(item);
          }
          return groups;
        }, [])
        .map((groupData, groupIndex) => (
          <Box key={groupIndex}>
            <Text size="sm" fw="bold" c="#828282" pb={"xs"}>
              {groupData.group}
            </Text>

            <SimpleGrid cols={2}>
              {groupData.items.map((action, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={
                    action.id === "inhouse"
                      ? "#"
                      : action.group === "Production" ||
                        action.group === "প্রোডাকশন"
                      ? `production/${action.id}`
                      : action.group === "Core" || action.group === "কেন্দ্র"
                      ? `core/${action.id}`
                      : action.group === "Inventory" ||
                        action.group === "ইনভেন্টরি"
                      ? `inventory/${action.id}`
                      : action.group === "Domain" || action.group === "ডোমেইন"
                      ? `domain/${action.id}`
                      : action.group === "Accounting" ||
                        action.group === "একাউন্টিং"
                      ? `accounting/${action.id}`
                      : action.group === "Procurement"
                      ? `procurement/${action.id}`
                      : action.group === "Sales & Purchase"
                      ? `inventory/${action.id}`
                      : `/sitemap`
                  }
                  onClick={(e) => {
                    navigate(
                      action.group === "Production" ||
                        action.group === "প্রোডাকশন"
                        ? `production/${action.id}`
                        : action.group === "Core" || action.group === "কেন্দ্র"
                        ? `core/${action.id}`
                        : action.group === "Inventory" ||
                          action.group === "ইনভেন্টরি"
                        ? `inventory/${action.id}`
                        : action.group === "Domain" || action.group === "ডোমেইন"
                        ? `domain/${action.id}`
                        : action.group === "Accounting" ||
                          action.group === "একাউন্টিং"
                        ? `accounting/${action.id}`
                        : action.group === "Sales & Purchase"
                        ? `inventory/${action.id}`
                        : `/sitemap`
                    );
                  }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <UnstyledButton className={HeaderStyle.subLink}>
                    <Group
                      wrap="nowrap"
                      align="center"
                      justify="center"
                      gap={4}
                    >
                      <ThemeIcon size={18} variant="transparent" radius="md">
                        <IconCircleCheck
                          style={{ width: rem(14), height: rem(14) }}
                          color={"green"}
                        />
                      </ThemeIcon>
                      <div>
                        <Center>
                          <Text size="sm" fw={500}>
                            {action.label}
                          </Text>
                        </Center>
                        {/* <Text size="xs" c="dimmed">
                          {action.description}
                        </Text> */}
                      </div>
                    </Group>
                  </UnstyledButton>
                </Link>
              ))}
            </SimpleGrid>
          </Box>
        ))}
    </Stack>
  );
  return (
    <>
      <Modal.Root opened={opened} onClose={close} size="64%">
        <Modal.Overlay />
        <Modal.Content p={"xs"}>
          <Modal.Header ml={"xs"}>
            <Modal.Title>
              {configData && configData?.domain
                ? configData.domain?.company_name
                : ""}
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <SpotLightSearchModal onClose={close} configData={configData} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Box bg={"white"} mb={"2"} pos={`relative`}>
        <Grid columns={24} gutter={{ base: 2 }} justify="space-between">
          <Grid.Col span={3}>
            <NavLink
              href="/"
              c={"red"}
              fw={"800"}
              component="button"
              label={
                configData && configData.domain
                  ? configData.domain.company_name
                  : ""
              }
              onClick={(e) => {
                navigate("/");
              }}
            />
          </Grid.Col>
          <Grid.Col span={3} justify="flex-end" align={"center"} mt={"xs"}>
            <HoverCard
              width={400}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
              withArrow
              arrowPosition="center"
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={"xs"} c={"green.8"} fw={"800"}>
                      {t("Shortcut")}
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(16), height: rem(16) }}
                      color={"green"}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between">
                  <Text fw={500} fz={16} c={"red.6"}>
                    {t("Shortcuts")}
                  </Text>
                  {/* <Anchor href="#" fz="xs">
                      View all
                    </Anchor> */}
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={1} spacing={0}>
                  {shortcuts}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between" mt={"xs"}>
                    <div>
                      <Text fw={500} fz="sm">
                        Sitemap
                      </Text>
                      <Text size="xs" c="dimmed">
                        Stiemap Details
                      </Text>
                    </div>
                    <Button
                      bg={"green.6"}
                      size="xs"
                      onClick={() => navigate("/")}
                    >
                      Sitemap
                    </Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
          </Grid.Col>
          <Grid.Col
            span={12}
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Group>
              <Flex
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
                mih={42}
                w={"100%"}
                border={"red"}
              >
                <Button
                  leftSection={
                    <>
                      <IconSearch size={16} c={"red.5"} />
                      <Text fz={`xs`} pl={"xs"} c={"gray.8"}>
                        {t("SearchMenu")}
                      </Text>
                    </>
                  }
                  fullWidth
                  variant="transparent"
                  rightSection={
                    <>
                      <Kbd h={"24"} c={"gray.8"} fz={"12"}>
                        Alt{" "}
                      </Kbd>{" "}
                      +{" "}
                      <Kbd c={"gray.8"} h={"24"} fz={"12"}>
                        {" "}
                        K
                      </Kbd>
                    </>
                  }
                  w={`100%`}
                  justify="space-between"
                  style={{ border: `2px solid var(--mantine-color-red-8)` }}
                  color={`gray`}
                  onClick={open}
                  className="no-focus-outline"
                />
              </Flex>
            </Group>
          </Grid.Col>
          <Grid.Col span={6}>
            <Flex
              gap="sm"
              justify="flex-end"
              direction="row"
              wrap="wrap"
              mih={42}
              align={"right"}
              px={`xs`}
              pr={"24"}
            >
              <Menu
                onOpen={() => setLanguageOpened(true)}
                onClose={() => setLanguageOpened(false)}
                radius="md"
                width="target"
                withinPortal
                withArrow
                arrowPosition="center"
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
                bg={`red.5`}
                withArrow
              >
                <ActionIcon
                  mt={"6"}
                  onClick={toggle}
                  variant="subtle"
                  color={`red.4`}
                >
                  {fullscreen ? (
                    <IconWindowMinimize size={24} />
                  ) : (
                    <IconWindowMaximize size={24} />
                  )}
                </ActionIcon>
              </Tooltip>
              <Tooltip
                label={t("Logout")}
                bg={`red.5`}
                withArrow
                position={"left"}
              >
                <ActionIcon
                  onClick={() => logout()}
                  variant="subtle"
                  mt={"6"}
                  color={`gray.6`}
                >
                  <IconLogout size={24} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                label={isOnline ? t("Online") : t("Offline")}
                bg={isOnline ? "green.5" : "red.5"}
                withArrow
              >
                <ActionIcon
                  mt={"6"}
                  variant="filled"
                  radius="xl"
                  color={isOnline ? "green.5" : "red.5"}
                >
                  {isOnline ? (
                    <IconWifi color={"white"} size={24} />
                  ) : (
                    <IconWifiOff color={"white"} size={24} />
                  )}
                </ActionIcon>
              </Tooltip>
            </Flex>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
}
