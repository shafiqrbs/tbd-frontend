import React from "react";
import {
    Drawer, Button,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { setFetching } from "../../../../store/production/crudSlice.js";
import { useDispatch } from "react-redux";
import ProductionSettingFilterForm from "../settings/__ProductionSettingFilterForm.jsx";

function FilterDrawer(props) {
    const { t, i18n } = useTranslation();

    const dispatch = useDispatch();

    const closeModel = () => {
        props.setFilterDrawer(false)
    }

    return (

        <Drawer opened={props.filterDrawer} position="right" onClose={closeModel} title={t('FilterData')}>
            {props.module === 'production-setting' && <ProductionSettingFilterForm module={props.module} />}
            <Button
                id={'submit'}
                mt={8}
                p={'absolute'}
                right
                variant="filled"
                onClick={() => {
                    dispatch(setFetching(true))
                    closeModel()
                }}
            >
                {t('Submit')}
            </Button>
        </Drawer>
    );
}

export default FilterDrawer;
