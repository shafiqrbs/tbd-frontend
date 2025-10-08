import {
    Box,
    Grid,
    Button,
    Text, SimpleGrid, Card,
} from "@mantine/core";
import {useTranslation} from "react-i18next";
import DatePickerForm from "../../../form-builders/DatePicker";
import genericClass from "../../../../assets/css/Generic.module.css";
import SelectForm from "../../../form-builders/SelectForm";
import TextAreaForm from "../../../form-builders/TextAreaForm";
import {
    IconCalendar,
    IconRefresh,
    IconStackPush,
    IconPrinter,
    IconReceipt,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import getCoreWarehouseDropdownData from "../../../global-hook/dropdown/core/getCoreWarehouseDropdownData.js";

export default function __RequistionInvoiceSection(props) {
    const {
        form,
        currencySymbol,
        handleClick,
        vendorData,
        setVendorData,
        vendorObject,
        vendorsDropdownData,
        isWarehouse
    } = props;
    const {t} = useTranslation();


    let warehouseDropdownData = getCoreWarehouseDropdownData();
    const [warehouseData, setWarehouseData] = useState(null);

    useEffect(() => {
        form.setFieldValue("vendor_id", vendorData);
    }, [vendorData])
    return (
        <>
            <Box>
                <SimpleGrid cols={{base: 1, md: 3}} mt={'2'} spacing="xs" mb={"xs"}>
                    <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                          padding="xs">
                        {isWarehouse === 1 &&
                            <Box>
                                <Grid gutter={{base: 6}} mt={8}>
                                    <Grid.Col span={12}>
                                        <SelectForm
                                            tooltip={t("ChooseVendor")}
                                            label=""
                                            placeholder={t("ChooseVendor")}
                                            required={false}
                                            nextField="warehouse_id"
                                            name="vendor_id"
                                            form={form}
                                            dropdownValue={vendorsDropdownData}
                                            id="vendor_id"
                                            mt={1}
                                            searchable={true}
                                            value={vendorData}
                                            changeValue={setVendorData}
                                            disabled={true}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>
                        }
                        <Box className={"borderRadiusAll"}>
                            <Grid columns={18} gutter={{base: 2}} pt={"xs"}>
                                <Grid.Col span={8}>
                                    <Text
                                        pl={"xs"}
                                        className={genericClass.genericPrimaryFontColor}
                                        fz={"xs"}
                                    >
                                        {t("Outstanding")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Text fz={"sm"} order={1} fw={"800"}>
                                        {currencySymbol + " "}
                                        {vendorObject && vendorObject?.balance
                                            ? Number(vendorObject.balance).toFixed(2)
                                            : "0.00"}
                                    </Text>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={18} gutter={{base: 2}} pt={"xs"}>
                                <Grid.Col span={8}>
                                    <Text ta="left" size="xs" pl={"xs"}>
                                        {t("Discount")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Text ta="left" size="sm">
                                        {" "}
                                        {currencySymbol} {vendorObject && vendorObject?.discount
                                        ? Number(vendorObject.discount).toFixed(2)
                                        : "0.00"}
                                    </Text>
                                </Grid.Col>

                            </Grid>

                        </Box>
                    </Card>
                    <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                          padding="xs">
                        <Box className={"borderRadiusAll"}>
                            <Box>
                                <Grid gutter={{base: 6}} mt={8}>
                                    <Grid.Col span={12}>
                                        <SelectForm
                                            tooltip={t("ChooseWarehouse")}
                                            label=""
                                            placeholder={t("ChooseWarehouse")}
                                            required={false}
                                            nextField={"invoice_date"}
                                            name={"warehouse_id"}
                                            form={form}
                                            dropdownValue={warehouseDropdownData}
                                            id={"warehouse_id"}
                                            mt={1}
                                            searchable={true}
                                            value={warehouseData}
                                            changeValue={setWarehouseData}
                                        />
                                    </Grid.Col>
                                </Grid>
                            </Box>
                            <Grid columns={18} gutter={{base: 2}} pt={"xs"}>
                                <Grid.Col span={8} pt={2}>
                                    <Text ta="left" size="xs" pl={"xs"}>
                                        {t("Purchase")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Text ta="left" size="sm">
                                        {" "}
                                        {currencySymbol} {vendorObject && vendorObject?.purchase
                                        ? Number(vendorObject.purchase).toFixed(2)
                                        : "0.00"}
                                    </Text>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={18} gutter={{base: 2}} pt={"xs"}>
                                <Grid.Col span={8}>
                                    <Text ta="left" size="xs" pl={"xs"}>
                                        {t("Payment")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Text ta="left" size="sm">
                                        {" "}
                                        {currencySymbol} {vendorObject && vendorObject?.payment
                                        ? Number(vendorObject.payment).toFixed(2)
                                        : "0.00"}
                                    </Text>
                                </Grid.Col>
                            </Grid>
                            <Grid columns={18} gutter={{base: 2}} pt={"xs"}>
                                <Grid.Col span={8}>
                                    <Text ta="left" size="xs" pl={"xs"}>
                                        {t("CreditLimit")}
                                    </Text>
                                </Grid.Col>
                                <Grid.Col span={10}>
                                    <Text ta="left" size="sm">
                                        {" "}
                                        {currencySymbol} {vendorObject && vendorObject?.credit_limit
                                        ? Number(vendorObject.credit_limit).toFixed(2)
                                        : "0.00"}
                                    </Text>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    </Card>
                    <Card shadow="md" radius="4" className={`${classes.card} ${genericClass.genericBackground}`}
                          padding="xs">
                        <Box>
                            <Box>
                                <DatePickerForm
                                    tooltip={t("SelectInvoiceDate")}
                                    label=""
                                    placeholder={t("InvoiceDate")}
                                    required={true}
                                    nextField={"expected_date"}
                                    form={form}
                                    name={"invoice_date"}
                                    id={"invoice_date"}
                                    leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                    closeIcon={true}
                                />
                            </Box>
                            <Box mt={4}>
                                <DatePickerForm
                                    tooltip={t("SelectExpectedDate")}
                                    label=""
                                    placeholder={t("ExpectedDate")}
                                    required={true}
                                    nextField={"narration"}
                                    form={form}
                                    name={"expected_date"}
                                    id={"expected_date"}
                                    disable={true}
                                    leftSection={<IconCalendar size={16} opacity={0.5}/>}
                                    closeIcon={true}
                                />
                            </Box>
                            <Box pt={4}>
                                <TextAreaForm
                                    size="xs"
                                    tooltip={t("NarrationValidateMessage")}
                                    label=""
                                    placeholder={t("Narration")}
                                    required={false}
                                    nextField={"save"}
                                    name={"narration"}
                                    form={form}
                                    id={"narration"}
                                />
                            </Box>
                        </Box>

                    </Card>
                </SimpleGrid>
                <Box mt={"8"} pb={"xs"} pr={"xs"}>
                    <Button.Group>
                        <Button
                            fullWidth={true}
                            variant="filled"
                            leftSection={<IconRefresh size={14}/>}
                            className={genericClass.invoiceReset}
                        >
                            {t("Reset")}
                        </Button>
                        <Button
                            fullWidth={true}
                            variant="filled"
                            leftSection={<IconStackPush size={14}/>}
                            className={genericClass.invoiceHold}
                        >
                            {t("Hold")}
                        </Button>
                        <Button
                            fullWidth={true}
                            variant="filled"
                            type={"submit"}
                            onClick={handleClick}
                            name="print"
                            leftSection={<IconPrinter size={14}/>}
                            className={genericClass.invoicePrint}
                            style={{
                                transition: "all 0.3s ease",
                            }}
                        >
                            {t("Print")}
                        </Button>
                        <Button
                            fullWidth={true}
                            type={"submit"}
                            onClick={handleClick}
                            name="pos"
                            variant="filled"
                            leftSection={<IconReceipt size={14}/>}
                            className={genericClass.invoicePos}
                            style={{
                                transition: "all 0.3s ease",
                            }}
                        >
                            {t("Pos")}
                        </Button>
                        <Button
                            fullWidth={true}
                            className={genericClass.invoiceSave}
                            type={"submit"}
                            onClick={handleClick}
                            name="save"
                            variant="filled"
                            leftSection={<IconDeviceFloppy size={14}/>}
                            style={{
                                transition: "all 0.3s ease",
                            }}
                        >
                            {t("Save")}
                        </Button>
                    </Button.Group>
                </Box>
            </Box>
        </>
    );
}
