import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import __PosCustomerSection from "./__PosCustomerSection";
import { Box, Text, ActionIcon, Group, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { IconPercentage, IconSum, IconX } from "@tabler/icons-react";
import { useOutletContext } from "react-router-dom";
import __PosInvoiceSection from "./__PosInvoiceSetion.jsx";
import { getHotkeyHandler, useToggle } from "@mantine/hooks";
import customerDataStoreIntoLocalStorage from "../../../global-hook/local-storage/customerDataStoreIntoLocalStorage.js";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import { storeEntityData } from "../../../../store/inventory/crudSlice.js";
export default function GeneralIssueSubmitForm(props) {
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 170;
  const [fetching, setFetching] = useState(false);
  const dispatch = useDispatch();
}
