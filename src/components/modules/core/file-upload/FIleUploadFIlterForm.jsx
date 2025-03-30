import React from "react";
import { useTranslation } from "react-i18next";
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

export default function FileUploadFilterForm(props) {
  const { t, i18n } = useTranslation();

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

      <InputForm
        label={t("FileType")}
        placeholder={t("EnterFileType")}
        nextField={"created"}
        id={"file_type"}
        name={"file_type"}
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
