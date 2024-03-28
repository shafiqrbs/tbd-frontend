import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Grid, Progress, Title,Group,Burger,Menu,rem,ActionIcon
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {getShowEntityData} from "../../../../store/inventory/crudSlice.js";
import DomainHeaderNavbar from "./DomainHeaderNavbar";
import DomainFormView from "./DomainFrom";
import CategoryUpdateForm from "../../inventory/category/CategoryUpdateForm";
import {setInsertType} from "../../../../store/inventory/crudSlice";
import {setSearchKeyword} from "../../../../store/core/crudSlice";
function DomainIndex() {
    const {t, i18n} = useTranslation();
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

    useEffect(() => {
        dispatch(setInsertType('create'))
        dispatch(setSearchKeyword(''))
    }, [])

    return (
        <>
            {progress !== 100 &&
                <Progress color="red" size={"xs"} striped animated value={progress} transitionDuration={200}/>}
            {progress === 100 &&
                <Box>
                    <DomainHeaderNavbar
                        pageTitle = {t('Domain')}
                        roles = {t('roles')}
                    />
                    <Box p={'8'}>
                        {
                            insertType === 'create' ?  <DomainFormView/> : <CategoryUpdateForm/>
                        }
                    </Box>
                </Box>
            }
        </>
    );
}

export default DomainIndex;
