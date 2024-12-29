import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { ScrollArea, Box, Grid, Text } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import SelectForm from "../../../form-builders/SelectForm";
import { isNotEmpty, useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import InputForm from "../../../form-builders/InputForm";
import { IconCalendar, IconUserCircle } from "@tabler/icons-react";
import DatePickerForm from "../../../form-builders/DatePicker";

const ReportForms = forwardRef((props, ref) => {
  const { setEnableTable, setDataLimit, schema, formType, form } = props;
  const { mainAreaHeight, isOnline } = useOutletContext();
  const { t } = useTranslation();
  const height = mainAreaHeight - 98;

  const formRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      formRef.current?.requestSubmit();
    },
  }));
  const data = [
    { id: 1, value: "MonthlyReport" },
    { id: 2, value: "YearlyReport" },
  ];
  const [nameDropdown, setNameDropdown] = useState(null);

  const fields = schema[formType];
  const [reportType, setReportType] = useState(null);
  useEffect(() => {
    reportType === "YearlyReport"
      ? (setDataLimit(true), setEnableTable(false))
      : (setDataLimit(false), setEnableTable(true));
  }, [reportType]);
  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit((values) =>
        console.log(`${formType} Submitted`, values)
      )}
    >
      <ScrollArea h={height - 46} scrollbarSize={2} scrollbars="y" type="never">
        <Box>
          <Box>
            {fields.map((field) => {
              const dropdownOptions = Array.isArray(field.options)
                ? field.options.map((option) => ({
                    value: option,
                    label: option,
                  }))
                : [];
              if (field.type === "text") {
                return (
                  <Box mt={"8"}>
                    <InputForm
                      tooltip={t(`${field.label}`)}
                      key={field.name}
                      label={field.label}
                      placeholder={field.label}
                      required={field.required}
                      name={field.name}
                      id={field.name}
                      form={form}
                    />
                  </Box>
                );
              }
              if (field.type === "dropdown") {
                if (!Array.isArray(field.options)) {
                  console.error(
                    `Expected an array for options in field "${field.name}", got:`,
                    typeof field.options,
                    field.options
                  );
                  return null; // Avoid rendering if options are invalid
                }

                const dropdownOptions = field.options.map((option) => ({
                  value: option,
                  label: option,
                }));
                const [value, setValue] = useState(null);
                return (
                  <Box mt={"8"}>
                    <SelectForm
                      tooltip={t(`${field.label}`)}
                      key={field.name}
                      label={field.label}
                      placeholder={field.label}
                      required={field.required}
                      name={field.name}
                      id={field.name}
                      form={form}
                      dropdownValue={dropdownOptions}
                      value={value}
                      changeValue={setValue}
                    />
                  </Box>
                );
              }
              return null;
            })}
          </Box>
          {/* <Box mt={"8"}>
            <SelectForm
              tooltip={t("ReportType")}
              label={t("ReportType")}
              placeholder={t("ChooseReportType")}
              required={true}
              nextField={""}
              name={"report_type"}
              form={form}
              dropdownValue={report_Type}
              mt={8}
              id={"report_type"}
              searchable={false}
              value={reportType}
              changeValue={setReportType}
            />
          </Box>
          <Box mt={"8"}>
            <Grid columns={15} gutter={{ base: 8 }}>
              <Grid.Col span={3}>
                <Text ta={"left"} fw={600} fz={"sm"} mt={"8"}>
                  {t("Name")}
                </Text>
              </Grid.Col>

              <Grid.Col span={5}>
                <SelectForm
                  tooltip={t("SelectSearchLikeValue")}
                  form={form}
                  searchable
                  name="name_dropdown"
                  id="name_dropdown"
                  label=""
                  nextField="name"
                  placeholder="Search Like"
                  dropdownValue={name_drop_data}
                  changeValue={setNameDropdown}
                  data={["React", "Angular", "Vue", "Svelte"]}
                />
              </Grid.Col>
              <Grid.Col span={7}>
                <Box>
                  <InputForm
                    tooltip={t("NameValidateMessage")}
                    label=""
                    placeholder={t("Name")}
                    nextField={"mobile_dropdown"}
                    form={form}
                    name={"name"}
                    id={"name"}
                    leftSection={<IconUserCircle size={16} opacity={0.5} />}
                    rightIcon={""}
                  />
                </Box>
              </Grid.Col>
            </Grid>
          </Box>
          <Box mt={"8"}>
            <Grid columns={15} gutter={{ base: 8 }}>
              <Grid.Col span={3}>
                <Text ta={"left"} fw={600} fz={"sm"} mt={"8"}>
                  {t("Date")}
                </Text>
              </Grid.Col>

              <Grid.Col span={6}>
                <DatePickerForm
                  tooltip={t("SelectStartDate")}
                  label=""
                  placeholder={t("StartDate")}
                  required={true}
                  nextField={"end_date"}
                  form={form}
                  name={"start_date"}
                  id={"start_date"}
                  leftSection={<IconCalendar size={16} opacity={0.5} />}
                  rightSection={<IconCalendar size={16} opacity={0.5} />}
                  rightSectionWidth={30}
                  closeIcon={true}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerForm
                  tooltip={t("SelectEndDate")}
                  label=""
                  placeholder={t("EndDate")}
                  required={true}
                  nextField={""}
                  form={form}
                  name={"end_date"}
                  id={"end_date"}
                  leftSection={<IconCalendar size={16} opacity={0.5} />}
                  rightSection={<IconCalendar size={16} opacity={0.5} />}
                  rightSectionWidth={30}
                  closeIcon={true}
                />
              </Grid.Col>
            </Grid>
          </Box> */}
        </Box>
      </ScrollArea>
    </form>
  );
});

export default ReportForms;
