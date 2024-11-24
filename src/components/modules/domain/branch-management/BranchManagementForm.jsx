import {
  Grid,
  Box,
  Title,
  ScrollArea,
  Text,
  Flex,
  Checkbox,
  Overlay, LoadingOverlay, Group, Tooltip,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Shortcut from "../../shortcut/Shortcut.jsx";
import { useForm } from "@mantine/form";
import {
  IconCurrencyDollar,
} from "@tabler/icons-react";
import InputForm from "../../../form-builders/InputForm.jsx";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";
import {useDispatch, useSelector} from "react-redux";

export default function BranchManagementForm() {
  const { t } = useTranslation();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight - 26;
  const dispatch = useDispatch();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const configData = localStorage.getItem('config-data') ? JSON.parse(localStorage.getItem('config-data')) : [];

  // Assuming entityEditData.modules is expected to be a valid JSON array of strings like ["module1", "module2"]
  /*const [moduleChecked, setModuleChecked] = useState(
      Array.isArray(indexEntityData?.category) ? entityEditData.modules : JSON.parse(entityEditData?.modules || '[]')
  );*/

  const [moduleChecked, setModuleChecked] = useState([]);

  // Select data, error, and fetching state from Redux
  const indexEntityData = useSelector((state) => state.crudSlice.indexEntityData);
  // const error = useSelector((state) => state.crudSlice.error);
  const fetching = useSelector((state) => state.crudSlice.fetching);

  // Safely handle the case where indexEntityData or indexEntityData.data is undefined
  const domainsData = indexEntityData?.data
      ? indexEntityData.data.filter(item => item.id !== configData.domain_id)
      : []; // Provide an empty array as a fallback

  useEffect(() => {
    const value = {
      url: 'domain/manage/branch',
      param: {
        term: null,
        page: null,
        offset: null,
      },
    };
    dispatch(getIndexEntityData(value)); // Dispatch thunk on mount
  }, [dispatch]);

  const form = useForm({
    initialValues: [],
  });

  const maxSwitchesInBox = Math.max(
      ...domainsData.map((domain) =>
          Math.max(domain.prices.length, 5)
      )
  );

  const [checkedStates, setCheckedStates] = useState({});

  const handleCheckboxChange = (branch_id, isChecked) => {
    setCheckedStates((prevStates) => ({
      ...prevStates,
      [branch_id]: isChecked,
    }));
    console.log(branch_id,isChecked)
  };

  return (
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
            <LoadingOverlay visible={fetching} zIndex={1000} overlayProps={{ radius: "sm", blur: .5, color:"grape" }} />

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
                          {t("CategoryForProduct")}
                        </Title>
                      </Grid.Col>
                    </Grid>
                  </Box>
                </Grid.Col>
              </Grid>
            </Box>

            {/* Branches Content */}
            <Grid columns={23} gutter={{ base: 8 }}>
              {domainsData.map((branch, index) => (
                <React.Fragment key={`branch-container-${branch.id}`}>
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
                              checked={!!checkedStates[branch.id]}
                              color="red"
                              form={form}
                              onChange={(event) =>
                                handleCheckboxChange(
                                  branch.id,
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
                              {branch.name}
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
                          {!checkedStates[branch.id] && (
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
                                : `branch-${index}-setting-${branch.categories[0]?.id}`;
                            return (
                              <Box key={`price-${priceIndex}-${index}`}>
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
                        >
                          {!checkedStates[branch.id] && (
                            <Overlay
                              color="#ffe3e3"
                              backgroundOpacity={0.8}
                              zIndex={1}
                            />
                          )}

                          <Checkbox.Group
                              label={''}
                              description={''}
                              value={moduleChecked || []}
                              onChange={setModuleChecked}
                          >
                            <Group mt="xs" spacing="md" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                              {branch.categories.map((category, categoryIndex) => (
                                  <Tooltip key={categoryIndex} mt="8" label={category.name}>
                                    <Checkbox
                                        pr="xs"
                                        value={category.slug+index+categoryIndex}
                                        label={category.name}
                                        color="red"
                                        style={{
                                          paddingLeft: categoryIndex % 3 === 0 ? '16px' : '0px', // Apply left padding for the first column
                                          flex: '1 1 calc(33.33% - 16px)',
                                          input: {
                                            borderColor: "red",
                                          },
                                        }}
                                    />
                                  </Tooltip>
                              ))}
                            </Group>
                          </Checkbox.Group>
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
  );
}
