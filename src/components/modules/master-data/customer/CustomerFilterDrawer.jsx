import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {
    Button,
    Group,
    rem,
    Text,
    Tooltip,
    Box,
    ScrollArea,
    Title,
    TextInput, SimpleGrid, List, ColorInput, Select, ThemeIcon, Switch, Textarea, Modal, LoadingOverlay,
} from "@mantine/core";
import {useTranslation} from "react-i18next";

import {
    IconCircleCheck,
    IconFilter, IconEyeSearch,
    IconUserCircle, IconInfoCircle, IconList, IconPlus, IconEyeClosed, IconX, IconXboxX
} from "@tabler/icons-react";
import {getHotkeyHandler, useDisclosure, useViewportSize} from "@mantine/hooks";

import axios from "axios";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine component features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import {useMemo} from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {hasLength, useForm} from "@mantine/form";

function CustomerFilterDrawer(props) {
    const {openedModel,open,close} = props
    const iconStyle = {width: rem(12), height: rem(12)};
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();

    const [modelSubmit,setModelSubmit] = useState(false)


    const formModal = useForm({
        initialValues: {
             customer_group_name:'', customer_group_status:''
        },
        validate: {
            customer_group_name: hasLength({min: 2, max: 20}),
            customer_group_status: hasLength({min: 11, max: 11}),

        },
    });

    return (
        <>
            <Drawer.Root opened={opened} onClose={close}>
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title>Drawer title</Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
                    <Drawer.Body>Drawer content</Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        </>
    );
}

export default CustomerFilterDrawer;
