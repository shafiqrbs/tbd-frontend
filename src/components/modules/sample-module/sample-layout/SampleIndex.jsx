import React, { useEffect, useState } from "react";
import {
    Box, Button,
    Grid, Progress, Title, Group, Burger, Menu, rem, ActionIcon
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getShowEntityData } from "../../../../store/inventory/crudSlice.js";
import SampleInvoiceItemForm from "./SampleInvoiceItemForm";
import SampleHeaderNavbar from "./SampleHeaderNavbar";
import SampleTableView from "./SampleTableView";
import PhoneNumber from "../../../form-builders/PhoneNumberInput.jsx";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";


function SampleInvoice() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const insertType = useSelector((state) => state.crudSlice.insertType)
    useEffect(() => {
        const updateProgress = () => setProgress((oldProgress) => {
            if (oldProgress === 100) return 100;
            const diff = Math.random() * 20;
            return Math.min(oldProgress + diff, 100);
        });
        const timer = setInterval(updateProgress, 100);
        return () => clearInterval(timer);
    }, []);
    const configData = useSelector((state) => state.inventoryCrudSlice.showEntityData)
    useEffect(() => {
        dispatch(getShowEntityData('inventory/config'))
    }, []);

    const form = useForm({
        initialValues: {
            mobile: '',
        },
        validate: {
            mobile: (value) => {
                if (!value) return 'MobileRequired';
                if (!/^\d+$/.test(value.replace(/[+\s]/g, ''))) return 'MobileMustBeDigit';
                return null;
            },
        },
        validateInputOnChange: true,
    });

    const handleSubmit = (values) => {
        console.log(values);
        // Here you would typically send the data to a server
    };

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200} />}
            {progress === 100 &&
                <Box>
                    <SampleHeaderNavbar
                        pageTitle={t('Domain Table')}
                        roles={t('Roles')}
                        allowZeroPercentage={configData.zero_stock}
                        currancySymbol={configData.currency.symbol}
                    />
                    <Box p={'8'}>
                        {
                            // insertType === 'create' && configData.business_model.slug === 'general' &&
                            // <SampleTableView
                            //     allowZeroPercentage={configData.zero_stock}
                            //     currancySymbol={configData.currency.symbol}
                            // />
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Grid columns={12}>
                                    <Grid.Col span={3}>
                                        <PhoneNumber
                                            name="mobile"
                                            label={t('Mobile')}
                                            placeholder={t('EnterMobile')}
                                            required
                                            form={form}
                                            value={form.values.mobile}
                                            onChange={(value) => form.setFieldValue('mobile', value)}
                                            tooltip={t('EnterMobileNumber')}
                                        />
                                    </Grid.Col>
                                </Grid>
                                <Button type="submit" mt="md">{t('Submit')}</Button>
                            </form>
                        }
                    </Box>
                </Box>
            }
        </>
    );
}

export default SampleInvoice;
