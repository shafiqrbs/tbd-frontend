import React, {useState} from "react";
import {
    Box,
    Grid,
    Title,
    Tooltip,
    Text,
    TextInput,
    Group,
    Textarea,
    Button,
    ScrollArea,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {
    IconAt,
    IconInfoCircle,
    IconPhone,
    IconUserCircle,
} from "@tabler/icons-react";
import {useForm, isNotEmpty, isEmail, hasLength} from "@mantine/form";
import {useOutletContext} from "react-router-dom";

function FullForm() {
    const {t, i18n} = useTranslation();
    const {isOnline} = useOutletContext();

    const [saveFormData, setSaveFormData] = useState(null);
    const [saveFormData2, setSaveFormData2] = useState(null);
    const form1 = useForm({
        initialValues: {},

        validate: {
            name: hasLength({min: 2, max: 10}),
            email: isEmail(),
            phone: isNotEmpty(),
            address: isNotEmpty(),
        },
    });
    const form2 = useForm({
        initialValues: {},

        validate: {
            name: hasLength({min: 2, max: 10}),
            email: isEmail(),
            phone: isNotEmpty(),
            address: isNotEmpty(),
        },
    });
    return (
        <>
            <Box p={`xs`}>
                <Title order={4}>Notifications</Title>
                <Text fz={`sm`}>We'll always let you know about important changes</Text>
            </Box>
            <Box h={1} bg={`gray.1`}></Box>
            <Box
                component="form"
                onSubmit={form1.onSubmit((values) => setSaveFormData(values))}
            >
                <Grid gutter={0}>
                    <Grid.Col span={6} p={`xs`}>
                        <Tooltip
                            label={t("name_is_required")}
                            opened={!!form1.errors.name}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <TextInput
                                styles={{
                                    root: {
                                        display: "flex",
                                        direction: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "var(--mantine-spacing-xs)",
                                    },
                                    wrapper: {
                                        width: "70%",
                                    },
                                    label: {},
                                }}
                                size="xs"
                                label={t("name")}
                                placeholder={t("name")}
                                leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                rightSection={
                                    <Tooltip
                                        label={t("this_filed_is_required")}
                                        withArrow
                                        bg={`blue.5`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                                }
                                withAsterisk
                                {...form1.getInputProps("name")}
                            />
                        </Tooltip>

                        <Tooltip
                            label={t("email_is_required")}
                            opened={!!form1.errors.email}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <TextInput
                                mt={`xs`}
                                styles={{
                                    root: {
                                        display: "flex",
                                        direction: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "var(--mantine-spacing-xs)",
                                    },
                                    wrapper: {
                                        width: "70%",
                                    },
                                    label: {},
                                }}
                                size="xs"
                                label={t("email")}
                                placeholder={t("email")}
                                leftSection={<IconAt size={16} opacity={0.5}/>}
                                rightSection={
                                    <Tooltip
                                        label={t("this_filed_is_required")}
                                        withArrow
                                        bg={`blue.5`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                                }
                                withAsterisk
                                {...form1.getInputProps("email")}
                            />
                        </Tooltip>
                    </Grid.Col>
                    <Grid.Col span={6} p={`xs`}>
                        <Tooltip
                            label={t("phone_number_is_required")}
                            opened={!!form1.errors.phone}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <TextInput
                                styles={{
                                    root: {
                                        display: "flex",
                                        direction: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "var(--mantine-spacing-xs)",
                                    },
                                    wrapper: {
                                        width: "70%",
                                    },
                                    label: {},
                                }}
                                size="xs"
                                label={t("phone")}
                                placeholder={t("phone")}
                                leftSection={<IconPhone size={16} opacity={0.5}/>}
                                rightSection={
                                    <Tooltip
                                        label={t("this_filed_is_required")}
                                        withArrow
                                        bg={`blue.5`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                                }
                                withAsterisk
                                {...form1.getInputProps("phone")}
                            />
                        </Tooltip>

                        <Tooltip
                            label={t("address_is_required")}
                            opened={!!form1.errors.address}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Textarea
                                mt={`xs`}
                                withAsterisk
                                styles={{
                                    root: {
                                        display: "flex",
                                        direction: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "var(--mantine-spacing-xs)",
                                    },
                                    wrapper: {
                                        width: "70%",
                                    },
                                    label: {},
                                }}
                                label={t("address")}
                                size="xs"
                                placeholder={t("address")}
                                {...form1.getInputProps("address")}
                            />
                        </Tooltip>
                    </Grid.Col>
                </Grid>
                <ScrollArea scrollbarSize={4}>
                    <pre>{saveFormData && JSON.stringify(saveFormData)}</pre>
                </ScrollArea>
                <Group justify="flex-end" mt="md">
                    <Button type="submit" disabled={!isOnline}>
                        Submit
                    </Button>
                </Group>
            </Box>

            <Box p={`xs`}>
                <Title order={4}>Notifications</Title>
                <Text fz={`sm`}>We'll always let you know about important changes</Text>
            </Box>
            <Box h={1} bg={`gray.1`}></Box>
            <Box
                component="form"
                onSubmit={form2.onSubmit((values) => setSaveFormData2(values))}
            >
                <Grid gutter={0}>
                    <Grid.Col span={6} p={`xs`}>
                        <Tooltip
                            label={t("name_is_required")}
                            opened={!!form2.errors.name}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <TextInput
                                styles={{
                                    root: {
                                        display: "flex",
                                        direction: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "var(--mantine-spacing-xs)",
                                    },
                                    wrapper: {
                                        width: "70%",
                                    },
                                    label: {},
                                }}
                                size="xs"
                                label={t("name")}
                                placeholder={t("name")}
                                leftSection={<IconUserCircle size={16} opacity={0.5}/>}
                                rightSection={
                                    <Tooltip
                                        label={t("this_filed_is_required")}
                                        withArrow
                                        bg={`blue.5`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                                }
                                withAsterisk
                                {...form2.getInputProps("name")}
                            />
                        </Tooltip>

                        <Tooltip
                            label={t("email_is_required")}
                            opened={!!form2.errors.email}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <TextInput
                                mt={`xs`}
                                styles={{
                                    root: {
                                        display: "flex",
                                        direction: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "var(--mantine-spacing-xs)",
                                    },
                                    wrapper: {
                                        width: "70%",
                                    },
                                    label: {},
                                }}
                                size="xs"
                                label={t("email")}
                                placeholder={t("email")}
                                leftSection={<IconAt size={16} opacity={0.5}/>}
                                rightSection={
                                    <Tooltip
                                        label={t("this_filed_is_required")}
                                        withArrow
                                        bg={`blue.5`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                                }
                                withAsterisk
                                {...form2.getInputProps("email")}
                            />
                        </Tooltip>
                    </Grid.Col>
                    <Grid.Col span={6} p={`xs`}>
                        <Tooltip
                            label={t("phone_number_is_required")}
                            opened={!!form2.errors.phone}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <TextInput
                                styles={{
                                    root: {
                                        display: "flex",
                                        direction: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "var(--mantine-spacing-xs)",
                                    },
                                    wrapper: {
                                        width: "70%",
                                    },
                                    label: {},
                                }}
                                size="xs"
                                label={t("phone")}
                                placeholder={t("phone")}
                                leftSection={<IconPhone size={16} opacity={0.5}/>}
                                rightSection={
                                    <Tooltip
                                        label={t("this_filed_is_required")}
                                        withArrow
                                        bg={`blue.5`}
                                    >
                                        <IconInfoCircle size={16} opacity={0.5}/>
                                    </Tooltip>
                                }
                                withAsterisk
                                {...form2.getInputProps("phone")}
                            />
                        </Tooltip>

                        <Tooltip
                            label={t("address_is_required")}
                            opened={!!form2.errors.address}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Textarea
                                mt={`xs`}
                                withAsterisk
                                //   autosize
                                styles={{
                                    root: {
                                        display: "flex",
                                        direction: "row",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "var(--mantine-spacing-xs)",
                                    },
                                    wrapper: {
                                        width: "70%",
                                    },
                                    label: {},
                                }}
                                label={t("address")}
                                size="xs"
                                placeholder={t("address")}
                                {...form2.getInputProps("address")}
                            />
                        </Tooltip>
                    </Grid.Col>
                </Grid>
                <ScrollArea scrollbarSize={4}>
                    <pre>{saveFormData2 && JSON.stringify(saveFormData2)}</pre>
                </ScrollArea>
                <Group justify="flex-end" mt="md">
                    <Button type="submit" disabled={!isOnline}>
                        Submit
                    </Button>
                </Group>
            </Box>
        </>
    );
}

export default FullForm;
