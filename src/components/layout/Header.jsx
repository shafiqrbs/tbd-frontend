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
  IconCircleCheck,
  IconChevronDown,
  IconLogout,
  IconSearch,
  IconWindowMaximize,
  IconWindowMinimize,
  IconWifiOff,
  IconWifi,
  IconEdit,
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
import logo_default from "../../assets/images/logo_default.png";
import ImageUploadDropzone from "../form-builders/ImageUploadDropzone";

const languages = [
  { label: "EN", value: "en", flag: flagGB },
  { label: "BN", value: "bn", flag: flagBD },
];

export default function Header({ isOnline, configData }) {
  // console.log(configData);

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
      <Box bg={"#905a23"} mb={"2"} pos={`relative`}>
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
                  className={"tooltipSecondaryBg"}
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
                      backgroundColor: "#905a23",
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
                {configData?.domain && loginUser.user_group === "domain" && (
                  <Tooltip
                    label={t("UpdateYourLogoAndOtherConfigs")}
                    bg={`green`}
                    position="right"
                    withArrow
                    className={"tooltipSecondaryBg"}
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
                )}
                {/* <Text ml={4}>{configData.domain.company_name}</Text> */}
              </div>
            ) : (
              <NavLink
                component="button"
                bg={"transparent"}
                style={{
                  backgroundColor: "#905a23",
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
                onClick={open}
                className="no-focus-outline"
              />
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
                      <Box component="span" mr={"xs"} c={"white"} fw={"500"}>
                        {t("Shortcut")}
                      </Box>
                      <IconChevronDown
                        style={{ width: rem(16), height: rem(16) }}
                        color={"white"}
                      />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                  <Group justify="space-between">
                    <Text fw={500} fz={16}>
                      {configData && configData.domain
                        ? configData.domain.company_name
                        : ""}
                    </Text>
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
                </HoverCard.Dropdown>
              </HoverCard>
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
