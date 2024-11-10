import {
  Grid,
  Box,
  Title,
  ScrollArea,
  Text,
  Button,
  Flex,
  Stack,
  Affix,
  Checkbox,
  rem,
  Center,
  Overlay,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Shortcut from "../../shortcut/Shortcut";
import SwitchForm from "../../../form-builders/SwitchForm";
import { useForm } from "@mantine/form";
import {
  IconCurrency,
  IconCurrencyDollar,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import InputForm from "../../../form-builders/InputForm";

export default function BranchManagementForm() {
  const { t } = useTranslation();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 26;
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const savedData = JSON.parse(localStorage.getItem("branchFormData")) || {
    branches: [
      {
        branch_name: "Branch 1",
        branch_id: 1,
        prices: [
          { id: "1", label: "Price 1", price: "" },
          { id: "2", label: "Price 2", price: "" },
          { id: "3", label: "Price 3", price: "" },
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
          { id: "1", label: "Price 1", price: "" },
          { id: "2", label: "Price 2", price: "" },
          { id: "3", label: "Price 3", price: "" },
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
          { id: "1", label: "Price 1", price: "" },
          { id: "2", label: "Price 2", price: "" },
          { id: "3", label: "Price 3", price: "" },
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
          { id: "1", label: "Price 1", price: "" },
          { id: "2", label: "Price 2", price: "" },
          { id: "3", label: "Price 3", price: "" },
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
          { id: "1", label: "Price 1", price: "" },
          { id: "2", label: "Price 2", price: "" },
          { id: "3", label: "Price 3", price: "" },
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
          { id: "1", label: "Price 1", price: "" },
          { id: "2", label: "Price 2", price: "" },
          { id: "3", label: "Price 3", price: "" },
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

  // const handlePriceSwitch = (branchIndex, priceIndex) => {
  //   form.setFieldValue(
  //     `branches.${branchIndex}.prices.${priceIndex}.isChecked`,
  //     !form.values.branches[branchIndex].prices[priceIndex].isChecked
  //   );
  // };

  const handleSettingSwitch = (branchIndex, settingIndex) => {
    form.setFieldValue(
      `branches.${branchIndex}.settings.${settingIndex}.isChecked`,
      !form.values.branches[branchIndex].settings[settingIndex].isChecked
    );
  };

  // const branchScrollRef = useRef(null);
  // const priceScrollRef = useRef(null);
  // const settingScrollRef = useRef(null);

  // useEffect(() => {
  //   // Synchronize branch scroll position
  //   const handleBranchScroll = () => {
  //     const branchScrollTop = branchScrollRef.current.scrollTop;
  //     priceScrollRef.current.scrollTop = branchScrollTop;
  //     settingScrollRef.current.scrollTop = branchScrollTop;
  //   };

  //   // Synchronize price scroll position
  //   const handlePriceScroll = () => {
  //     const priceScrollTop = priceScrollRef.current.scrollTop;
  //     branchScrollRef.current.scrollTop = priceScrollTop;
  //     settingScrollRef.current.scrollTop = priceScrollTop;
  //   };

  //   // Synchronize setting scroll position
  //   const handleSettingScroll = () => {
  //     const settingScrollTop = settingScrollRef.current.scrollTop;
  //     branchScrollRef.current.scrollTop = settingScrollTop;
  //     priceScrollRef.current.scrollTop = settingScrollTop;
  //   };

  //   // Attach scroll event listeners
  //   if (branchScrollRef.current) {
  //     branchScrollRef.current.addEventListener("scroll", handleBranchScroll);
  //   }

  //   if (priceScrollRef.current) {
  //     priceScrollRef.current.addEventListener("scroll", handlePriceScroll);
  //   }

  //   if (settingScrollRef.current) {
  //     settingScrollRef.current.addEventListener("scroll", handleSettingScroll);
  //   }

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     if (branchScrollRef.current) {
  //       branchScrollRef.current.removeEventListener(
  //         "scroll",
  //         handleBranchScroll
  //       );
  //     }
  //     if (priceScrollRef.current) {
  //       priceScrollRef.current.removeEventListener("scroll", handlePriceScroll);
  //     }
  //     if (settingScrollRef.current) {
  //       settingScrollRef.current.removeEventListener(
  //         "scroll",
  //         handleSettingScroll
  //       );
  //     }
  //   };
  // }, []);

  const [checkedStates, setCheckedStates] = useState({});

  const handleCheckboxChange = (branch_id, isChecked) => {
    setCheckedStates((prevStates) => ({
      ...prevStates,
      [branch_id]: isChecked,
    }));
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
      })}
    >
      <Grid columns={24} gutter={{ base: 8 }}>
        <Grid.Col span={23}>
          <ScrollArea
            h={height + 1}
            scrollbarSize={2}
            scrollbars="y"
            type="never"
            bg={"white"}
            className="borderRadiusAll"
            pl="xs"
            pr="xs"
            pb="8"
            pt={6}
          >
            <Box
              style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: "white",
                width: "100%",
              }}
              mb={"4"}
            >
              <Grid columns={23} gutter={{ base: 8 }}>
                {/* Branches Header */}
                <Grid.Col span={7}>
                  <Box
                    pl="xs"
                    pr={8}
                    pt="8"
                    pb="10"
                    mb="4"
                    className="boxBackground borderRadiusAll"
                  >
                    <Grid>
                      <Grid.Col>
                        <Title order={6} pt="4">
                          {t("Branches")}
                        </Title>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </Grid.Col>

                {/* Prices Header */}
                <Grid.Col span={8}>
                  <Box
                    pl="xs"
                    pr={8}
                    pt="8"
                    pb="10"
                    mb="4"
                    className="boxBackground borderRadiusAll"
                  >
                    <Grid>
                      <Grid.Col>
                        <Title order={6} pt="4">
                          {t("Prices")}
                        </Title>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </Grid.Col>

                {/* Settings Header */}
                <Grid.Col span={8}>
                  <Box
                    pl="xs"
                    pr={8}
                    pt="8"
                    pb="10"
                    mb="4"
                    className="boxBackground borderRadiusAll"
                  >
                    <Grid>
                      <Grid.Col span={6}>
                        <Title order={6} pt="4">
                          {t("Product")}
                        </Title>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Stack right align="flex-end" pt={2}>
                          {!saveCreateLoading && isOnline && (
                            <Button
                              size="compact-xs"
                              color="green.8"
                              type="submit"
                              id="EntityFormSubmit"
                              leftSection={<IconDeviceFloppy size={16} />}
                            >
                              <Flex direction="column" gap={0}>
                                <Text fz={12} fw={400}>
                                  {t("UpdateAndSave")}
                                </Text>
                              </Flex>
                            </Button>
                          )}
                        </Stack>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </Grid.Col>
              </Grid>
            </Box>

            {/* Branches Content */}
            <Grid columns={23} gutter={{ base: 8 }}>
              {form.values.branches.map((branch, index) => (
                <React.Fragment key={`branch-container-${branch.branch_id}`}>
                  {/* Branches Column */}
                  <Grid.Col span={7}>
                    <Box bg="white" className="borderRadiusAll">
                      <Grid
                        justify="center"
                        align="center"
                        columns={12}
                        gutter={{ base: 8 }}
                      >
                        <Grid.Col span={5}>
                          <Flex
                            mih={`${maxSwitchesInBox * 40.4}px`}
                            gap="md"
                            justify="flex-end"
                            align="center"
                            direction="row"
                            wrap="wrap"
                          >
                            <Checkbox
                              pr="xs"
                              checked={!!checkedStates[branch.branch_id]}
                              color="red"
                              form={form}
                              onChange={(event) =>
                                handleCheckboxChange(
                                  branch.branch_id,
                                  event.currentTarget.checked
                                )
                              }
                              styles={(theme) => ({
                                input: {
                                  borderColor: "red",
                                },
                              })}
                            />
                          </Flex>
                        </Grid.Col>
                        <Grid.Col span={7}>
                          <Flex
                            mih={`${maxSwitchesInBox * 40.4}px`}
                            gap="md"
                            justify="flex-start"
                            align="center"
                            direction="row"
                            wrap="wrap"
                          >
                            <Text fz="16" fw={600} pt="3">
                              {branch.branch_name}
                            </Text>
                          </Flex>
                        </Grid.Col>
                      </Grid>
                    </Box>
                  </Grid.Col>

                  {/* Prices Column */}
                  <Grid.Col span={8} key={`branch-${index}-prices`}>
                    <Box bg="white" className="">
                      <Box className="borderRadiusAll">
                        <ScrollArea
                          pb={"xs"}
                          pt={"xs"}
                          h={`${maxSwitchesInBox * 40}px`}
                          scrollbarSize={2}
                          scrollbars="y"
                          type="never"
                          // viewportRef={priceScrollRef}
                        >
                          {!checkedStates[branch.branch_id] && (
                            <Overlay
                              color="#ffe3e3"
                              backgroundOpacity={0.8}
                              zIndex={1}
                              // blur={10}
                            />
                          )}
                          {branch.prices.map((price, priceIndex) => {
                            const currentFieldId = `branches.${index}.prices.${priceIndex}.price`;
                            const nextFieldId =
                              priceIndex < branch.prices.length - 1
                                ? `branches.${index}.prices.${
                                    priceIndex + 1
                                  }.price`
                                : `branch-${index}-setting-${branch.settings[0]?.id}`;
                            return (
                              <Box key={`price-${price.id}`}>
                                <Box key={priceIndex} p="xs">
                                  <Grid columns={12} gutter={{ base: 8 }}>
                                    <Grid.Col span={4}>
                                      <Text
                                        fw={600}
                                        fz={"sm"}
                                        mt={"8"}
                                        ta={"left"}
                                        pl={"xs"}
                                      >
                                        {price.label}
                                      </Text>
                                    </Grid.Col>
                                    <Grid.Col span={8}>
                                      <Box pr={"xs"}>
                                        <InputForm
                                          tooltip={price.label}
                                          label=""
                                          placeholder={price.label}
                                          nextField={nextFieldId}
                                          form={form}
                                          name={currentFieldId}
                                          id={currentFieldId}
                                          leftSection={
                                            <IconCurrencyDollar
                                              size={16}
                                              opacity={0.5}
                                            />
                                          }
                                          rightIcon={""}
                                        />
                                      </Box>
                                    </Grid.Col>
                                  </Grid>
                                </Box>
                              </Box>
                            );
                          })}
                        </ScrollArea>
                      </Box>
                    </Box>
                  </Grid.Col>

                  {/* Settings Column */}
                  <Grid.Col span={8} key={`branch-${index}-settings`}>
                    <Box bg="white" p="" className="">
                      <Box  className="borderRadiusAll">
                        <ScrollArea
                          pb={"xs"}
                          pt={"xs"}
                          h={`${maxSwitchesInBox * 40}px`}
                          scrollbarSize={2}
                          scrollbars="y"
                          type="never"
                          // viewportRef={settingScrollRef}
                        >
                          {!checkedStates[branch.branch_id] && (
                            <Overlay
                              color="#ffe3e3"
                              backgroundOpacity={0.8}
                              zIndex={1}
                              // blur={10}
                            />
                          )}
                          {branch.settings.map((setting, settingIndex) => (
                            <Box key={settingIndex} p="xs">
                              <Grid gutter={{ base: 1 }} pl="xs" pr="xs">
                                <Grid.Col span={2}>
                                  <SwitchForm
                                    tooltip={t(setting.label)}
                                    label=""
                                    form={form}
                                    name={`branches.${index}.settings.${settingIndex}.isChecked`}
                                    color="red"
                                    id={`branch-${index}-setting-${setting.id}`}
                                    nextField={
                                      branch.settings[settingIndex + 1]
                                        ? `branch-${index}-setting-${
                                            branch.settings[settingIndex + 1].id
                                          }`
                                        : "EntityFormSubmit"
                                    }
                                    position="left"
                                    defaultChecked={setting.isChecked}
                                    onChange={() =>
                                      handleSettingSwitch(index, settingIndex)
                                    }
                                  />
                                </Grid.Col>
                                <Grid.Col span={6} fz="sm" pt="1">
                                  {setting.label}
                                </Grid.Col>
                              </Grid>
                            </Box>
                          ))}
                        </ScrollArea>
                      </Box>
                    </Box>
                  </Grid.Col>
                </React.Fragment>
              ))}
            </Grid>
          </ScrollArea>
        </Grid.Col>

        <Grid.Col span={1}>
          <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
            <Shortcut
              FormSubmit={"EntityFormSubmit"}
              Name={"name"}
              inputType="select"
            />
          </Box>
        </Grid.Col>
      </Grid>
    </form>
  );
}
