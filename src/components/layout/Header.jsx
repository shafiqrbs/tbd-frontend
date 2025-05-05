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
  ScrollArea,
  TextInput,
  CloseButton,
} from "@mantine/core";

import { useDisclosure, useFullscreen, useHotkeys } from "@mantine/hooks";
import {
  IconCircleCheck,
  IconChevronDown,
  IconLogout,
  IconSearch,
  IconWindowMaximize,
  IconWindowMinimize,
  IconWifiOff,
  IconWifi,
  IconEdit,
  IconX,
  IconXboxX,
  IconArrowRight,
} from "@tabler/icons-react";
import { Link, useOutletContext } from "react-router-dom";
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
import logo_default from "../../assets/images/logo_default.png";
import ImageUploadDropzone from "../form-builders/ImageUploadDropzone";

const languages = [
  { label: "EN", value: "en", flag: flagGB },
  { label: "BN", value: "bn", flag: flagBD },
];

export default function Header({ isOnline, configData, mainAreaHeight }) {
  // console.log(configData);
  const [userRole, setUserRole] = useState(() => {
    const userRoleData = localStorage.getItem("user");
    if (!userRoleData) return [];

    try {
      const parsedUser = JSON.parse(userRoleData);

      if (!parsedUser.access_control_role) return [];

      if (Array.isArray(parsedUser.access_control_role)) {
        return parsedUser.access_control_role;
      }

      if (typeof parsedUser.access_control_role === "string") {
        try {
          if (parsedUser.access_control_role.trim() === "") return [];
          return JSON.parse(parsedUser.access_control_role);
        } catch (parseError) {
          console.error("Error parsing access_control_role:", parseError);
          return [];
        }
      }

      return [];
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return [];
    }
  });
  const [opened, { open, close }] = useDisclosure(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useMantineTheme();
  const height = mainAreaHeight - 140;
  const { toggle, fullscreen } = useFullscreen();
  const [languageOpened, setLanguageOpened] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(
    languages.find((item) => item.value === i18n.language)
  );
  const [visible, setVisible] = useState(true);

  const [configDataSpot, setConfigData] = useState(null);
  const loginUser = JSON.parse(localStorage.getItem("user"));
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

  useHotkeys(
    [
      [
        "alt+k",
        () => {
          setShortcutModalOpen(true);
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

  useHotkeys(
    [
      [
        "alt+l",
        () => {
          logout();
        },
      ],
    ],
    []
  );
  const [shortcutModalOpen, setShortcutModalOpen] = useState(false);
  const [value, setValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const filterList = (searchValue) => {
    const updatedList = getActions().reduce((acc, group) => {
      // Only include actions from groups the user has access to
      if (hasAccessToGroup(group.group)) {
        const filteredActions = group.actions.filter((action) =>
          action.label.toLowerCase().includes(searchValue.toLowerCase())
        );
        return [...acc, ...filteredActions];
      }
      return acc;
    }, []);

    setFilteredItems(updatedList);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setValue("");
    const allActions = getActions().reduce(
      (acc, group) => [...acc, ...group.actions],
      []
    );
    setFilteredItems(allActions);
    setSelectedIndex(0);
  };

  useHotkeys([["alt+c", clearSearch]], []);

  const handleKeyDown = (event) => {
    if (filteredItems.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex <= 0 ? filteredItems.length - 1 : prevIndex - 1
      );
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      const selectedAction = filteredItems[selectedIndex];
      if (selectedAction) {
        const path =
          (selectedAction.group === "Domain" &&
            selectedAction.id === "dashboard") ||
          (selectedAction.group === "ডোমেইন" &&
            selectedAction.id === "dashboard")
            ? `b2b/${selectedAction.id}`
            : selectedAction.group === "Production" ||
              selectedAction.group === "প্রোডাকশন"
            ? `production/${selectedAction.id}`
            : selectedAction.group === "Core" ||
              selectedAction.group === "কেন্দ্র"
            ? `core/${selectedAction.id}`
            : selectedAction.group === "Inventory" ||
              selectedAction.group === "ইনভেন্টরি"
            ? `inventory/${selectedAction.id}`
            : selectedAction.group === "Domain" ||
              selectedAction.group === "ডোমেইন"
            ? `domain/${selectedAction.id}`
            : selectedAction.group === "Accounting" ||
              selectedAction.group === "একাউন্টিং"
            ? `accounting/${selectedAction.id}`
            : selectedAction.group === "Procurement"
            ? `procurement/${selectedAction.id}`
            : selectedAction.group === "Sales & Purchase"
            ? `inventory/${selectedAction.id}`
            : `/sitemap`;

        navigate(path);
        setShortcutModalOpen(false);
      }
    }
  };
  useEffect(() => {
    if (selectedIndex >= 0 && filteredItems.length > 0) {
      const selectedElement = document.getElementById(
        `item-${filteredItems[selectedIndex].index}`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [selectedIndex, filteredItems]);
  useEffect(() => {
    const allActions = getActions().reduce(
      (acc, group) => [...acc, ...group.actions],
      []
    );
    setFilteredItems(allActions);
  }, [shortcutModalOpen === true]);
  const hasAccessToGroup = (group) => {
    if (userRole.includes("role_domain")) return true;

    switch (group) {
      case "Production":
      case "প্রোডাকশন":
        return userRole.includes("role_production");
      case "Core":
      case "কেন্দ্র":
        return userRole.includes("role_core");
      case "Inventory":
      case "ইনভেন্টরি":
        return userRole.includes("role_inventory");
      case "Domain":
      case "ডোমেইন":
        return userRole.includes("role_domain");
      case "Accounting":
      case "একাউন্টিং":
        return userRole.includes("role_accounting");
      case "Procurement":
        return userRole.includes("role_procurement");
      case "Sales & Purchase":
        return userRole.includes("role_sales_purchase");
      default:
        return false;
    }
  };
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
      <Box bg={"#C6AF9D"} mb={"2"} pos={`relative`}>
        <Grid columns={24} gutter={{ base: 2 }} justify="space-between">
          <Grid.Col span={3}>
            {configData?.path ? (
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  paddingLeft: 16,
                }}
              >
                <Tooltip
                  label={
                    configData && configData.domain
                      ? configData.domain.company_name
                      : ""
                  }
                  color={'#C6AF9D'}
                  position="right"
                  withArrow
                >
                  <Anchor
                    target="_blank"
                    underline="never"
                    onClick={() => {
                      navigate("/");
                    }}
                    style={{
                      backgroundColor: "#C6AF9D",
                      color: "white",
                      fontWeight: 800,
                      transition: "background 1s",
                    }}
                  >
                    <Image
                      mah={40}
                      radius="md"
                      src={
                        import.meta.env.VITE_IMAGE_GATEWAY_URL +
                        "/uploads/inventory/logo/" +
                        configData.path
                      }
                      fallbackSrc={logo_default}
                      pl={6}
                    ></Image>
                  </Anchor>
                </Tooltip>
                {/*{configData?.domain && loginUser.user_group === "domain" && (
                  <Tooltip
                    label={t("UpdateYourLogoAndOtherConfigs")}
                    bg={'#905a23'}
                    position="right"
                    withArrow
                  >
                    <ActionIcon
                      c={"grey"}
                      bg={"transparent"}
                      pl={"xs"}
                      onClick={() => {
                        navigate(`/domain/config/${configData?.domain?.id}`);
                      }}
                      onAuxClick={(e) => {
                        navigate(`/domain/config/${configData?.domain?.id}`);
                      }}
                    >
                      <IconEdit style={{ width: rem(18), height: rem(18) }} />
                    </ActionIcon>
                  </Tooltip>
                )}*/}
                {/* <Text ml={4}>{configData.domain.company_name}</Text> */}
              </div>
            ) : (
              <NavLink
                component="button"
                bg={"transparent"}
                style={{
                  backgroundColor: "#C6AF9D",
                  color: "white",
                  fontWeight: 800,
                  transition: "background 1s",
                }}
                label={
                  configData && configData.domain
                    ? configData.domain.company_name
                    : ""
                }
                onClick={() => {
                  navigate("/");
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#dee2e6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "white";
                }}
              />
            )}
          </Grid.Col>
          <Grid.Col
            span={3}
            justify="flex-end"
            align={"flex-start"}
            mt={"xs"}
          ></Grid.Col>
          <Grid.Col
            span={12}
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Group gap={"md"} wrap="nowrap" mih={42}>
              <Button
                leftSection={
                  <>
                    <IconSearch size={16} c={"white"} />
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
                style={{ border: "1px solid #49362366" }}
                color={"black"}
                bg={"white"}
                onClick={() => setShortcutModalOpen(true)}
                className="no-focus-outline"
              />
              {/* <Box onClick={() => setShortcutModalOpen(true)}>
                <Center inline>
                  <Box component="span" mr={"xs"} c={"white"} fw={"500"}>
                    {t("Shortcut")}
                  </Box>
                  <IconChevronDown
                    style={{ width: rem(16), height: rem(16) }}
                    color={"white"}
                  />
                </Center>
              </Box> */}
              <Modal
                opened={shortcutModalOpen}
                onClose={() => setShortcutModalOpen(false)}
                centered
                size="25%"
                padding="md"
                radius="md"
                styles={{
                  title: {
                    width: "100%",
                    margin: 0,
                    padding: 0,
                  },
                }}
                overlayProps={{
                  backgroundOpacity: 0.7,
                  blur: 3,
                }}
                title={
                  <Grid columns={12} gutter={{ base: 6 }}>
                    <Grid.Col span={2}>
                      <Text fw={500} fz={16} pt={"6"}>
                        {configData && configData.domain
                          ? configData.domain.company_name
                          : ""}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <TextInput
                        w={"100%"}
                        align={"center"}
                        pr={"lg"}
                        justify="space-between"
                        data-autofocus
                        leftSection={<IconSearch size={16} c={"red"} />}
                        placeholder={t("SearchMenu")}
                        value={value}
                        rightSectionPointerEvents="all"
                        rightSection={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {value ? (
                              <>
                                <CloseButton
                                  ml={"-50"}
                                  mr={"xl"}
                                  icon={
                                    <IconX
                                      style={{ width: rem(20) }}
                                      stroke={2.0}
                                    />
                                  }
                                  aria-label="Clear input"
                                  onClick={clearSearch}
                                />
                                <Kbd ml={"-xl"} h={"24"} c={"gray.8"} fz={"12"}>
                                  Alt
                                </Kbd>{" "}
                                +{" "}
                                <Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"lg"}>
                                  C
                                </Kbd>
                              </>
                            ) : (
                              <>
                                <CloseButton
                                  ml={"-50"}
                                  mr={"lg"}
                                  icon={
                                    <IconXboxX
                                      style={{ width: rem(20) }}
                                      stroke={2.0}
                                    />
                                  }
                                  aria-label="Close"
                                  onClick={() => setShortcutModalOpen(false)}
                                />
                                <Kbd ml={"-lg"} h={"24"} c={"gray.8"} fz={"12"}>
                                  Alt{" "}
                                </Kbd>{" "}
                                +{" "}
                                <Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"xl"}>
                                  X
                                </Kbd>
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
                    </Grid.Col>
                  </Grid>
                }
                transitionProps={{ transition: "fade", duration: 200 }}
              >
                <ScrollArea scrollbarSize={4} scrollbars="y" h={height}>
                  <Divider my="sm" mt={0} />
                  {filteredItems.length > 0 ? (
                    <Stack spacing="xs">
                      {filteredItems
                        .reduce((groups, item) => {
                          const existingGroup = groups.find(
                            (g) => g.group === item.group
                          );
                          if (existingGroup) {
                            existingGroup.items.push(item);
                          } else {
                            groups.push({ group: item.group, items: [item] });
                          }
                          return groups;
                        }, [])
                        .map((groupData, groupIndex) => (
                          <Box key={groupIndex}>
                            <Text size="sm" fw="bold" c="#828282" pb={"xs"}>
                              {groupData.group}
                            </Text>

                            <SimpleGrid cols={1}>
                              {groupData.items.map((action, itemIndex) => {
                                const isSelected =
                                  filteredItems.indexOf(action) ===
                                  selectedIndex;

                                return (
                                  <Link
                                    className={`
                                    ${
                                      filteredItems.indexOf(action) ===
                                      selectedIndex
                                        ? "highlightedItem"
                                        : ""
                                    }
                                    ${
                                      hoveredIndex === action.index
                                        ? "hoveredItem"
                                        : ""
                                    }
                                `}
                                    style={{
                                      cursor: "pointer",
                                      padding: "6px",
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                    key={itemIndex}
                                    to={
                                      action.id === "inhouse"
                                        ? "#"
                                        : action.group === "Production" ||
                                          action.group === "প্রোডাকশন"
                                        ? `production/${action.id}`
                                        : action.group === "Core" ||
                                          action.group === "কেন্দ্র"
                                        ? `core/${action.id}`
                                        : action.group === "Inventory" ||
                                          action.group === "ইনভেন্টরি"
                                        ? `inventory/${action.id}`
                                        : action.group === "Domain" ||
                                          action.group === "ডোমেইন"
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
                                      setShortcutModalOpen(false);
                                      navigate(
                                        action.group === "Production" ||
                                          action.group === "প্রোডাকশন"
                                          ? `production/${action.id}`
                                          : action.group === "Core" ||
                                            action.group === "কেন্দ্র"
                                          ? `core/${action.id}`
                                          : action.group === "Inventory" ||
                                            action.group === "ইনভেন্টরি"
                                          ? `inventory/${action.id}`
                                          : action.group === "Domain" ||
                                            action.group === "ডোমেইন"
                                          ? `domain/${action.id}`
                                          : action.group === "Accounting" ||
                                            action.group === "একাউন্টিং"
                                          ? `accounting/${action.id}`
                                          : action.group === "Sales & Purchase"
                                          ? `inventory/${action.id}`
                                          : `/sitemap`
                                      );
                                    }}
                                    onMouseEnter={() => {
                                      setHoveredIndex(action.index);
                                      setSelectedIndex(-1);
                                    }}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                  >
                                    <UnstyledButton
                                      mt={"4"}
                                      className={HeaderStyle.subLink}
                                      bg={isSelected ? "gray.2" : undefined}
                                    >
                                      <Group
                                        wrap="nowrap"
                                        align="center"
                                        justify="center"
                                        gap={4}
                                      >
                                        <ThemeIcon
                                          size={18}
                                          variant="transparent"
                                          radius="md"
                                        >
                                          <IconArrowRight
                                            style={{
                                              width:
                                                hoveredIndex === action.index
                                                  ? rem(24)
                                                  : rem(14),
                                              height:
                                                hoveredIndex === action.index
                                                  ? rem(24)
                                                  : rem(14),
                                            }}
                                            color={
                                              hoveredIndex === action.index
                                                ? "red"
                                                : "green"
                                            }
                                          />
                                        </ThemeIcon>
                                        <div>
                                          <Center>
                                            <Text
                                              size="sm"
                                              fw={500}
                                              className={`${
                                                hoveredIndex === action.index
                                                  ? classes.hoveredText
                                                  : ""
                                              }`}
                                            >
                                              {action.label}
                                            </Text>
                                          </Center>
                                        </div>
                                      </Group>
                                    </UnstyledButton>
                                  </Link>
                                );
                              })}
                            </SimpleGrid>
                          </Box>
                        ))}
                    </Stack>
                  ) : (
                    <Text align="center" mt="md" c="dimmed">
                      {t("NoResultsFound")}
                    </Text>
                  )}
                </ScrollArea>
                <div className={classes.dropdownFooter}>
                  <Group justify="space-between" mt={"xs"}>
                    <div>
                      <Text fw={500} fz="sm">
                        Sitemap
                      </Text>
                      <Text size="xs" c="dimmed">
                        Sitemap Details
                      </Text>
                    </div>
                    <Button
                      className={"btnPrimaryBg"}
                      size="xs"
                      onClick={() => navigate("/")}
                    >
                      Sitemap
                    </Button>
                  </Group>
                </div>
              </Modal>
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
              px={"xs"}
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
                    bg={"red"}
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
                bg={"#635031"}
                withArrow
              >
                <ActionIcon
                  mt={"6"}
                  onClick={toggle}
                  variant="subtle"
                  color={"white"}
                >
                  {fullscreen ? (
                    <IconWindowMinimize size={24} />
                  ) : (
                    <IconWindowMaximize size={24} />
                  )}
                </ActionIcon>
              </Tooltip>
              <Tooltip
                label={
                  <>
                    <Stack spacing={0} gap={0}>
                      <Text align="center">
                        {loginUser?.name} ( {loginUser?.username} )
                      </Text>
                      <Text align="center">{t("LogoutAltL")}</Text>
                    </Stack>
                  </>
                }
                bg={"#635031"}
                withArrow
                position={"left"}
                multiline
              >
                <ActionIcon
                  onClick={() => logout()}
                  variant="subtle"
                  mt={"6"}
                  color={"white"}
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
