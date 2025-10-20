import React, {useEffect, useState} from "react";
import {
  IconDeviceFloppy,
} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, Modal, Select} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {DateInput} from "@mantine/dates";
import {getIndexEntityData, storeEntityData} from "../../../../store/core/crudSlice.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
import {useDispatch} from "react-redux";

export default function NewWarehouseBoardCreateModel({ newWarehouseBoardCreateModel,setNewWarehouseBoardCreateModel }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  const navigate = useNavigate();
    const [startDateTooltip, setStartDateTooltip] = useState(false);
    const [domainTooltip, setDomainTooltip] = useState(false);
    const [expectedDate, setExpectedDate] = useState(new Date())

    const [childDomainData, setChildDomainData] = useState([]);
    const [childConfigId, setChildConfigId] = useState(null);

    // Failed product modal state

    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: "domain/b2b/sub-domain",
                param: {}
            };

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error("Error:", resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    if (resultAction?.payload && resultAction?.payload?.data?.length > 0) {
                        const transformedData = resultAction.payload.data.map((vendor) => ({
                            label: `${vendor.name}`,
                            value: String(vendor.sub_domain_inv_config_id),
                        }));
                        setChildDomainData(transformedData ?? []);
                    }
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
            }
        };

        fetchData();
    }, [dispatch]);

    const handleGenerateMatrixBatch = async () => {
        if (!expectedDate){
            setStartDateTooltip(true)
            return
        }
        if (!childConfigId){
            setDomainTooltip(true)
            return
        }

        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };

        const values = {
            expected_date: new Date(expectedDate).toLocaleDateString("en-CA", options),
            config_id: childConfigId
        }

        const value = {
            url: 'inventory/requisition/matrix/board/warehouse/create',
            data: values
        }

        const resultAction = await dispatch(storeEntityData(value));

        if (storeEntityData.rejected.match(resultAction)) {
            showNotificationComponent(resultAction.payload.message, 'red', true, 1000, true)
        } else if (storeEntityData.fulfilled.match(resultAction)) {
            if (resultAction.payload.data.status === 200) {
                showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
                setTimeout(() => {
                    setNewWarehouseBoardCreateModel(false)
                    navigate("/procurement/warehouse/requisition-board/"+resultAction?.payload?.data?.data?.id);
                },1000)
            } else {
                showNotificationComponent(resultAction.payload.data.message, 'teal', true, 1000, true)
            }
        }
    }

    const handleModelClose = () => {
        setNewWarehouseBoardCreateModel(false)
    }

    return (
    <>
        {
            newWarehouseBoardCreateModel &&
            <Modal
                opened={newWarehouseBoardCreateModel}
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
                    color='var(--mantine-color-red-6)'
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

                <Tooltip
                    label={t("ChooseDomain")}
                    opened={domainTooltip}
                    px={16}
                    py={2}
                    position="top-end"
                    color='var(--mantine-color-red-6)'
                    withArrow
                    offset={2}
                    zIndex={100}
                    transitionProps={{
                        transition: "pop-bottom-left",
                        duration: 5000,
                    }}
                >
                    <Select
                        mt={10}
                        placeholder={t("ChooseDomain")}
                        autoSelectOnBlur
                        searchable
                        value={childConfigId}
                        onChange={(e) => {
                            setChildConfigId(e)
                            e != ""
                                ? setDomainTooltip(false)
                                : (setDomainTooltip(true),
                                    setTimeout(() => {
                                        setDomainTooltip(false);
                                    }, 500));
                        }}
                        data={childDomainData}
                    />
                </Tooltip>

                <Flex justify="flex-end" style={{ marginTop: 24 }}>
                    <Button
                        onClick={async () => {
                            if (!expectedDate){
                                setStartDateTooltip(true)
                                return
                            }
                            if (!childConfigId){
                                setDomainTooltip(true)
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
