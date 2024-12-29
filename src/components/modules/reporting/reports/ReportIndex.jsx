import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import { Box, Progress } from "@mantine/core";
import ReportingHeaderNavbar from "../ReportingHeaderNavbar";
import Reports from "./Reports";

export default function ReportIndex() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const progress = getLoadingProgress();

  return (
    <>
      {progress !== 100 && (
        <Progress
          color="red"
          size={"sm"}
          striped
          animated
          value={progress}
          transitionDuration={200}
        />
      )}
      {progress === 100 && (
        <>
          <Box>
            <ReportingHeaderNavbar
              pageTitle={t("Reports")}
              roles={t("Roles")}
              allowZeroPercentage=""
              currencySymbol=""
            />
            <Box p={"8"}>
              <Reports />
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
