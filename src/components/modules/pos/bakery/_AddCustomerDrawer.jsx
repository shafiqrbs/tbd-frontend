import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  ActionIcon, 
  Box, 
  ScrollArea, 
  Drawer, 
  Text, 
  Flex,
  Grid,
  Title,
  Button,
  Group,
  Stack,
  rem
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { 
  IconX, 
  IconDeviceFloppy,
  IconCheck
} from "@tabler/icons-react";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import InputForm from "../../../form-builders/InputForm";

function _AddCustomerDrawer(props) {
  const {
    customerDrawer,
    setCustomerDrawer,
    setRefreshCustomerDropdown,
    focusField,
    fieldPrefix,
  } = props;
  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t, i18n } = useTranslation();
  const height = mainAreaHeight; //TabList height 104
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const closeModel = () => {
    setCustomerDrawer(false);
  };

  useEffect(() => {
          saveId !== 'EntityFormSubmit' && effectRan.current && (
              setTimeout(() => {
                  document.getElementById('setting_type').click()
              }, 100),
              effectRan.current = false
          )
      })

  const settingsForm = useForm({
          initialValues: {
              setting_type_id: '', name: '', status: true
          },
          validate: {
              setting_type_id: isNotEmpty(),
              name: hasLength({ min: 2, max: 20 }),
          }
      });

  return (
    <>
      <Drawer.Root
        opened={customerDrawer}
        position="right"
        onClose={closeModel}
        size={"30%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <ScrollArea
            h={height + 100}
            scrollbarSize={2}
            type="never"
            bg={"gray.1"}
          >
            <Flex
              mih={40}
              gap="md"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <ActionIcon
                mr={"sm"}
                radius="xl"
                color="red.6"
                size="md"
                onClick={closeModel}
              >
                <IconX style={{ width: "100%", height: "100%" }} stroke={1.5} />
              </ActionIcon>
            </Flex>

            <Box ml={2} mr={2} mb={0}>
              <form
                onSubmit={settingsForm.onSubmit((values) => {
                  modals.openConfirmModal({
                    title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
                    children: (
                      <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                    ),
                    labels: { confirm: t("Submit"), cancel: t("Cancel") },
                    confirmProps: { color: "red" },
                    onCancel: () => console.log("Cancel"),
                    onConfirm: () => {
                      setSaveCreateLoading(true);
                      const value = {
                        url: "core/setting",
                        data: settingsForm.values,
                      };
                      dispatch(storeEntityData(value));

                      notifications.show({
                        color: "teal",
                        title: t("CreateSuccessfully"),
                        icon: (
                          <IconCheck
                            style={{ width: rem(18), height: rem(18) }}
                          />
                        ),
                        loading: false,
                        autoClose: 700,
                        style: { backgroundColor: "lightgray" },
                      });

                      setTimeout(() => {
                        settingsForm.reset();
                        setSettingTypeData(null);
                        setSaveCreateLoading(false);
                        saveId === "EntityDrawerSubmit" &&
                          setGroupDrawer(false);
                        saveId === "EntityFormSubmit" &&
                          dispatch(setFetching(true));
                        saveId === "EntityDrawerSubmit" &&
                          dispatch(setDropdownLoad(true));
                      }, 700);
                    },
                  });
                })}
              >
                <Box mb={0}>
                  <Grid columns={9} gutter={{ base: 6 }}>
                    <Grid.Col span={saveId === "EntityFormSubmit" ? 8 : 9}>
                      <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                        <Box bg={"white"}>
                          <Box
                            pl={`xs`}
                            pr={8}
                            pt={saveId === "EntityFormSubmit" ? 6 : 4}
                            pb={"6"}
                            mb={"4"}
                            className={"boxBackground borderRadiusAll"}
                          >
                            <Grid>
                              <Grid.Col span={8}>
                                <Title order={6} pt={"6"}>
                                  {t("CreateSetting")}
                                </Title>
                              </Grid.Col>
                              <Grid.Col span={4}>
                                {saveId === "EntityFormSubmit" && (
                                  <Stack right align="flex-end">
                                    <>
                                      {!saveCreateLoading && isOnline && (
                                        <Button
                                          size="xs"
                                          color={`green.8`}
                                          type="submit"
                                          id={saveId}
                                          leftSection={
                                            <IconDeviceFloppy size={16} />
                                          }
                                        >
                                          <Flex direction={`column`} gap={0}>
                                            <Text fz={14} fw={400}>
                                              {t("CreateAndSave")}
                                            </Text>
                                          </Flex>
                                        </Button>
                                      )}
                                    </>
                                  </Stack>
                                )}
                              </Grid.Col>
                            </Grid>
                          </Box>
                          <Box
                            pl={`xs`}
                            pr={"xs"}
                            className={"borderRadiusAll"}
                          >
                            <ScrollArea
                              h={
                                saveId === "EntityFormSubmit"
                                  ? height
                                  : height + 18
                              }
                              scrollbars="y"
                              type="never"
                            >
                              <Box mt={"xs"}>
                                <InputForm
                                  tooltip={t("SettingName")}
                                  label={t("SettingName")}
                                  placeholder={t("SettingName")}
                                  required={true}
                                  nextField={"status"}
                                  form={settingsForm}
                                  name={"name"}
                                  id={"setting_name"}
                                />
                              </Box>
                              <Box mt={"xs"}>
                                <Grid gutter={{ base: 1 }}>
                                  <Grid.Col span={2}>
                                    
                                  </Grid.Col>
                                  <Grid.Col span={6} fz={"sm"} pt={"1"}>
                                    {t("Status")}
                                  </Grid.Col>
                                </Grid>
                              </Box>
                            </ScrollArea>
                          </Box>
                          {saveId === "EntityDrawerSubmit" && (
                            <>
                              <Box
                                pl={`xs`}
                                pr={8}
                                pt={"6"}
                                pb={"6"}
                                mb={"2"}
                                mt={4}
                                className={"boxBackground borderRadiusAll"}
                              >
                                <Group justify="space-between">
                                  <Flex
                                    gap="md"
                                    justify="center"
                                    align="center"
                                    direction="row"
                                    wrap="wrap"
                                  >
                                    <ActionIcon
                                      variant="transparent"
                                      size="sm"
                                      color="red.6"
                                      onClick={closeModel}
                                      ml={"4"}
                                    >
                                      <IconX
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                        }}
                                        stroke={1.5}
                                      />
                                    </ActionIcon>
                                  </Flex>

                                  <Group gap={8}>
                                    <Stack align="flex-start">
                                      <>
                                        {!saveCreateLoading && isOnline && (
                                          <Button
                                            size="xs"
                                            color={`green.8`}
                                            type="submit"
                                            id={saveId}
                                            leftSection={
                                              <IconDeviceFloppy size={16} />
                                            }
                                          >
                                            <Flex direction={`column`} gap={0}>
                                              <Text fz={14} fw={400}>
                                                {t("CreateAndSave")}
                                              </Text>
                                            </Flex>
                                          </Button>
                                        )}
                                      </>
                                    </Stack>
                                  </Group>
                                </Group>
                              </Box>
                            </>
                          )}
                        </Box>
                      </Box>
                    </Grid.Col>
                  </Grid>
                </Box>
              </form>
            </Box>
          </ScrollArea>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default _AddCustomerDrawer;
