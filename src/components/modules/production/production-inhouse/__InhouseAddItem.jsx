import React, {useEffect, useState} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {
    Grid,
    Box,
    Button,
    Text, rem,
} from "@mantine/core";
import { useTranslation } from 'react-i18next';
import { useHotkeys } from "@mantine/hooks";
import SelectForm from "../../../form-builders/SelectForm";
import { isNotEmpty, useForm } from "@mantine/form";
import InputForm from "../../../form-builders/InputForm.jsx";
import getProItemDropdownData from "../../../global-hook/dropdown/getProItemDropdownData.js";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";
import {storeEntityData} from "../../../../store/production/crudSlice.js";
import {useDispatch} from "react-redux";

function __InhouseAddItem(props) {
    const {setReloadBatchItemTable} = props
    let { id } = useParams();
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    const { isOnline } = useOutletContext();

    const [productionItemData, setProductionItemData] = useState(null);
    const productionItemDropdown = getProItemDropdownData()


    const form = useForm({
        initialValues: {
            production_item_id: '',
            issue_quantity: '',
            receive_quantity: '',
            damage_quantity: '',
        },
        validate: {
            production_item_id: isNotEmpty(),
            issue_quantity: isNotEmpty(),
            receive_quantity: isNotEmpty(),
        }
    })

    useEffect(() => {
        form.setFieldValue('receive_quantity',form.values.issue_quantity)
    }, [form.values.issue_quantity]);

    useHotkeys(
        [['alt+F', () => {
            document.getElementById('production_item_id').focus();
        }]
        ], []
    );

    return (
        <>
            <Box >
                <Grid columns={24} gutter={{ base: 8 }}>
                    <Grid.Col span={24} >
                        <Box bg={'white'}  >
                            <form onSubmit={form.onSubmit((values) => {
                                values.batch_id = id

                                if (values && id) {
                                    const data = {
                                        url: 'production/batch/create-batch-item',
                                        data: values
                                    }
                                    dispatch(storeEntityData(data))
                                    notifications.show({
                                        color: 'teal',
                                        title: t('CreateSuccessfully'),
                                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                        loading: false,
                                        autoClose: 700,
                                        style: { backgroundColor: 'lightgray' },
                                    });
                                    setProductionItemData(null)
                                    form.reset()
                                    setReloadBatchItemTable(true)
                                } else {
                                    notifications.show({
                                        color: 'red',
                                        title: t('Error'),
                                        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
                                        loading: false,
                                        autoClose: 700,
                                        style: { backgroundColor: 'lightgray' },
                                    });
                                }
                            })}>
                                <Box pl={`xs`} pr={8} pt={'xs'} pb={'xs'} className={'boxBackground borderRadiusAll'}>
                                    <Grid columns={24} gutter={{ base: 6 }}>
                                        <Grid.Col span={12}>
                                            <SelectForm
                                                tooltip={t('SelectProductionItem')}
                                                placeholder={t('SelectProductionItem')}
                                                required={true}
                                                name={'production_item_id'}
                                                form={form}
                                                dropdownValue={productionItemDropdown}
                                                searchable={true}
                                                changeValue={setProductionItemData}
                                                value={productionItemData}
                                                mt={0}
                                                id={'production_item_id'}
                                                nextField={'issue_quantity'}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box>
                                                <InputForm
                                                    tooltip={t('Issue')}
                                                    placeholder={t('Issue')}
                                                    required={false}
                                                    nextField={'receive_quantity'}
                                                    name={'issue_quantity'}
                                                    form={form}
                                                    id={'issue_quantity'}
                                                />
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box>
                                                <InputForm
                                                    tooltip={t('Receive')}
                                                    placeholder={t('Receive')}
                                                    required={false}
                                                    nextField={'damage_quantity'}
                                                    name={'receive_quantity'}
                                                    form={form}
                                                    id={'receive_quantity'}
                                                />

                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box>
                                                <InputForm
                                                    tooltip={t('Damage')}
                                                    placeholder={t('Damage')}
                                                    required={false}
                                                    nextField={'AddItemSubmit'}
                                                    name={'damage_quantity'}
                                                    form={form}
                                                    id={'damage_quantity'}
                                                />
                                            </Box>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Box>
                                                {isOnline &&
                                                    <Button
                                                        size="sm"
                                                        color={`red.6`}
                                                        type="submit"
                                                        mt={0}
                                                        mr={'xs'}
                                                        w={'100%'}
                                                        id="AddItemSubmit"
                                                    >
                                                        <Text fz={12} fw={400}>
                                                            {t("AddItem")}
                                                        </Text>
                                                    </Button>
                                                }
                                            </Box>
                                        </Grid.Col>
                                    </Grid>
                                </Box>
                            </form>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box >
        </>
    );
}

export default __InhouseAddItem;