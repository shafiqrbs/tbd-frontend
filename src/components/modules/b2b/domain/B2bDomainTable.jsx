import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  Button,
  Menu,
  ActionIcon,
  rem,
  Text,
  TextInput, LoadingOverlay,
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _Search from "../common/_Search.jsx";
import { IconDotsVertical, IconTrashX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { getHotkeyHandler } from "@mantine/hooks";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { useForm } from "@mantine/form";
import {getIndexEntityData, storeEntityData} from "../../../../store/core/crudSlice.js";
import getUtilityDomainTypeDropdownData from "../../../global-hook/dropdown/getUtilityDomainTypeDropdownData.js";
import useUtilityDomainTypeDropdownData from "../../../global-hook/dropdown/getUtilityDomainTypeDropdownData.js";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent.jsx";
export default function B2bDomainTable(props) {
  const { id } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 120;

  const navigate = useNavigate();
  const perPage = 50;
  const [page, setPage] = useState(1);

  const [fetching, setFetching] = useState(false);
  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const loginUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : [];

  const form = useForm({
    initialValues: {
      mode_id: "",
    },
  });
  const [modeMap, setModeMap] = useState({});

  const [reloadList, setReloadList] = useState(true)
  const [indexData, setIndexData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const value = {
        url: 'domain/global', param: {
          term: searchKeyword, page: page, offset: perPage
        }
      }

      try {
        const resultAction = await dispatch(getIndexEntityData(value));

        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error('Error:', resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setReloadList(false)
      }
    };

    fetchData();
  }, [dispatch, searchKeyword, page, fetching]);

  const domainTypeDropdownData = useUtilityDomainTypeDropdownData(reloadList);


  return (
    <>
      <LoadingOverlay visible={reloadList} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Box
        pl={`xs`}
        pb={"xs"}
        pr={8}
        pt={"xs"}
        mb={"xs"}
        className={"boxBackground borderRadiusAll"}
      >
        <_Search module={"category"} />
      </Box>
      <Box className={"borderRadiusAll"}>

        <DataTable
            classNames={{
              root: tableCss.root,
              table: tableCss.table,
              header: tableCss.header,
              footer: tableCss.footer,
              pagination: tableCss.pagination,
            }}
            records={(indexData?.data || []).filter(item => item.id !== loginUser.domain_id)}
            columns={[
              {
                accessor: 'index',
                title: t('S/N'),
                textAlignment: 'right',
                render: (item) =>
                    indexData.data.indexOf(item) + 1 + (page - 1) * perPage,
              },
              { accessor: 'company_name', title: t('CompanyName') },
              { accessor: 'name', title: t('ClientName') },
              { accessor: 'mobile', title: t('Mobile') },
              { accessor: 'email', title: t('Email') },
              { accessor: 'unique_code', title: t('LicenseNo') },
              {
                accessor: 'domain_type',
                title: t('DomainType'),
                width: '220px',
                textAlign: 'center',
                render: (item) => (
                    <SelectForm
                        tooltip={t('ChooseDomainType')}
                        placeholder={t('ChooseDomainType')}
                        required={true}
                        name={'domain_type'}
                        form={form}
                        dropdownValue={domainTypeDropdownData}
                        id={'location_id'}
                        searchable={true}
                        value={modeMap[item.id] || null}
                        changeValue={(value) => {
                          setModeMap((prev) => ({
                            ...prev,
                            [item.id]: value,
                          }));
                        }}
                        inlineUpdate={true}
                        updateDetails={{
                          url: 'domain/b2b/inline-update/domain',
                          data: {
                            domain_id: item.id,
                            field_name: 'domain_type',
                            value: form.domain_type,
                          },
                        }}
                    />
                ),
              },
              {
                accessor: 'action',
                title: t('Action'),
                textAlign: 'right',
                render: (item) => {
                  const selectedDomainType = modeMap[item.id];
                  if (!selectedDomainType) return null;

                  return (
                      <Group gap={4} justify="right" wrap="nowrap">
                        <Button
                            component="a"
                            size="compact-xs"
                            radius="xs"
                            variant="filled"
                            fw={100}
                            fz={12}
                            color="red.3"
                            mr={4}
                            onClick={async () => {
                                setReloadList(true)
                                const data = {
                                    url: 'domain/b2b/inline-update/domain',
                                    data: {
                                        domain_id: item.id,
                                        field_name: 'status',
                                        value: true,
                                    }
                                }
                                try {
                                    const resultAction = await dispatch(storeEntityData(data));

                                    if (resultAction.payload?.status !== 200) {
                                        showNotificationComponent(resultAction.payload?.message || 'Error updating invoice', 'red', '', '', true);
                                    }else {
                                        showNotificationComponent('Domain process successfully', 'red', '', '', true);
                                    }
                                } catch (error) {
                                    showNotificationComponent('Request failed. Please try again.', 'red', '', '', true);
                                    console.error('Error updating invoice:', error);
                                }finally {
                                    setReloadList(false)
                                }
                            }}
                        >
                          {t('Process')}
                        </Button>
                      </Group>
                  );
                },
              },
            ]}
            fetching={fetching}
            totalRecords={indexData.total}
            recordsPerPage={perPage}
            page={page}
            onPageChange={(p) => {
              setPage(p);
              dispatch(setFetching(true));
            }}
            loaderSize="xs"
            loaderColor="grape"
            height={height}
            scrollAreaProps={{ type: 'never' }}
        />

        {/*<DataTable
          classNames={{
            root: tableCss.root,
            table: tableCss.table,
            header: tableCss.header,
            footer: tableCss.footer,
            pagination: tableCss.pagination,
          }}
          records={indexData.data}
          columns={[
            {
              accessor: "index",
              title: t("S/N"),
              textAlignment: "right",
              render: (item) =>
                indexData.data.indexOf(item) + 1 + (page - 1) * perPage,
            },
            {accessor: 'company_name', title: t('CompanyName')},
            {accessor: 'name', title: t('ClientName')},
            {accessor: 'mobile', title: t('Mobile')},
            {accessor: 'email', title: t("Email")},
            {accessor: 'unique_code', title: t("LicenseNo")},
            {
              accessor: "domain_type",
              title: t("DomainType"),
              width: "220px",
              textAlign: "center",
              render: (item) => (
                  <>
                    <SelectForm
                        tooltip={t("ChooseDomainType")}
                        placeholder={t("ChooseDomainType")}
                        required={true}
                        name={"domain_type"}
                        form={form}
                        dropdownValue={domainTypeDropdownData}
                        id={"location_id"}
                        searchable={true}
                        value={modeMap[item.id] || null}
                        changeValue={(value) => {
                          setModeMap((prev) => ({
                            ...prev,
                            [item.id]: value,
                          }));
                        }}
                        inlineUpdate={true}
                        updateDetails={{
                          url: "inventory/pos/inline-update",
                          data: {
                            domain_id: item.id,
                            field_name: "domain_type",
                            value: form.domain_type,
                          },
                        }}
                    />
                  </>
              ),
            },

            {
              accessor: "action",
              title: t("Action"),
              textAlign: "right",
              render: (item) => {
                const selectedDomainType = modeMap[item.id];

                if (!selectedDomainType) return null; // Only render if value exists

                return (
                    <Group gap={4} justify="right" wrap="nowrap">
                      <Button
                          component="a"
                          size="compact-xs"
                          radius="xs"
                          variant="filled"
                          fw={100}
                          fz={12}
                          color="red.3"
                          mr={4}
                          onClick={() => {
                            // perform action for this item and selectedDomainType
                            // Optional: call API or trigger something
                            console.log("Process row:", item.id, 'with domain type:', selectedDomainType);
                          }}
                      >
                        {t("Generate")}
                      </Button>
                    </Group>
                );
              }
            }
            ]}
          fetching={fetching}
          totalRecords={indexData.total}
          recordsPerPage={perPage}
          page={page}
          onPageChange={(p) => {
            setPage(p);
            dispatch(setFetching(true));
          }}
          loaderSize="xs"
          loaderColor="grape"
          height={height}
          scrollAreaProps={{ type: "never" }}
        />*/}
      </Box>
    </>
  );
}
