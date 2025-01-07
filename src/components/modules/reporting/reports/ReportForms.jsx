import React, { forwardRef } from "react";
import { ScrollArea, Box, Grid, Text, Center } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import SelectForm from "../../../form-builders/SelectForm";
import InputForm from "../../../form-builders/InputForm";
import { useTranslation } from "react-i18next";

const ReportForms = forwardRef(
  (
    {
      setEnableTable,
      setDataLimit,
      formType,
      form,
      reports,
      selectedReport,
      setSelectedReport,
    },
    ref
  ) => {
    const { mainAreaHeight } = useOutletContext();
    const { t } = useTranslation();

    const handleReportTypeChange = (value) => {
      setSelectedReport(value);

      // Reset form with only the fields for this specific report
      const currentReport = reports[formType]?.find((r) => r.name === value);
      if (currentReport) {
        const newValues = { report_type: value };
        currentReport.fields.forEach((field) => {
          // For advance_search type, only add operator and value fields
          if (field.type === "advance_search") {
            newValues[`${field.name}_operator`] = "";
            newValues[`${field.name}_value`] = "";
          } else {
            newValues[field.name] = "";
          }
        });
        form.setValues(newValues);
      }

      if (value === "YearlyReport") {
        setDataLimit(true);
        setEnableTable(false);
      } else {
        setDataLimit(false);
        setEnableTable(true);
      }
    };

    const handleDropdownChange = (name, value) => {
      form.setFieldValue(name, value);
    };

    const renderField = (field) => {
      if (field.type === "text") {
        return (
          <Box key={field.name} mt={8}>
            <InputForm
              tooltip={t(field.label)}
              label={field.label}
              placeholder={field.label}
              required={field.required}
              name={field.name}
              form={form}
            />
          </Box>
        );
      }

      if (field.type === "dropdown") {
        const options = field.options.map((option) => ({
          value: option,
          label: option,
        }));

        return (
          <Box key={field.name} mt={8}>
            <SelectForm
              tooltip={t(field.label)}
              label={field.label}
              placeholder={field.label}
              required={field.required}
              name={field.name}
              form={form}
              changeValue={(value) => handleDropdownChange(field.name, value)}
              dropdownValue={options}
            />
          </Box>
        );
      }

      if (field.type === "advance_search") {
        return (
          <Box key={field.name} mt="lg">
            <Grid
              columns={12}
              gutter={{ base: 8 }}
              justify="center"
              align="center"
            >
              <Grid.Col span={3}>
                <Center>
                  <Text fw={400} fz="sm">
                    {field.label}
                  </Text>
                </Center>
              </Grid.Col>
              <Grid.Col span={4}>
                <SelectForm
                  tooltip={t(field.label)}
                  placeholder="Search Like"
                  required={field.required}
                  name={`${field.name}_operator`}
                  form={form}
                  changeValue={(value) =>
                    handleDropdownChange(`${field.name}_operator`, value)
                  }
                  dropdownValue={field.options.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                />
              </Grid.Col>
              <Grid.Col span={5}>
                <InputForm
                  tooltip={t(field.label)}
                  placeholder="Enter Value"
                  required={field.required}
                  name={`${field.name}_value`}
                  form={form}
                  onChange={(e) =>
                    form.setFieldValue(`${field.name}_value`, e.target.value)
                  }
                />
              </Grid.Col>
            </Grid>
          </Box>
        );
      }
      return null;
    };

    const formFields = reports[formType] || [];
    const height = mainAreaHeight - 98;

    return (
      <form>
        <ScrollArea
          h={height - 49}
          scrollbarSize={2}
          scrollbars="y"
          type="never"
        >
          <Box>
            <Box mt={8}>
              <SelectForm
                tooltip={t("SelectReportType")}
                label={t("SelectReportType")}
                placeholder={t("ChooseReportType")}
                required={true}
                name="report_type"
                form={form}
                dropdownValue={formFields.map((report) => ({
                  value: report.name,
                  label: report.name,
                }))}
                value={selectedReport}
                changeValue={handleReportTypeChange}
              />
            </Box>

            {selectedReport &&
              formFields
                .find((report) => report.name === selectedReport)
                ?.fields.map(renderField)}
          </Box>
        </ScrollArea>
      </form>
    );
  }
);

export default ReportForms;
