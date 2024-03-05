import React from "react";
import {
    Grid
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {useSelector} from "react-redux";

import VendorTable from "./VendorTable";
import VendorForm from "./VendorForm";
import VendorUpdateForm from "./VendorUpdateForm.jsx";

function VendorIndex() {
    const {t, i18n} = useTranslation();

    const insertType = useSelector((state) => state.crudSlice.insertType)

    return (

        <div>
            <Grid>
                <Grid.Col span={8}>
                    <VendorTable/>
                </Grid.Col>
                <Grid.Col span={4}>
                    {
                        insertType === 'create'?<VendorForm/>:<VendorUpdateForm />
                    }
                </Grid.Col>
            </Grid>
        </div>

    );
}

export default VendorIndex;
