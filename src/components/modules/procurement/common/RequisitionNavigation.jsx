import React, {useState} from "react";
import {
  IconDeviceFloppy,
  IconPlus,
  IconDashboard,
  IconReportMoney,
  IconReportAnalytics,
  IconBuildingCottage,
  IconArmchair2,
  IconCellSignal4,
  IconSettings,
  IconIcons,
  IconCategory,
  IconCopyCheck,
  IconShoppingBag,
  IconShoppingCart,
} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, ScrollArea, Modal} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import {useDisclosure} from "@mantine/hooks";
import {DateInput} from "@mantine/dates";
import {modals} from "@mantine/modals";
import {storeEntityData} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {useDispatch} from "react-redux";

export default function RequisitionNavigation(props) {
  const { module, id } = props;
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 30;
  const { configData } = getConfigData();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
    const [startDateTooltip, setStartDateTooltip] = useState(false);
    const [expectedDate, setExpectedDate] = useState(new Date())

    const handleGenerateMatrixBatch = async () => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };

        const values = {
            expected_date: new Date(expectedDate).toLocaleDateString("en-CA", options),
        }

        const value = {
            url: 'inventory/requisition/matrix/board/create',
            data: values
        }

        const resultAction = await dispatch(storeEntityData(value));

        if (storeEntityData.rejected.match(resultAction)) {
            showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true)
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            if (resultAction.payload.data.status === 200) {
                showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
                setTimeout(() => {
                    close()
                    navigate("/procurement/requisition-board/"+resultAction?.payload?.data?.data?.id);
                },1000)
            } else {
                showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
            }
        }
    }


    return (
    <>
      <ScrollArea
        h={
          module === "requisition"
            ? height - 52
            : module === 'config'
            ? height - 8
            : module
            ? height - 63
            : height
        }
        bg="white"
        type="never"
        className="border-radius"
      >
        <Flex direction={`column`} align={"center"} gap={"16"}>
          <Flex direction={`column`} align={"center"} mt={"xs"} pt={5}>
            <Tooltip
              label={t("Requisition")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={"#4CAF50"}
              transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
              <Button
                bg={"#4CAF50"}
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"light"}
                color={`black`}
                radius="xl"
                onClick={(e) => {
                  navigate("/procurement/requisition");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              <Text
                size="xs"
                c="black"
                ta="center"
                w={56}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("Requisition")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("NewRequisition")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={"#6f1225"}
              transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
            >
              <Button
                bg={"#6f1225"}
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"light"}
                color={`black`}
                radius="xl"
                onClick={(e) => {
                  navigate("/procurement/new-requisition");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconDashboard size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              <Text
                size="xs"
                c="black"
                ta="center"
                w={56}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("NewRequisition")}
              </Text>
            </Flex>
          </Flex>

          <Flex direction={`column`} align={"center"}>
            <Tooltip
              label={t("BoardList")}
              px={16}
              py={2}
              withArrow
              position={"left"}
              c={"white"}
              bg={"#E53935"}
              transitionProps={{
                transition: "pop-bottom-left",
                duration: 500,
              }}
            >
              <Button
                bg={"#E53935"}
                size="md"
                pl={"12"}
                pr={"12"}
                variant={"light"}
                color={`black`}
                radius="xl"
                onClick={(e) => {
                  navigate("/procurement/requisition-board");
                }}
              >
                <Flex direction={`column`} align={"center"}>
                  <IconCategory size={16} color={"white"} />
                </Flex>
              </Button>
            </Tooltip>
            <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
              <Text
                size="xs"
                c="black"
                ta="center"
                w={56}
                style={{
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t("BoardList")}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={`column`} align={"center"}>
                <Tooltip
                    label={t("NewBoard")}
                    px={16}
                    py={2}
                    withArrow
                    position={"left"}
                    c={"white"}
                    bg={"#E53935"}
                    transitionProps={{
                        transition: "pop-bottom-left",
                        duration: 500,
                    }}
                >
                    <Button
                        bg={"#E53935"}
                        size="md"
                        pl={"12"}
                        pr={"12"}
                        variant={"light"}
                        color={`black`}
                        radius="xl"
                        onClick={(e) => {
                            open()
                            // navigate("/procurement/requisition-board");
                        }}
                    >
                        <Flex direction={`column`} align={"center"}>
                            <IconCategory size={16} color={"white"} />
                        </Flex>
                    </Button>
                </Tooltip>
                <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                    <Text
                        size="xs"
                        c="black"
                        ta="center"
                        w={56}
                        style={{
                            wordBreak: "break-word",
                            hyphens: "auto",
                        }}
                    >
                        {t("NewBoard")}
                    </Text>
                </Flex>
            </Flex>


        </Flex>
      </ScrollArea>

        <Modal
            opened={opened}
            onClose={close}
            title={t("RequisitionMatrixBoard")}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Tooltip
                label={t("ExpectedDate")}
                opened={startDateTooltip}
                px={16}
                py={2}
                position="top-end"
                color='var(--theme-primary-color-6)'
                withArrow
                offset={2}
                zIndex={100}
                transitionProps={{
                    transition: "pop-bottom-left",
                    duration: 5000,
                }}
            >
                <DateInput
                    clearable
                    maxDate={new Date()}
                    onChange={(e) => {
                        setExpectedDate(e)
                        e != ""
                            ? setStartDateTooltip(false)
                            : (setStartDateTooltip(true),
                                setTimeout(() => {
                                    setStartDateTooltip(false);
                                }, 1000));
                    }}
                    value={expectedDate}
                    placeholder={t("ExpectedDate")}
                />
            </Tooltip>

            <Flex justify="flex-end" style={{ marginTop: 24 }}>
                <Button
                    onClick={async () => {
                        modals.openConfirmModal({
                            title: <Text size="md">{t("SuretoProcessMatrixData")}</Text>,
                            children: <Text size="sm">{t("FormConfirmationMessage")}</Text>,
                            labels: { confirm: "Confirm", cancel: "Cancel" },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => {
                                if (!expectedDate){
                                    setStartDateTooltip(true)
                                    return
                                }
                                handleGenerateMatrixBatch()
                                console.log(expectedDate);
                            },
                        });
                    }}
                    size="xs"
                    color="green.8"
                    type="submit"
                    id="EntityFormSubmit"
                    leftSection={<IconDeviceFloppy size={16} />}
                >
                    <Flex direction="column" gap={0}>
                        <Text fz={14} fw={400}>
                            {t("Create")}
                        </Text>
                    </Flex>
                </Button>
            </Flex>

        </Modal>

        <Button variant="default" onClick={open}>
            Open modal
        </Button>
    </>
  );
}
