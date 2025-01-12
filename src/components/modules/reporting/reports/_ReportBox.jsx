import { Box, Grid, Title, Flex, Button, Text } from "@mantine/core";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { IconDeviceFloppy } from "@tabler/icons-react";
import ReportForms from "./ReportForms";
import { useForm } from "@mantine/form";

const REPORT_SCHEMAS = {
  SalesReportForm: [
    {
      name: "Report One",
      fields: [
        {
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
      ],
    },
    {
      name: "Report Two",
      fields: [
        {
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
      ],
    },
    {
      name: "Report Three",
      fields: [
        {
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
          label: "Year",
          name: "year",
          options: ["2021", "2022", "2023"],
          required: true,
        },
        {
          label: "Format",
          name: "format",
          options: ["PDF", "Excel", "CSV"],
          required: true,
        },
      ],
    },
  ],
  PurchaseReportForm: [
    {
      name: "Report One",
      fields: [
        {
          label: "My name",
          name: "customer",
          required: true,
        },
        {
          label: "Month",
          name: "month",
          options: ["January", "February", "March"],
          required: true,
        },
      ],
    },
    {
      name: "Report Two",
      fields: [
        {
          label: "My name",
          name: "customer",
          required: true,
        },
        {
          label: "Month",
          name: "month",
          options: ["January", "February", "March"],
          required: true,
        },
        {
          label: "Year",
          name: "year",
          options: ["2021", "2022", "2023"],
          required: true,
        },
      ],
    },
    {
      name: "Report Three",
      fields: [
        {
          label: "My name",
          name: "customer",
          required: true,
        },
        {
          label: "Month",
          name: "month",
          options: ["January", "February", "March"],
          required: true,
        },
        {
          label: "Year",
          name: "year",
          options: ["2021", "2022", "2023"],
          required: true,
        },
        {
          label: "Format",
          name: "format",
          options: ["PDF", "Excel", "CSV"],
          required: true,
        },
      ],
    },
  ],
  InventoryReportForm: [
    {
      name: "Inventory Report One",
      fields: [
        {
          label: "Product",
          name: "product",
          options: [
            "=",
            "<",
            ">",
            "<=",
            ">=",
            "!=",
            "LIKE",
            "LIKE %%",
            "REGEXP",
            "IN",
            "FIND_IN_SET",
            "IS NULL",
            "NOT LIKE",
            "NOT REGEXP",
            "NOT IN",
            "IS NOT NULL",
            "SQL",
          ],
          required: false,
        },
        {
          label: "Category",
          name: "category",
          options: ["Electronics", "Clothing", "Food"],
          required: true,
        },
        {
          label: "Report Period",
          name: "period",
          options: ["Daily", "Weekly", "Monthly"],
          required: true,
        },
      ],
    },
    {
      name: "Inventory Report Two",
      fields: [
        {
          label: "Product Name",
          name: "product",
          required: true,
        },
        {
          label: "Location",
          name: "location",
          options: ["Warehouse A", "Warehouse B", "Store Front"],
          required: true,
        },
        {
          label: "Report Type",
          name: "reportType",
          options: ["Stock Level", "Movement", "Valuation"],
          required: true,
        },
        {
          label: "Format",
          name: "format",
          options: ["PDF", "Excel", "CSV"],
          required: true,
        },
      ],
    },
  ],
  AccountingReportForm: [
    {
      name: "Financial Statement",
      fields: [
        {
          label: "Statement Type",
          name: "statementType",
          options: ["Balance Sheet", "Income Statement", "Cash Flow"],
          required: true,
        },
        {
          label: "Period",
          name: "period",
          options: ["Monthly", "Quarterly", "Yearly"],
          required: true,
        },
        {
          label: "Year",
          name: "year",
          options: ["2021", "2022", "2023"],
          required: true,
        },
      ],
    },
    {
      name: "Tax Report",
      fields: [
        {
          label: "Tax Type",
          name: "taxType",
          options: ["VAT", "Income Tax", "Sales Tax"],
          required: true,
        },
        {
          label: "Quarter",
          name: "quarter",
          options: ["Q1", "Q2", "Q3", "Q4"],
          required: true,
        },
        {
          label: "Year",
          name: "year",
          options: ["2021", "2022", "2023"],
          required: true,
        },
        {
          label: "Format",
          name: "format",
          options: ["PDF", "Excel", "CSV"],
          required: true,
        },
      ],
    },
  ],
};

const ReportBox = ({
  salesReport,
  inventoryReport,
  purchaseReport,
  accountingReport,
  setEnableTable,
  setDataLimit,
}) => {
  const { isOnline } = useOutletContext();
  const { t } = useTranslation();
  const formRef = useRef();
  const [selectedReport, setSelectedReport] = useState(null);

  let formType = null;
  if (inventoryReport) formType = "InventoryReportForm";
  else if (salesReport) formType = "SalesReportForm";
  else if (purchaseReport) formType = "PurchaseReportForm";
  else if (accountingReport) formType = "AccountingReportForm";

  const form = useForm({
    initialValues: { report_type: "" },
  });

  // Reset everything when form type changes
  useEffect(() => {
    setSelectedReport(null);
    form.reset();
  }, [formType]);

  const handleSubmit = () => {
    console.log("Form Values:", form.values);
  };

  return (
    <Box p="xs" pt="0" className="borderRadiusAll">
      <Box
        pl="xs"
        pr={8}
        pt={6}
        pb={6}
        mb={4}
        mt="xs"
        className="boxBackground borderRadiusAll"
      >
        <Grid>
          <Grid.Col span={9}>
            <Title order={6} pl={6}>
              {selectedReport || t("ReportFormat")}
            </Title>
          </Grid.Col>
        </Grid>
      </Box>

      <Box bg="white">
        <Box pl="xs" pr="xs" className="borderRadiusAll">
          {formType && (
            <ReportForms
              ref={formRef}
              setDataLimit={setDataLimit}
              setEnableTable={setEnableTable}
              reports={REPORT_SCHEMAS}
              selectedReport={selectedReport}
              setSelectedReport={setSelectedReport}
              formType={formType}
              form={form}
            />
          )}
        </Box>

        <Box mt={4}>
          <Box bg="white">
            <Box
              pl="xs"
              pr={8}
              pt={10}
              pb="xs"
              className="boxBackground borderRadiusAll"
            >
              <Flex direction="row" gap="xs" justify="flex-end">
                {isOnline && (
                  <Button
                    size="xs"
                    color="green.8"
                    onClick={handleSubmit}
                    id="EntityFormSubmits"
                    leftSection={<IconDeviceFloppy size={16} />}
                  >
                    <Text fz={14} fw={400}>
                      {t("CreateReport")}
                    </Text>
                  </Button>
                )}
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportBox;
