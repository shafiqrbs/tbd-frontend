import React, {useState} from "react";
import {
  IconDeviceFloppy,
} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, Modal} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {DateInput} from "@mantine/dates";
import {storeEntityData} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {useDispatch} from "react-redux";

export default function NewBoardCreateModel(props) {
  const { newBoardCreateModel,setNewBoardCreateModel } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  const navigate = useNavigate();
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
                    setNewBoardCreateModel(false)
                    navigate("/procurement/requisition-board/"+resultAction?.payload?.data?.data?.id);
                },1000)
            } else {
                showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
            }
        }
    }

    const handleModelClose = () => {
        setNewBoardCreateModel(false)
    }

    return (
    <>
        {
            newBoardCreateModel &&
            <Modal
                opened={newBoardCreateModel}
                onClose={handleModelClose}
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
                        minDate={new Date()}
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
                            if (!expectedDate){
                                setStartDateTooltip(true)
                                return
                            }
                            handleGenerateMatrixBatch()
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
        }
    </>
  );
}
