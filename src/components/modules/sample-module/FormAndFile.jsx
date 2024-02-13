import React, { useState} from "react";

import {
    useForm,
    isNotEmpty,
    isEmail,
    isInRange,
    hasLength,
    matches,
} from "@mantine/form";
import {
    Button,
    Group,
    TextInput,
    NumberInput,
    Box,
    Tooltip,
    ColorInput,
    Checkbox,
    Grid,
    Switch,
    Flex,
    Textarea,
    Autocomplete,
    MultiSelect,
    Select,
    rem,
    Text,
    Radio,
    ScrollArea,
    Center, Title,
} from "@mantine/core";
import {Dropzone, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {IconPhoto, IconUpload, IconX} from "@tabler/icons-react";
import {
    DateInput,
    DatePickerInput,
    DateTimePicker,
    MonthPickerInput,
} from "@mantine/dates";
import "@mantine/dropzone/styles.css";
import "@mantine/dates/styles.css";
import {getHotkeyHandler} from '@mantine/hooks';

function FormAndFile() {
    const [saveFormData, setSaveFormData] = useState(null);
    const form = useForm({
        initialValues: {},

        validate: {
            name: hasLength({min: 2, max: 10}),
            email: isEmail(),
            favoriteColor: matches(/^#([0-9a-f]{3}){1,2}$/),
            age: isInRange({min: 18, max: 99}),
            agree: isNotEmpty(),
            switch: isNotEmpty(),
            radio: isNotEmpty(),
            textarea: isNotEmpty(),
            autocomplete: isNotEmpty(),
            multiselect: isNotEmpty(),
            select: isNotEmpty(),
            date_input: isNotEmpty(),
            month_picker: isNotEmpty(),
            date_picker: isNotEmpty(),
            date_time_picker: isNotEmpty(),
            file: isNotEmpty(),
        },
    });

    const [value, setValue] = useState("I've just used a hotkey to send a message");

    return (
        <>
            <Box p={`xs`}>
                <Title order={4}>Notifications</Title>
                <Text fz={`sm`}>We'll always let you know about important changes</Text>
            </Box>
            <Box h={1} bg={`gray.1`}></Box>
            <Box
                component="form"
                onSubmit={form.onSubmit((values) => setSaveFormData(values))}
            >
                <Grid gap={0}>
                    <Grid.Col span={4}>
                        <Tooltip
                            label={"Name must be 2-10 characters long"}
                            opened={!!form.errors.name}
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
                                size="xs"
                                label="Name"
                                placeholder="Name y"
                                withAsterisk
                                {...form.getInputProps("name")}
                                onKeyDown={getHotkeyHandler([
                                    ['Enter', (e) => {
                                        document.getElementById('email').focus();
                                    }],
                                ])}
                            />
                        </Tooltip>
                        <Tooltip
                            label={"Invalid Email"}
                            opened={!!form.errors.email}
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
                                size="xs"
                                id="email"
                                label="Your email"
                                placeholder="Your email"
                                withAsterisk
                                {...form.getInputProps("email")}
                                onKeyDown={getHotkeyHandler([
                                    ['Enter', (e) => {
                                        document.getElementById('favoriteColor').focus();
                                    }],
                                ])}
                            />
                        </Tooltip>

                        <Tooltip
                            label={"Enter a valid hex color"}
                            opened={!!form.errors.favoriteColor}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <ColorInput
                                size="xs"
                                label="Your favorite color"
                                id="favoriteColor"
                                withAsterisk
                                {...form.getInputProps("favoriteColor")}
                            />
                        </Tooltip>
                        <Tooltip
                            label={"You must be 18-99 years old to register"}
                            opened={!!form.errors.age}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <NumberInput
                                size="xs"
                                label="Your age"
                                placeholder="Your age"
                                withAsterisk
                                {...form.getInputProps("age")}
                            />
                        </Tooltip>
                        <Tooltip
                            label={"Require radio"}
                            opened={!!form.errors.radio}
                            px={20}
                            py={3}
                            position="top-start"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Radio.Group
                                name="favoriteFramework"
                                label="Select Radio"
                                withAsterisk
                                {...form.getInputProps("radio")}
                            >
                                <Group>
                                    <Radio value="react" label="React"/>
                                    <Radio value="svelte" label="Svelte"/>
                                    <Radio value="ng" label="Angular"/>
                                    <Radio value="vue" label="Vue"/>
                                </Group>
                            </Radio.Group>
                        </Tooltip>
                        <Flex
                            mt={`xs`}
                            gap="xs"
                            justify="space-between"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <Tooltip
                                label={"Agree terms & conditions"}
                                opened={!!form.errors.agree}
                                px={20}
                                py={3}
                                position="top-start"
                                color="red"
                                withArrow
                                offset={2}
                                zIndex={0}
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <Checkbox
                                    label="Agree"
                                    {...form.getInputProps("agree")}
                                />
                            </Tooltip>
                            <Tooltip
                                label={"Require switch"}
                                opened={!!form.errors.switch}
                                px={20}
                                py={3}
                                position="bottom-end"
                                color="red"
                                withArrow
                                offset={2}
                                zIndex={0}
                                transitionProps={{transition: "pop-bottom-left", duration: 500}}
                            >
                                <Switch
                                    size="xs"
                                    label="I agree"
                                    {...form.getInputProps("switch")}
                                />
                            </Tooltip>
                        </Flex>
                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.date_picker}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <DatePickerInput
                                size="xs"
                                label="Pick date"
                                placeholder="Pick date"
                                {...form.getInputProps("date_picker")}
                            />
                        </Tooltip>
                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.date_time_picker}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <DateTimePicker
                                size="xs"
                                label="Pick a Date"
                                placeholder="Pick a Date"
                                {...form.getInputProps("date_time_picker")}
                            />
                        </Tooltip>
                    </Grid.Col>

                    <Grid.Col span={4}>
                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.textarea}
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
                                size="xs"
                                label="I agree"
                                withAsterisk
                                {...form.getInputProps("textarea")}
                            />
                        </Tooltip>

                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.autocomplete}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Autocomplete
                                label={"Autocomplete"}
                                size="xs"
                                data={[
                                    {group: "Frontend", items: ["React", "Angular"]},
                                    {group: "Backend", items: ["Express", "Django"]},
                                ]}
                                withAsterisk
                                {...form.getInputProps("autocomplete")}
                            />
                        </Tooltip>
                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.multiselect}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <MultiSelect
                                label={"Multiselect"}
                                size="xs"
                                data={["React", "Angular", "Vue", "Svelte"]}
                                clearable
                                withAsterisk
                                {...form.getInputProps("multiselect")}
                            />
                        </Tooltip>
                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.select}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Select
                                label={"select"}
                                size="xs"
                                data={["React", "Angular", "Vue", "Svelte"]}
                                clearable
                                withAsterisk
                                {...form.getInputProps("select")}
                            />
                        </Tooltip>
                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.date_input}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <DateInput
                                size="xs"
                                valueFormat="DD-M-YYYY"
                                label="Date input"
                                placeholder="DD-M-YYYY"
                                withAsterisk
                                {...form.getInputProps("date_input")}
                            />
                        </Tooltip>
                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.month_picker}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <MonthPickerInput
                                size="xs"
                                label="Pick month"
                                placeholder="Pick month"
                                {...form.getInputProps("month_picker")}
                            />
                        </Tooltip>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Tooltip
                            label={"Require"}
                            opened={!!form.errors.file}
                            px={20}
                            py={3}
                            position="top-end"
                            color="red"
                            withArrow
                            offset={2}
                            zIndex={0}
                            transitionProps={{transition: "pop-bottom-left", duration: 500}}
                        >
                            <Dropzone
                                onDrop={(files) =>
                                    form.setValues({
                                        file: files[0],
                                    })
                                }
                                onReject={(files) => console.log("rejected files", files)}
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                {...form.getInputProps("file")}
                            >
                                <Group
                                    justify="center"
                                    gap="xl"
                                    mih={220}
                                    style={{pointerEvents: "none"}}
                                >
                                    <Dropzone.Accept>
                                        <IconUpload
                                            style={{
                                                width: rem(52),
                                                height: rem(52),
                                                color: "var(--mantine-color-blue-6)",
                                            }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            style={{
                                                width: rem(52),
                                                height: rem(52),
                                                color: "var(--mantine-color-red-6)",
                                            }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPhoto
                                            style={{
                                                width: rem(52),
                                                height: rem(52),
                                                color: "var(--mantine-color-dimmed)",
                                            }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Idle>

                                    <div>
                                        <Text size="xl" inline>
                                            Drag images here or click to select files
                                        </Text>
                                        <Text size="sm" c="dimmed" inline mt={7}>
                                            Attach as many files as you like, each file should not
                                            exceed 5mb
                                        </Text>
                                    </div>
                                </Group>
                            </Dropzone>
                        </Tooltip>
                        <ScrollArea h={100} scrollbarSize={4} bg={`gray.1`}>
                            {saveFormData ? (
                                JSON.stringify(saveFormData)
                            ) : (
                                <Center h={100} bg={`gray.1`}>
                                    Data preview here
                                </Center>
                            )}
                        </ScrollArea>
                    </Grid.Col>
                </Grid>

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </Box>
        </>
    );
}

export default FormAndFile;
