import {
  Box,
  ScrollArea,
  Grid,
  Title,
  Flex,
  Button,
  Text,
} from "@mantine/core";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { IconDeviceFloppy } from "@tabler/icons-react";
import __InventoryReport from "./__InventoryReport.jsx";
import __SalesReport from "./__SalesReport";
import __AccountingReport from "./__AccountingReport";
import __PurchaseReport from "./__PurchaseReport";
import DynamicForm from "./DynamicForm.jsx";
import ReportForms from "./ReportForms.jsx";
import { useForm } from "@mantine/form";

export default function _ReportBox(props) {
  const {
    salesReport,
    inventoryReport,
    purchaseReport,
    accountingReport,
    setEnableTable,
    setDataLimit,
  } = props;
  const { mainAreaHeight, isOnline } = useOutletContext();
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const height = mainAreaHeight - 98;

  const inventorySubmitRef = useRef();
  const salesSubmitRef = useRef();
  const purchaseSubmitRef = useRef();
  const accountingSubmitRef = useRef();
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (inventoryReport && inventorySubmitRef.current) {
      inventorySubmitRef.current.submitForm();
    } else if (salesReport && salesSubmitRef.current) {
      salesSubmitRef.current.submitForm();
    } else if (purchaseReport && purchaseSubmitRef.current) {
      purchaseSubmitRef.current.submitForm();
    } else if (accountingReport && accountingSubmitRef.current) {
      accountingSubmitRef.current.submitForm();
    }
  };
  const schema = {
    SalesReportForm: [
      {
        type: "text",
        label: "My name",
        name: "customer",
        required: true,
      },
      {
        type: "dropdown",
        label: "Month",
        name: "month",
        options: ["January", "February", "March"],
        required: true,
      },
      {
        type: "dropdown",
        label: "Year",
        name: "year",
        options: ["2021", "2022", "2023"],
        required: true,
      },
      {
        type: "dropdown",
        label: "Format",
        name: "format",
        options: ["PDF", "Excel", "CSV"],
        required: true,
      },
    ],
    PurchaseReportForm: [
      { type: "text", label: "Vendor Name", name: "vendor", required: true },
      {
        type: "dropdown",
        label: "Month",
        name: "month",
        options: ["January", "February", "March"],
        required: true,
      },
      {
        type: "dropdown",
        label: "Year",
        name: "year",
        options: ["2021", "2022", "2023"],
        required: true,
      },
      {
        type: "dropdown",
        label: "Format",
        name: "format",
        options: ["PDF", "Excel", "CSV"],
        required: true,
      },
    ],
  };

  const form = useForm({
    initialValues: schema.SalesReportForm.reduce((acc, field) => {
      acc[field.name] = ""; // Initialize each field to an empty string
      return acc;
    }, {}),
    validate: schema.SalesReportForm.reduce((acc, field) => {
      if (field.required) {
        acc[field.name] = (value) =>
          value ? null : `${field.label} is required`;
      }
      return acc;
    }, {}),
  });
  return (
    <>
      <Box p={"xs"} pt={"0"} className={"borderRadiusAll"}>
        <Box
          pl={`xs`}
          pr={8}
          pt={"6"}
          pb={"6"}
          mb={"4"}
          mt={"xs"}
          className={"boxBackground borderRadiusAll"}
        >
          <Grid>
            <Grid.Col span={9}>
              <Title order={6} pl={"6"}>
                {t("ReportFormat")}
              </Title>
            </Grid.Col>
          </Grid>
        </Box>
        <Box bg={"white"}>
          <Box pl={"xs"} pr={"xs"} className={"borderRadiusAll"}>
            {inventoryReport && (
              // <__InventoryReport
              //   setDataLimit={setDataLimit}
              //   ref={inventorySubmitRef}
              //   setEnableTable={setEnableTable}
              // />
              // <DynamicForm schema={schema} formType="SalesReportForm" />
              <ReportForms
                setDataLimit={setDataLimit}
                ref={inventorySubmitRef}
                setEnableTable={setEnableTable}
                schema={schema}
                formType="SalesReportForm"
                form={form}
              />
            )}
            {salesReport && (
              // <__SalesReport
              //   ref={salesSubmitRef}
              //   setDataLimit={setDataLimit}
              //   setEnableTable={setEnableTable}
              // />
              <ReportForms
                setDataLimit={setDataLimit}
                ref={salesSubmitRef}
                setEnableTable={setEnableTable}
                schema={schema}
                formType="PurchaseReportForm"
                form={form}
              />
            )}
            {/* {accountingReport && (
              <__AccountingReport
                ref={accountingSubmitRef}
                setDataLimit={setDataLimit}
                setEnableTable={setEnableTable}
              />
            )}
            {purchaseReport && (
              <__PurchaseReport
                ref={purchaseSubmitRef}
                setDataLimit={setDataLimit}
                setEnableTable={setEnableTable}
              />
            )} */}
          </Box>
          <Box mt={4}>
            <Box bg={"white"}>
              <Box
                pl={`xs`}
                pr={8}
                pt={"10"}
                pb={"xs"}
                className={"boxBackground borderRadiusAll"}
              >
                <Flex direction={"row"} gap={"xs"} justify="flex-end">
                  {!saveCreateLoading && isOnline && (
                    <Button
                      size="xs"
                      color={"green.8"}
                      onClick={() => {
                        handleSubmit();
                      }}
                      id="EntityFormSubmits"
                      leftSection={<IconDeviceFloppy size={16} />}
                    >
                      <Flex direction={"column"} gap={0}>
                        <Text fz={14} fw={400}>
                          {t("CreateReport")}
                        </Text>
                      </Flex>
                    </Button>
                  )}
                </Flex>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
