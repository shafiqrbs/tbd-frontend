import React, {useState} from "react";
import {
    IconDashboard,
    IconCategory,
} from "@tabler/icons-react";
import {Button, Flex, Text, Tooltip, ScrollArea} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useNavigate, useOutletContext} from "react-router-dom";
import NewBoardCreateModel from "./NewBoardCreateModel.jsx";
import NewWarehouseBoardCreateModel from "./NewWarehouseBoardCreateModel.jsx";

export default function RequisitionNavigation(props) {
    const {module, id} = props;
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 18;
    const navigate = useNavigate();
    const [newBoardCreateModel, setNewBoardCreateModel] = useState(false)
    const [newWarehouseBoardCreateModel, setNewWarehouseBoardCreateModel] = useState(false)

    return (
        <>
            <ScrollArea
                h={
                    module === "requisition"
                        ? height - 10
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
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
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
                                    <IconDashboard size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            <Text
                                fz={"10"}
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
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
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
                                    <IconDashboard size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} c={"black"}>
                            <Text
                                fz={"10"}
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
                            label={t("AllRequisition")}
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
                                    <IconCategory size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            <Text
                                size="xs"
                                fz={"10"}
                                c="black"
                                ta="center"
                                w={56}
                                style={{
                                    wordBreak: "break-word",
                                    hyphens: "auto",
                                }}
                            >
                                {t("AllRequisition")}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex direction={`column`} align={"center"}>
                        <Tooltip
                            label={t("NewDomainBoard")}
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
                                bg={"#4b99f8"}
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {
                                    setNewBoardCreateModel(true)
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconCategory size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            <Text
                                size="xs"
                                fz={"10"}
                                c="black"
                                ta="center"
                                w={56}
                                style={{
                                    wordBreak: "break-word",
                                    hyphens: "auto",
                                }}
                            >
                                {t("NewDomainBoard")}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex direction={`column`} align={"center"}>
                        <Tooltip
                            label={t("AllRequisitionWarehouse")}
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
                                    navigate("/procurement/warehouse/requisition-board");
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconCategory size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            <Text
                                size="xs"
                                fz={"10"}
                                c="black"
                                ta="center"
                                w={56}
                                style={{
                                    wordBreak: "break-word",
                                    hyphens: "auto",
                                }}
                            >
                                {t("AllRequisitionWarehouse")}
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
                                bg={"#4b99f8"}
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {
                                    setNewWarehouseBoardCreateModel(true)
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconCategory size={16} color={"white"}/>
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
                            <Text
                                size="xs"
                                fz={"10"}
                                c="black"
                                ta="center"
                                w={56}
                                style={{
                                    wordBreak: "break-word",
                                    hyphens: "auto",
                                }}
                            >
                                {t("NewWarehouseBoard")}
                            </Text>
                        </Flex>
                    </Flex>


                </Flex>
            </ScrollArea>

            {
                newBoardCreateModel &&
                <NewBoardCreateModel newBoardCreateModel={newBoardCreateModel}
                                     setNewBoardCreateModel={setNewBoardCreateModel}/>
            }

            {
                newWarehouseBoardCreateModel &&
                <NewWarehouseBoardCreateModel newWarehouseBoardCreateModel={newWarehouseBoardCreateModel}
                                              setNewWarehouseBoardCreateModel={setNewWarehouseBoardCreateModel}/>
            }
        </>
    );
}
