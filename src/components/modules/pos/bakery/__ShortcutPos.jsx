import React from "react";
import {
  IconDeviceFloppy,
  IconPlus,
  IconDashboard,
  IconReportMoney,
  IconReportAnalytics,
  IconBuildingCottage,
  IconArmchair2,
  IconCellSignal4,
} from "@tabler/icons-react";
import {
  Button,
  Flex,
  Text,
  Tooltip,
  ScrollArea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import useConfigData from "../../../global-hook/config-data/useConfigData.js";
import { IconSettings } from "@tabler/icons-react";

function __ShortcutPos({ settingsAction }) {
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 190;
  const { configData } = useConfigData();
  return (
		<>
			<ScrollArea
				h={!!configData?.is_table_pos ? height : height + 110}
				bg="white"
				type="never"
				className="border-radius"
			>
				<Flex direction={`column`} align={"center"} gap={"16"}>
					<Flex direction={`column`} align={"center"} mt={2} pt={5}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
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
								onClick={(e) => {}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconDashboard size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							{t("Dashboard")}
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#E53935"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconReportMoney size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							{t("Sales")}
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#3F51B5"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconReportAnalytics size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							{t("UserSales")}
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#FFC107"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconBuildingCottage size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							{t("Stock")}
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#673AB7"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {
									//
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconArmchair2 size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex
							direction={`column`}
							align={"center"}
							fz={"12"}
							c={"black"}
							wrap={"wrap"}
						>
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
								{t("AdditionalTables")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#009688"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconCellSignal4 size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex
							direction={`column`}
							align={"center"}
							fz={"12"}
							c={"black"}
							wrap={"wrap"}
						>
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
								{t("Online")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("Settings")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"red.8"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => settingsAction(true)}
							>
								<Flex direction={`column`} align={"center"}>
									<IconSettings size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex
							direction={`column`}
							align={"center"}
							fz={"12"}
							c={"black"}
							wrap={"wrap"}
						>
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
								{t("Settings")}
							</Text>
						</Flex>
					</Flex>
				</Flex>
			</ScrollArea>
		</>
  );
}

export default __ShortcutPos;
