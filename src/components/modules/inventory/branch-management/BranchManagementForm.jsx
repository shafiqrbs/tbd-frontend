import {
  Grid,
  Box,
  Title,
  ScrollArea,
  Text,
  Button,
  Flex,
  Stack,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Shortcut from "../../shortcut/Shortcut";
import SwitchForm from "../../../form-builders/SwitchForm";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";

export default function BranchManagementForm() {
  const { t } = useTranslation();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 100;
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const savedData = JSON.parse(localStorage.getItem("branchFormData")) || {
    branches: [
      {
        branch_name: "Branch 1",
        branch_id: 1,
        prices: [
          { id: "1", label: "Price 1", isChecked: true },
          { id: "2", label: "Price 2", isChecked: false },
          { id: "3", label: "Price 3", isChecked: true },
        ],
        settings: [
          { id: "1", label: "Setting 1", isChecked: false },
          { id: "2", label: "Setting 2", isChecked: true },
          { id: "3", label: "Setting 3", isChecked: false },
          { id: "4", label: "Setting 4", isChecked: true },
          { id: "5", label: "Setting 5", isChecked: false },
          { id: "6", label: "Setting 6", isChecked: false },
        ],
      },
      {
        branch_name: "Branch 2",
        branch_id: 2,
        prices: [
          { id: "1", label: "Price 1", isChecked: true },
          { id: "2", label: "Price 2", isChecked: false },
          { id: "3", label: "Price 3", isChecked: true },
        ],
        settings: [
          { id: "1", label: "Setting 1", isChecked: false },
          { id: "2", label: "Setting 2", isChecked: true },
          { id: "3", label: "Setting 3", isChecked: false },
          { id: "4", label: "Setting 4", isChecked: true },
          { id: "5", label: "Setting 5", isChecked: false },
          { id: "6", label: "Setting 6", isChecked: false },
        ],
      },
      {
        branch_name: "Branch 3",
        branch_id: 3,
        prices: [
          { id: "1", label: "Price 1", isChecked: true },
          { id: "2", label: "Price 2", isChecked: false },
          { id: "3", label: "Price 3", isChecked: true },
        ],
        settings: [
          { id: "1", label: "Setting 1", isChecked: false },
          { id: "2", label: "Setting 2", isChecked: true },
          { id: "3", label: "Setting 3", isChecked: false },
          { id: "4", label: "Setting 4", isChecked: true },
          { id: "5", label: "Setting 5", isChecked: false },
          { id: "6", label: "Setting 6", isChecked: false },
        ],
      },
      {
        branch_name: "Branch 4",
        branch_id: 4,
        prices: [
          { id: "1", label: "Price 1", isChecked: true },
          { id: "2", label: "Price 2", isChecked: false },
          { id: "3", label: "Price 3", isChecked: true },
        ],
        settings: [
          { id: "1", label: "Setting 1", isChecked: false },
          { id: "2", label: "Setting 2", isChecked: true },
          { id: "3", label: "Setting 3", isChecked: false },
          { id: "4", label: "Setting 4", isChecked: true },
          { id: "5", label: "Setting 5", isChecked: false },
          { id: "6", label: "Setting 6", isChecked: false },
        ],
      },
      {
        branch_name: "Branch 5",
        branch_id: 5,
        prices: [
          { id: "1", label: "Price 1", isChecked: true },
          { id: "2", label: "Price 2", isChecked: false },
          { id: "3", label: "Price 3", isChecked: true },
        ],
        settings: [
          { id: "1", label: "Setting 1", isChecked: false },
          { id: "2", label: "Setting 2", isChecked: true },
          { id: "3", label: "Setting 3", isChecked: false },
          { id: "4", label: "Setting 4", isChecked: true },
          { id: "5", label: "Setting 5", isChecked: false },
          { id: "6", label: "Setting 6", isChecked: false },
        ],
      },
      {
        branch_name: "Branch 6",
        branch_id: 6,
        prices: [
          { id: "1", label: "Price 1", isChecked: true },
          { id: "2", label: "Price 2", isChecked: false },
          { id: "3", label: "Price 3", isChecked: true },
        ],
        settings: [
          { id: "1", label: "Setting 1", isChecked: false },
          { id: "2", label: "Setting 2", isChecked: true },
          { id: "3", label: "Setting 3", isChecked: false },
          { id: "4", label: "Setting 4", isChecked: true },
          { id: "5", label: "Setting 5", isChecked: false },
          { id: "6", label: "Setting 6", isChecked: false },
        ],
      },
    ],
  };

  const form = useForm({
    initialValues: savedData,
  });
  useEffect(() => {
    localStorage.setItem("branchFormData", JSON.stringify(form.values));
  }, [form.values]);
  const maxSwitchesInBox = Math.max(
    ...form.values.branches.map((branch) =>
      Math.max(branch.prices.length, branch.settings.length)
    )
  );

  const handlePriceSwitch = (branchIndex, priceIndex) => {
    form.setFieldValue(
      `branches.${branchIndex}.prices.${priceIndex}.isChecked`,
      !form.values.branches[branchIndex].prices[priceIndex].isChecked
    );
  };

  const handleSettingSwitch = (branchIndex, settingIndex) => {
    form.setFieldValue(
      `branches.${branchIndex}.settings.${settingIndex}.isChecked`,
      !form.values.branches[branchIndex].settings[settingIndex].isChecked
    );
  };

  const branchScrollRef = useRef(null);
  const priceScrollRef = useRef(null);
  const settingScrollRef = useRef(null);

  useEffect(() => {
    // Synchronize branch scroll position
    const handleBranchScroll = () => {
      const branchScrollTop = branchScrollRef.current.scrollTop;
      priceScrollRef.current.scrollTop = branchScrollTop;
      settingScrollRef.current.scrollTop = branchScrollTop;
    };

    // Synchronize price scroll position
    const handlePriceScroll = () => {
      const priceScrollTop = priceScrollRef.current.scrollTop;
      branchScrollRef.current.scrollTop = priceScrollTop;
      settingScrollRef.current.scrollTop = priceScrollTop;
    };

    // Synchronize setting scroll position
    const handleSettingScroll = () => {
      const settingScrollTop = settingScrollRef.current.scrollTop;
      branchScrollRef.current.scrollTop = settingScrollTop;
      priceScrollRef.current.scrollTop = settingScrollTop;
    };

    // Attach scroll event listeners
    if (branchScrollRef.current) {
      branchScrollRef.current.addEventListener("scroll", handleBranchScroll);
    }

    if (priceScrollRef.current) {
      priceScrollRef.current.addEventListener("scroll", handlePriceScroll);
    }

    if (settingScrollRef.current) {
      settingScrollRef.current.addEventListener("scroll", handleSettingScroll);
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (branchScrollRef.current) {
        branchScrollRef.current.removeEventListener(
          "scroll",
          handleBranchScroll
        );
      }
      if (priceScrollRef.current) {
        priceScrollRef.current.removeEventListener("scroll", handlePriceScroll);
      }
      if (settingScrollRef.current) {
        settingScrollRef.current.removeEventListener(
          "scroll",
          handleSettingScroll
        );
      }
    };
  }, []);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
      })}
    >
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={7}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"8"}
                pb={"10"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid>
                  <Grid.Col>
                    <Title order={6} pt={"4"}>
                      {t("Branches")}
                    </Title>
                  </Grid.Col>
                </Grid>
              </Box>
              <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                <ScrollArea
                  h={height}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                  viewportRef={branchScrollRef}
                >
                  {form.values.branches.map((branch, index) => (
                    <Box
                      key={index}
                      style={{
                        borderBottom: " 1px solid #e9ecef",
                        cursor: "pointer",
                      }}
                    >
                      <Text
                        pt={2}
                        fz={"16"}
                        fw={600}
                        style={{
                          textAlign: "center",
                          height: `${maxSwitchesInBox * 40}px`,
                          lineHeight: `${maxSwitchesInBox * 40}px`,
                        }}
                      >
                        {branch.branch_name}
                      </Text>
                    </Box>
                  ))}
                </ScrollArea>
              </Box>
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={8}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"8"}
                pb={"10"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid>
                  <Grid.Col>
                    <Title order={6} pt={"4"}>
                      {t("Prices")}
                    </Title>
                  </Grid.Col>
                </Grid>
              </Box>
              <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                <ScrollArea
                  h={height}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                  viewportRef={priceScrollRef}
                >
                  {form.values.branches.map((branch, index) => (
                    <Box
                      key={index}
                      p={"xs"}
                      style={{
                        borderBottom: " 1px solid #e9ecef",
                        cursor: "pointer",
                        height: `${maxSwitchesInBox * 40}px`,
                      }}
                    >
                      {branch.prices.map((price, priceIndex) => (
                        <Box key={priceIndex} mt={"xs"}>
                          <Grid gutter={{ base: 1 }}>
                            <Grid.Col span={2}>
                              <SwitchForm
                                tooltip={t(price.label)}
                                label=""
                                form={form}
                                name={`branches.${index}.prices.${priceIndex}.isChecked`}
                                color="red"
                                id={`branch-${index}-price-${price.id}`} // Make `id` unique
                                position={"left"}
                                defaultChecked={price.isChecked}
                                onChange={() =>
                                  handlePriceSwitch(index, priceIndex)
                                }
                              />
                            </Grid.Col>
                            <Grid.Col span={6} fz={"sm"} pt={"1"}>
                              {price.label}
                            </Grid.Col>
                          </Grid>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </ScrollArea>
              </Box>
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={8}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"8"}
                pb={"10"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid>
                  <Grid.Col span={6}>
                    <Title order={6} pt={"4"}>
                      {t("Product")}
                    </Title>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack right align="flex-end" pt={2}>
                      <>
                        {!saveCreateLoading && isOnline && (
                          <Button
                            size="compact-xs"
                            color={`green.8`}
                            type="submit"
                            id="EntityFormSubmit"
                            leftSection={<IconDeviceFloppy size={16} />}
                          >
                            <Flex direction={`column`} gap={0}>
                              <Text fz={12} fw={400}>
                                {t("UpdateAndSave")}
                              </Text>
                            </Flex>
                          </Button>
                        )}
                      </>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Box>
              <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                <ScrollArea
                  h={height}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                  viewportRef={settingScrollRef}
                >
                  {form.values.branches.map((branch, index) => (
                    <Box
                      key={index}
                      p={"xs"}
                      style={{
                        borderBottom: " 1px solid #e9ecef",
                        cursor: "pointer",
                        height: `${maxSwitchesInBox * 40}px`,
                      }}
                    >
                      {branch.settings.map((setting, settingIndex) => (
                        <Box key={settingIndex} mt={"xs"}>
                          <Grid gutter={{ base: 1 }}>
                            <Grid.Col span={2}>
                              <SwitchForm
                                tooltip={t(setting.label)}
                                label=""
                                form={form}
                                name={`branches.${index}.settings.${settingIndex}.isChecked`}
                                color="red"
                                id={`branch-${index}-setting-${setting.id}`} // Make `id` unique
                                position={"left"}
                                defaultChecked={setting.isChecked}
                                onChange={() =>
                                  handleSettingSwitch(index, settingIndex)
                                }
                              />
                            </Grid.Col>
                            <Grid.Col span={6} fz={"sm"} pt={"1"}>
                              {setting.label}
                            </Grid.Col>
                          </Grid>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </ScrollArea>
              </Box>
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={1}>
          <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
            <Shortcut
              //   form={form}
              FormSubmit={"EntityFormSubmit"}
              Name={"name"}
              inputType="select"
            />
          </Box>
        </Grid.Col>
      </Grid>
      <Button
        size="compact-xs"
        color={`green.8`}
        type="submit"
        id="EntityFormSubmit"
        leftSection={<IconDeviceFloppy size={16} />}
        loading={saveCreateLoading}
      >
        <Flex direction={`column`} gap={0}>
          <Text fz={12} fw={400}>
            {t("UpdateAndSave")}
          </Text>
        </Flex>
      </Button>
    </form>
  );
}
