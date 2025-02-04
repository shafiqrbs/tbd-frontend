import React, { forwardRef } from "react";
import {
  ScrollArea,
  Box,
  Grid,
  Text,
  NativeSelect,
  Select,
} from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import SelectForm from "../../../form-builders/SelectForm";
import InputForm from "../../../form-builders/InputForm";
import { useTranslation } from "react-i18next";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm";

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
      // console.log(selectedReport);
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
          }
          // if (field.type === "input") {
          //   newValues[`${field.name}_operator`] = "";
          //   newValues[`${field.name}_value`] = "";
          // }
          else {
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
      if (field.type === "advance_search") {
        return (
          <Box key={field.name} mt="lg">
            <Grid
              columns={12}
              gutter={{ base: 8 }}
              justify="center"
              align="center"
            >
              <Grid.Col span={4}>
                <Select
                  placeholder="Search Like"
                  label={t(field.label)}
                  data={field.options.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  required={field.required}
                  onChange={(value) =>
                    handleDropdownChange(`${field.name}_value`, value)
                  }
                ></Select>
              </Grid.Col>
              <Grid.Col span={8}>
                <Select
                  placeholder="Options"
                  label={" "}
                  data={field.drop_down.map((drop_down) => ({
                    value: drop_down,
                    label: drop_down,
                  }))}
                  required={field.required}
                  onChange={(value) =>
                    handleDropdownChange(`${field.name}_operator`, value)
                  }
                ></Select>
              </Grid.Col>
            </Grid>
          </Box>
        );
      }
      if (field.type === "input") {
        return (
          <Box key={field.name} mt="lg">
            <Grid
              columns={12}
              gutter={{ base: 8 }}
              justify="center"
              align="center"
            >
              <Grid.Col span={4}>
                <Select
                  placeholder="Search Like"
                  label={t(field.label)}
                  data={field.options.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  required={field.required}
                  onChange={(value) =>
                    handleDropdownChange(`${field.name}_operator`, value)
                  }
                ></Select>
              </Grid.Col>
              <Grid.Col span={8}>
                <InputForm
                  label={" "}
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
    // console.log("selected Report", selectedReport);
    // console.log(" formfields ", formFields[1].name);
    // console.log(formFields[1].name === selectedReport);

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
