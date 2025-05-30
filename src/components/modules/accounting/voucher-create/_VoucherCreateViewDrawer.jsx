import React, {useState} from "react";
import { useOutletContext } from "react-router-dom";
import {ActionIcon, Grid, Box, Drawer, Text, Button, Flex, Group, Stack, ScrollArea} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {IconDeviceFloppy, IconPlus, IconX} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import getAccountingSubHeadDropdownData from "../../../global-hook/dropdown/getAccountingSubHeadDropdownData";
import InputCheckboxForm from "../../../form-builders/InputCheckboxForm";
import {setValidationData, storeEntityData} from "../../../../store/core/crudSlice";
import {modals} from "@mantine/modals";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
import {useForm} from "@mantine/form";
import genericClass from "../../../../assets/css/Generic.module.css";

function _VoucherCreateViewDrawer(props) {
  const showEntityData = useSelector(
    (state) => state.accountingCrudSlice.showEntityData
  );
  let accountDropdownData = getAccountingSubHeadDropdownData();
  const { voucherCrateViewDrawer, setVoucherCreateViewDrawer } = props;
  const { isOnline, mainAreaHeight } = useOutletContext();
  const { t, i18n } = useTranslation();
  const height = mainAreaHeight; //TabList height 104
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const closeDrawer = () => {
    setVoucherCreateViewDrawer(false);
  };

  const form = useForm({
    initialValues: {
      primary_account_head_id:"",
      secondary_account_head_id:"",
    },
  });

  const handleVoucherFormSubmit = (values) => {
    dispatch(setValidationData(false));
    modals.openConfirmModal({
      title: <Text size="md">{t("FormConfirmationTitle")}</Text>,
      children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
      labels: { confirm: t("Submit"), cancel: t("Cancel") },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleVoucherConfirmFormSubmit(values),
    });
  };

  const handleVoucherConfirmFormSubmit = async (values) => {

    // Format dates properly for MySQL
    const formattedValues = {
      ...values,
      financial_start_date: formatDateForMySQL(values.financial_start_date),
      financial_end_date: formatDateForMySQL(values.financial_end_date)
    };

    const payload = {
      url: `domain/config/accounting/${id}`,
      data: formattedValues,
    };

    try {
      setSaveCreateLoading(true);
      const result = await dispatch(storeEntityData(payload));
      if (storeEntityData.fulfilled.match(result) && result.payload?.data?.status === 200) {
        fetchDomainConfig()
        showNotificationComponent(t("UpdateSuccessfully"), "teal");
      } else {
        showNotificationComponent(t("UpdateFailed"), "red");
      }

    } catch (err) {
      console.error(err);
      showNotificationComponent(t("UpdateFailed"), "red");
    } finally {
      setSaveCreateLoading(false);
    }

  }

  return (
    <>
      <Drawer.Root
        opened={voucherCrateViewDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text fw={"600"} fz={"16"}>
                {t("VoucherSetupHead")}
              </Text>
            </Drawer.Title>
            <ActionIcon
              className="ActionIconCustom"
              variant="transparent"
              radius="xl"
              color="black"
              size="lg"
              onClick={closeDrawer}
            >
              <IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </Drawer.Header>
          <Box mb={0}  h={height}>
            <form onSubmit={form.onSubmit(handleVoucherFormSubmit)}>
              <ScrollArea h={height-20} scrollbarSize={2} scrollbars="y" type="never">
                  <Box p={"md"} className="borderRadiusAll">
                    <Box bg="gray.1" ml={'-md'} px="sm" py="xs">
                      <Text fz={14} fw={600}> {t("PrimaryVoucherHead")}</Text>
                    </Box>
                    <Box><InputCheckboxForm form={form} label={t("PrimaryVoucherHead")} field={'primary_account_head_id'}  name={'primary_account_head_id'} /></Box>
                    <Box><InputCheckboxForm form={form} label={t("PrimaryVoucherHead")} field={'primary_account_head_id'}  name={'primary_account_head_id'} /></Box>
                    <Box><InputCheckboxForm form={form} label={t("PrimaryVoucherHead")} field={'primary_account_head_id'}  name={'primary_account_head_id'} /></Box>
                    <Box><InputCheckboxForm form={form} label={t("PrimaryVoucherHead")} field={'primary_account_head_id'}  name={'primary_account_head_id'} /></Box>
                    <Box bg="gray.1" ml={'-md'} px="sm" py="xs" mt={'md'}>
                      <Text fz={14} fw={600}> {t("SecondaryVoucherHead")}</Text>
                    </Box>
                    <Box><InputCheckboxForm form={form} label={t("PrimaryVoucherHead")} field={'secondary_account_head_id'}  name={'secondary_account_head_id'} /></Box>
                    <Box><InputCheckboxForm form={form} label={t("PrimaryVoucherHead")} field={'secondary_account_head_id'}  name={'secondary_account_head_id'} /></Box>
                    <Box><InputCheckboxForm form={form} label={t("PrimaryVoucherHead")} field={'secondary_account_head_id'}  name={'secondary_account_head_id'} /></Box>
                    <Box><InputCheckboxForm form={form} label={t("PrimaryVoucherHead")} field={'secondary_account_head_id'}  name={'secondary_account_head_id'} /></Box>
                  </Box>
              </ScrollArea>
              <Box pl={`xs`} pr={8} pt={'6'} pb={'6'} mb={'2'} mt={4} className={'boxBackground borderRadiusAll'}>
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
                        color="black"
                        onClick={closeDrawer}
                        ml={'4'}
                    >
                      <IconX style={{ width: '100%', height: '100%' }} stroke={1.5} />
                    </ActionIcon>
                  </Flex>
                  <Group gap={8}>
                    <Stack align="flex-start">
                      <>
                        {
                          !saveCreateLoading && isOnline &&
                          <Button
                              size="xs"
                              className={'btnPrimaryBg'}
                              type="submit"
                              leftSection={<IconDeviceFloppy size={16} />}
                          >
                            <Flex direction={`column`} gap={0}>
                              <Text fz={14} fw={400}>
                                {t("CreateAndSave")}
                              </Text>
                            </Flex>
                          </Button>
                        }
                      </>
                    </Stack>
                  </Group>
                </Group>
              </Box>
            </form>
          </Box>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

export default _VoucherCreateViewDrawer;
