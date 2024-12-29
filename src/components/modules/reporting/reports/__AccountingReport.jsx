import React, { useState, forwardRef, useImperativeHandle,useEffect } from "react";
import { ScrollArea, Box, Grid, Text } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import SelectForm from "../../../form-builders/SelectForm";
import { useForm, isNotEmpty } from "@mantine/form";
import { useTranslation } from "react-i18next";
import InputForm from "../../../form-builders/InputForm";
import { IconUserCircle } from "@tabler/icons-react";

const __AccountingReport = forwardRef((props, ref) => {
  const { setEnableTable, setDataLimit } = props;
  const { mainAreaHeight, isOnline } = useOutletContext();
  const { t } = useTranslation();
  const height = mainAreaHeight - 98;
  const form = useForm({
    initialValues: {
      report_type: "",
      name_dropdown: "",
      name: "",
    },
    validate: {
      report_type: isNotEmpty(),
    },
  });

  const formRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      formRef.current?.requestSubmit();
    },
  }));

  const report_Type = [
    { id: 1, value: "MonthlyReport" },
    { id: 2, value: "YearlyReport" },
  ];

  const [reportType, setReportType] = useState(null);
  const name_drop_data = [
    { id: 1, value: "chiller" },
    { id: 2, value: "party" },
  ];
  const [nameDropdown, setNameDropdown] = useState(null);
  useEffect(() => {
    reportType === "YearlyReport"
      ? (setDataLimit(true), setEnableTable(false))
      : (setDataLimit(false), setEnableTable(true));
  }, [reportType]);
  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit((values) => {
        console.log("Form submits Accounting", values);
      })}
    >
      <ScrollArea h={height - 46} scrollbarSize={2} scrollbars="y" type="never">
        <Box>
          <Box mt={"8"}>
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
              id={"customer_group_id"}
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
        </Box>
      </ScrollArea>
    </form>
  );
});

export default __AccountingReport;
