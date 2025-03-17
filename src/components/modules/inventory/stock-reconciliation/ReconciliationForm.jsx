import {
  ActionIcon,
  Tooltip,
  Grid,
  Box,
  Title,
  Stack,
  Button,
  Flex,
  ScrollArea,
  Text,
} from "@mantine/core";
import SelectForm from "../../../form-builders/SelectForm";
import { IconUsersGroup, IconDeviceFloppy } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import Shortcut from "../../shortcut/Shortcut";

export default function ReconciliationForm() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const form = useForm({
    initialValues: {
      product_id: "",
      warehouse_id: "",
      mode_quantity_id: "",
      mode_quantity: "",
      mode_bonus_id: "",
      mode_bonus: "",
    },
    validate: {
      product_id: isNotEmpty(),
    },
  });
  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("customer_group_id").click();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          form.reset();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("EntityFormSubmit").click();
        },
      ],
    ],
    []
  );
  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          modals.openConfirmModal({
            title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
            children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
            labels: { confirm: t("Submit"), cancel: t("Cancel") },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () => {
              const value = {
                url: "core/customer",
                data: values,
              };
              dispatch(storeEntityData(value));
              notifications.show({
                color: "teal",
                title: t("CreateSuccessfully"),
                icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                loading: false,
                autoClose: 700,
                style: { backgroundColor: "lightgray" },
              });
              setTimeout(() => {
                customerDataStoreIntoLocalStorage();
                form.reset();
                setMarketingExeData(null);
                setCustomerGroupData(null);
                setLocationData(null);
                dispatch(setEntityNewData([]));
                dispatch(setFetching(true));
              }, 700);
            },
          });
        })}
      >
        <Grid columns={9} gutter={{ base: 8 }}>
          <Grid.Col span={8}>
            <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
              <Box bg={"white"}>
                <Box
                  pl={`xs`}
                  pr={8}
                  pt={"6"}
                  pb={"6"}
                  mb={"4"}
                  className={"boxBackground borderRadiusAll"}
                >
                  <Grid>
                    <Grid.Col span={6}>
                      <Title order={6} pt={"6"}>
                        {t("StockReconciliation")}
                      </Title>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack right align="flex-end">
                        <>
                          {!saveCreateLoading && isOnline && (
                            <Button
                              size="xs"
                              color={`green.8`}
                              type="submit"
                              id="EntityFormSubmit"
                              leftSection={<IconDeviceFloppy size={16} />}
                            >
                              <Flex direction={`column`} gap={0}>
                                <Text fz={14} fw={400}>
                                  {" "}
                                  {t("CreateAndSave")}
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
                  >
                    <Box>
                      <Box>
                        <Grid gutter={{ base: 6 }}>
                          <Grid.Col span={11}>
                            <Box mt={"8"}></Box>
                          </Grid.Col>
                          <Grid.Col span={1}>
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}></Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 6 }}>
                          <Grid.Col span={6}>
                            <Box></Box>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Box></Box>
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}></Box>
                      <Box mt={"xs"}>
                        <Grid gutter={{ base: 6 }}>
                          <Grid.Col span={6}>
                            <Box></Box>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Box></Box>
                          </Grid.Col>
                        </Grid>
                      </Box>
                      <Box mt={"xs"}></Box>
                      <Box mt={"xs"}></Box>
                      <Box mt={"xs"} mb={"xs"}></Box>
                    </Box>
                  </ScrollArea>
                </Box>
              </Box>
            </Box>
          </Grid.Col>
          <Grid.Col span={1}>
            <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
              <Shortcut
                form={form}
                FormSubmit={"EntityFormSubmit"}
                Name={"customer_group_id"}
                inputType="select"
              />
            </Box>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
}
