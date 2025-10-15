import React, {useState} from "react";
import {
    Modal,
    Button,
    FocusTrap,
    Grid
} from "@mantine/core";
import {useTranslation} from 'react-i18next';
import {IconPlus} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";
import {isNotEmpty, useForm} from "@mantine/form";

function CreateProductionBatchWarehouse({productionBatchCreateModel,setProductionBatchCreateModel}) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    const CallProductionBatchCreateApi = (event,data) => {
        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
        axios({
            method: 'POST',
            url: `${import.meta.env.VITE_API_GATEWAY_URL + 'production/batch'}`,
            headers: {
                "Accept": `application/json`,
                "Content-Type": `application/json`,
                "Access-Control-Allow-Origin": '*',
                "X-Api-Key": import.meta.env.VITE_API_KEY,
                "X-Api-User": JSON.parse(localStorage.getItem('user')).id
            },
            data: data
        })
            .then(res => {
                if (res.data.status === 200) {
                    navigate('/production/batch/' + res.data.data.id)
                }
            })
            .catch(function (error) {
                console.log(error)
                alert(error)
            })
    }

    let warehouseDropdownData = getCoreWarehouseDropdownData();
    const [warehouseData, setWarehouseData] = useState(null);

    const form = useForm({
        initialValues: {
            warehouse_id: ""
        },
        validate: {
            warehouse_id: isNotEmpty()
        },
    });

    const handleFormSubmit = (values) => {
        let data = {
            warehouse_id : values.warehouse_id,
            mode: 'in-house'
        }
        CallProductionBatchCreateApi(data,data)
    }

    return (
        <>
            <Modal
                opened={productionBatchCreateModel}
                onClose={() => setProductionBatchCreateModel(false)}
                title={
                    <h4 fz={'md'} className="text-gray-800">
                        {t("ChooseProductionWarehouse")}
                    </h4>
                }
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <FocusTrap.InitialFocus />

                <form
                    onSubmit={form.onSubmit(handleFormSubmit)}
                    className="flex flex-col items-center gap-6 mt-2"
                >

                    <div className="w-full">
                        <Grid columns={24} gutter={{ base: 8 }}>
                            <Grid.Col span={16}>
                                <SelectForm
                                    tooltip={t("Warehouse")}
                                    label=""
                                    placeholder={t("Warehouse")}
                                    required={false}
                                    nextField="purchase_price"
                                    name="warehouse_id"
                                    form={form}
                                    dropdownValue={warehouseDropdownData}
                                    id="warehouse_id"
                                    searchable
                                    value={warehouseData}
                                    changeValue={setWarehouseData}
                                />
                            </Grid.Col>
                            <Grid.Col span={8}>
                                <Button
                                    size="sm"
                                    type="submit"
                                    id="EntityFormSubmit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
                                    leftSection={<IconPlus size={16} />}
                                >
                                    <span className="text-sm font-medium">{t("Process")}</span>
                                </Button>
                            </Grid.Col>
                        </Grid>

                    </div>


                </form>
            </Modal>
        </>
    );
}

export default CreateProductionBatchWarehouse;
