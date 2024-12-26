import React, { useState, forwardRef, useImperativeHandle } from "react";
import { ScrollArea, Box } from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import SelectForm from "../../../form-builders/SelectForm";
import { useForm, isNotEmpty } from "@mantine/form";
import { useTranslation } from "react-i18next";

const __PurchaseReport = forwardRef((props, ref) => {
  const { mainAreaHeight, isOnline } = useOutletContext();
  const { t } = useTranslation();
  const height = mainAreaHeight - 98;
  const form = useForm({
    initialValues: {
      report_type: "",
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

  return (
    <form
      ref={formRef}
      onSubmit={form.onSubmit((values) => {
        console.log("Form submits Purchase", values);
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
        </Box>
      </ScrollArea>
    </form>
  );
});

export default __PurchaseReport;
