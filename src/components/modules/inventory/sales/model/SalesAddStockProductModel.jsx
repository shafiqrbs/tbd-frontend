import React from "react";
import {
    rem, Modal, List, ThemeIcon, useMantineTheme, Grid, ScrollArea, Box
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {
    IconCircleCheck
} from "@tabler/icons-react";

import {useDispatch, useSelector} from "react-redux";
import InputForm from "../../../../form-builders/InputForm.jsx";
import SelectForm from "../../../../form-builders/SelectForm.jsx";
import TextAreaForm from "../../../../form-builders/TextAreaForm.jsx";
import ProductForm from "../../product/ProductForm.jsx";

function SalesAddStockProductModel(props) {
    const {t, i18n} = useTranslation();
    const showEntityData = useSelector((state) => state.crudSlice.showEntityData)
    const theme = useMantineTheme();

    const closeModel = () => {
        props.setAddStockProductModel(false)
    }

    return (
        <Modal opened={props.addStockProductModel} onClose={closeModel} title={t('AddProductInformation')} size="75%" overlayProps={{
            color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.dark[8],
            opacity: 0.9,
            blur: 3,
        }}>
            <Box m={'md'}>
                <Grid columns={24}>
                    <Grid.Col span={'6'} align={'left'} fw={'600'} fz={'14'}>{t('CompanyName')}</Grid.Col>
                    <Grid.Col span={'1'}>:</Grid.Col>
                    <Grid.Col span={'auto'}>Test</Grid.Col>
                </Grid>

            </Box>

            <ProductForm />
        </Modal>

    );
}

export default SalesAddStockProductModel;
