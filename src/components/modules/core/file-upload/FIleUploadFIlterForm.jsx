import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";
import SelectForm from "../../../form-builders-filter/SelectForm.jsx";

export default function FileUploadFilterForm(props) {
  const { t, i18n } = useTranslation();

  const [excelFileType, setExcelFileType] = useState(null);

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("original_name").focus();
        },
      ],
    ],
    []
  );
  if (excelFileType){
    console.log("excelFileType", excelFileType);
  }
  return (
    <>
      <InputForm
        label={t("FileName")}
        placeholder={t("EnterFileName")}
        nextField={"mobile"}
        id={"original_name"}
        name={"original_name"}
        module={props.module}
      />

      <SelectForm
        label={t("ChooseExcelType")}
        placeholder={t("ChooseExcelType")}
        mt={1}
        clearable={true}
        searchable={true}
        required={false}
        nextField={"created"}
        name={"file_type"}
        dropdownValue={[
          "Opening-Stock",
          "Finish-Goods",
          "Production",
          "Product",
          "User",
        ]}
        id={"file_type"}
        value={excelFileType}
        changeValue={setExcelFileType}
        comboboxProps={true}
        allowDeselect={false}
        module={props.module}
      />
      <InputForm
        label={t("Created")}
        placeholder={t("EnterCreatedDate")}
        nextField={"submit"}
        id={"created"}
        name={"created"}
        module={props.module}
      />
    </>
  );
}
