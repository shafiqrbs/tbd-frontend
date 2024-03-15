import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    Tabs,
    rem,
    Text,
    Tooltip,
    Flex,
    LoadingOverlay,
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck,
    IconColorFilter,
    IconList,
    IconX,
} from "@tabler/icons-react";
import ThreeGrid from "./ThreeGrid";
import {hasLength, isEmail, useForm} from "@mantine/form";
import {modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import TwoGrid from "./TwoGrid";
import FullForm from "./FullForm";
import FullTable from "./FullTable";
import FormAndFile from "./FormAndFile";


function DashBoard() {
    const {t, i18n} = useTranslation();
    const iconStyle = {width: rem(12), height: rem(12)};
    const [activeTab, setActiveTab] = useState("ThreeGrid");
    const [saveCreateLoading, setSaveCreateLoading] = useState(false);
    const [isFormSubmit, setFormSubmit] = useState(false);
    const [formSubmitData, setFormSubmitData] = useState([]);
    const {isOnline, mainAreaHeight} = useOutletContext();

    const form = useForm({
        initialValues: {},
        validate: {
            name: hasLength({min: 2, max: 10}),
            email: isEmail(),

        },
    });

    const tabDataListRightButtons = (
        <Group
            pos={`absolute`}
            right={0}
            gap={0}
        >
            <Tooltip
                label={"Tooltip"}
                px={20}
                py={3}
                color={`red.8`}
                withArrow
                offset={2}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button size="xs" color={`red.8`}>
                    <IconColorFilter size={18}/>
                </Button>
            </Tooltip>
            <Tooltip
                label={"Create CSV"}
                px={20}
                py={3}
                color={`green.8`}
                withArrow
                offset={2}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button size="xs" ml={`xs`} color={`green.8`}>
                    CSV
                </Button>
            </Tooltip>

            <Tooltip
                label={"Create PDF"}
                px={20}
                py={3}
                color={`blue.7`}
                withArrow
                offset={2}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button size="xs" ml={`xs`} color={`blue.7`}>
                    PDF
                </Button>
            </Tooltip>
        </Group>
    );

    const tabCreateNewRightButtons = (
        <Group pos={`absolute`} right={0} gap={0}>
            <Tooltip
                label={"Tooltip"}
                px={20}
                py={3}
                color={`blue.3`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button size="sm" color={`red.3`} variant="light">
                    <IconX size={18}/>
                </Button>
            </Tooltip>
            <Tooltip
                label={t("check")}
                px={20}
                py={3}
                color={`blue.3`}
                withArrow
                offset={2}
                position={"bottom"}
                transitionProps={{transition: "pop-bottom-left", duration: 500}}
            >
                <Button size="sm" ml={1} mr={1} variant="light" color={`yellow.5`}>
                    <IconCircleCheck/>
                </Button>
            </Tooltip>


            <>
                <Button
                    size="sm"
                    color={`blue.7`}
                    type="submit"
                >
                    <LoadingOverlay visible={saveCreateLoading} zIndex={1000} overlayProps={{radius: "xs", blur: 2}}
                                    size={'xs'} position="center"/>

                    <Flex direction={`column`} gap={0}>
                        <Text fz={12} fw={700}>
                            {t("CreateAndSave")} <br/>{" "}
                            <Text fz={9} fw={900}>
                                ctrl + s
                            </Text>
                        </Text>
                    </Flex>
                </Button>
            </>
        </Group>
    );
    return (
        <form
            onSubmit={form.onSubmit((values) => {
                modals.openConfirmModal({
                    title: 'Please confirm your action',
                    children: (
                        <Text size="sm">
                            This action is so important that you are required to confirm it with a modal. Please click
                            one of these buttons to proceed.
                        </Text>
                    ),
                    labels: {confirm: 'Confirm', cancel: 'Cancel'},
                    onCancel: () => console.log('Cancel'),
                    onConfirm: () => {
                        setSaveCreateLoading(true)

                        setTimeout((e) => {
                            console.log(values)

                            notifications.show({
                                title: 'Default notification',
                                message: 'Hey there, your code is awesome! 🤥',
                            })

                            setSaveCreateLoading(false)
                        }, 3000)
                    },
                });


            })}
        >
            <Tabs
                defaultValue="ThreeGrid"
                onChange={(value) => setActiveTab(value)}
            >
                <Tabs.List pos={`relative`}>



                     <Tabs.Tab
                        value="ThreeGrid"
                        leftSection={<IconList style={iconStyle}/>}
                    >
                        {t("ThreeGrid")}
                    </Tabs.Tab>

                    <Tabs.Tab
                        value="TwoGrid"
                        leftSection={<IconList style={iconStyle}/>}
                    >
                        {t("TwoGrid")}
                    </Tabs.Tab>

                    <Tabs.Tab
                        value="FullForm"
                        leftSection={<IconList style={iconStyle}/>}
                    >
                        {t("FullForm")}
                    </Tabs.Tab>

                    <Tabs.Tab
                        value="FullTable"
                        leftSection={<IconList style={iconStyle}/>}
                    >
                        {t("FullTable")}
                    </Tabs.Tab>

                    <Tabs.Tab
                        value="FormAndFile"
                        leftSection={<IconList style={iconStyle}/>}
                    >
                        {t("FormAndFile")}
                    </Tabs.Tab>

                    {activeTab === "FullTable" && tabDataListRightButtons}
                    {activeTab === "ThreeGrid" && tabCreateNewRightButtons}
                </Tabs.List>



                <Tabs.Panel value="ThreeGrid">
                    <ThreeGrid
                        isFormSubmit={isFormSubmit}
                        setFormSubmitData={setFormSubmitData}
                        setFormSubmit={setFormSubmit} f
                        form={form}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="TwoGrid">
                    <TwoGrid
                        isFormSubmit={isFormSubmit}
                        setFormSubmitData={setFormSubmitData}
                        setFormSubmit={setFormSubmit}
                        form={form}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="FullForm">
                    <FullForm
                        isFormSubmit={isFormSubmit}
                        setFormSubmitData={setFormSubmitData}
                        setFormSubmit={setFormSubmit}
                        form={form}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="FullTable">
                    <FullTable/>
                </Tabs.Panel>

                <Tabs.Panel value="FormAndFile">
                    <FormAndFile/>
                </Tabs.Panel>
            </Tabs>
        </form>
    );
}

export default DashBoard;
