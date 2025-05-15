import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Group,
  Box,
  ActionIcon,
  Text,
  rem,
  Menu,
  TextInput,
  Button,
  Textarea,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
  IconCheck,
  IconDotsVertical,
  IconTrashX,
  IconAlertCircle,
  IconArrowRight,
  IconPencil,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEntityData,
  editEntityData,
  getIndexEntityData,
  setDeleteMessage,
  setFetching,
  setFormLoading,
  setInsertType,
} from "../../../../store/core/crudSlice.js";
import { modals } from "@mantine/modals";
import KeywordSearch from "../../filter/KeywordSearch.jsx";
import tableCss from "../../../../assets/css/Table.module.css";
import { notifications } from "@mantine/notifications";
import { getHotkeyHandler } from "@mantine/hooks";
import inputCss from "../../../../assets/css/InlineInputField.module.css";
import {storeEntityData} from "../../../../store/core/crudSlice";
import {showNotificationComponent} from "../../../core-component/showNotificationComponent";
// ─── Reusable Input for Inline Percentage Fields ──────────────────────────────
const EditableNumberInput = ({ item, field, placeholder, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleChange = (e) => {
    const val = e.currentTarget.value;
    setInputValue(val);
    if (onChange) {
      onChange(item.id, field, val);
    }
  };

  return (
    <TextInput
      type="number"
      classNames={inputCss}
      size="xs"
      id={`inline-update-${field}-${item.id}`}
      value={inputValue}
      placeholder={placeholder}
      onChange={handleChange}
      style={{ width: "80px" }}
    />
  );
};

function _DiscountUserTable() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 98; //TabList height 104

  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const userFilterData = useSelector((state) => state.crudSlice.userFilterData);
  const fetchingReload = useSelector((state) => state.crudSlice.fetching);
  const fetching = useSelector((state) => state.crudSlice.fetching);

  const entityDataDelete = useSelector(
    (state) => state.crudSlice.entityDataDelete
  );

  const perPage = 50;
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [viewDrawer, setViewDrawer] = useState(false);

  const users = JSON.parse(localStorage.getItem("core-users"));
  const [userObject, setUserObject] = useState(null);

  // State to store the edited values for all users
  const [editedValues, setEditedValues] = useState({});
  // State for tracking loading state of update operations
  const [updatingRows, setUpdatingRows] = useState({});

  const [indexData, setIndexData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      const value = {
        url: "inventory/discount/users",
        param: {
          term: searchKeyword,
          name: userFilterData.name,
          mobile: userFilterData.mobile,
          email: userFilterData.email,
          page: page,
          offset: perPage,
        },
      };

      try {
        const resultAction = await dispatch(getIndexEntityData(value));

        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
          setFetching(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, [dispatch, searchKeyword, userFilterData, page, fetchingReload]);

  useEffect(() => {
    dispatch(setDeleteMessage(""));
    if (entityDataDelete.message === "delete") {
      notifications.show({
        color: "red",
        title: t("DeleteSuccessfully"),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
        style: { backgroundColor: "lightgray" },
      });

      setTimeout(() => {
        dispatch(setFetching(true));
      }, 700);
    }
  }, [entityDataDelete]);

  // Handle input changes for editable fields
  const handleFieldChange = (userId, field, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        [field]: value,
      },
    }));
  };

  // Handle update for a specific row
  const handleUpdateRow = async (userId) => {
    if (!editedValues[userId]) {
      showNotificationComponent(t("NoChanges"), 'red');
      return;
    }
    setUpdatingRows((prev) => ({ ...prev, [userId]: true }));
    try {
        const value = {
          url: 'inventory/discount/user-update/'+userId,
          data: editedValues[userId],
        };
      const resultAction = await dispatch(storeEntityData(value));
      if (storeEntityData.rejected.match(resultAction)) {
        const fieldErrors = resultAction.payload.errors;
        // Check if there are field validation errors and dynamically set them
        if (fieldErrors) {
          const errorObject = {};
          Object.keys(fieldErrors).forEach(key => {
            errorObject[key] = fieldErrors[key][0]; // Assign the first error message for each field
          });
          // Display the errors using your form's `setErrors` function dynamically
          form.setErrors(errorObject);
        }
      } else if (storeEntityData.fulfilled.match(resultAction)) {
        showNotificationComponent(t('CreateSuccessfully'), 'teal');
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: t("UpdateFailed"),
        icon: <IconAlertCircle style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 700,
      });
      showNotificationComponent(t('UpdateFailed'), 'red');
    } finally {
      setUpdatingRows((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  return (
    <>
      <Box
        pl={`xs`}
        pr={8}
        pt={"6"}
        pb={"4"}
        className={"boxBackground borderRadiusAll border-bottom-none"}
      >
        <KeywordSearch module={"user"} />
      </Box>
      <Box className={"borderRadiusAll border-top-none"}>
        <DataTable
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
              render: (item) => indexData.data.indexOf(item) + 1,
            },
            { accessor: "name", title: t("Name") },
            { accessor: "username", title: t("UserName") },
            { accessor: "email", title: t("Email") },
            { accessor: "mobile", title: t("Mobile") },
            {
              accessor: "max_discount",
              title: t("MaxDiscount"),
              textAlign: "left",
              render: (item) => (
                <EditableNumberInput
                  item={item}
                  field="max_discount"
                  value={item?.max_discount}
                  placeholder={t("MaxDiscount")}
                  onChange={handleFieldChange}
                />
              ),
            },
            {
              accessor: "discount_percent",
              title: t("Discount(%)"),
              textAlign: "left",
              render: (item) => (
                <EditableNumberInput
                  item={item}
                  field="discount_percent"
                  value={item?.discount_percent}
                  placeholder={t("Discount")}
                  onChange={handleFieldChange}
                />
              ),
            },
            {
              accessor: "sales_target",
              title: t("SalesTarget"),
              textAlign: "left",
              render: (item) => (
                <EditableNumberInput
                  item={item}
                  field="sales_target"
                  placeholder={t("SalesTarget")}
                  value={item?.sales_target}
                  onChange={handleFieldChange}
                />
              ),
            },
            {
              accessor: "action",
              title: t("Action"),
              textAlign: "right",
              render: (data) => (
                <Group gap={4} justify="right" wrap="nowrap">
                  <Button
                    component="a"
                    size="compact-xs"
                    radius="xs"
                    variant="filled"
                    fw={"100"}
                    fz={"12"}
                    className={"btnPrimaryBg"}
                    mr={"4"}
                    leftSection={<IconPencil size={14} />}
                    onClick={() => {
                      handleUpdateRow(data.id);
                    }}
                  >
                    {t("Update")}
                  </Button>
                  <Menu
                    position="bottom-end"
                    offset={3}
                    withArrow
                    trigger="hover"
                    openDelay={100}
                    closeDelay={400}
                  >
                    <Menu.Target>
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        color="red"
                        radius="xl"
                        aria-label="Settings"
                      >
                        <IconDotsVertical
                          height={"18"}
                          width={"18"}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          dispatch(setInsertType("update"));
                          dispatch(editEntityData("core/user/" + data.id));
                          dispatch(setFormLoading(true));
                          navigate(`/core/user/${data.id}`);
                        }}
                        target="_blank"
                        component="a"
                        w={"200"}
                      >
                        {t("Edit")}
                      </Menu.Item>

                      <Menu.Item
                        onClick={() => {
                          // dispatch(editEntityData('core/user/' + data.id))

                          const foundUsers = indexData?.data.find(
                            (type) => type.id == data.id
                          );
                          if (foundUsers) {
                            setUserObject(foundUsers);
                            setViewDrawer(true);
                          } else {
                            notifications.show({
                              color: "red",
                              title: t(
                                "Something Went wrong , please try again"
                              ),
                              icon: (
                                <IconAlertCircle
                                  style={{ width: rem(18), height: rem(18) }}
                                />
                              ),
                              loading: false,
                              autoClose: 900,
                              style: { backgroundColor: "lightgray" },
                            });
                          }
                        }}
                        target="_blank"
                        component="a"
                        w={"200"}
                      >
                        {t("Show")}
                      </Menu.Item>
                      <Menu.Item
                        target="_blank"
                        component="a"
                        w={"200"}
                        mt={"2"}
                        bg={"red.1"}
                        c={"red.6"}
                        onClick={() => {
                          modals.openConfirmModal({
                            title: (
                              <Text size="md">
                                {" "}
                                {t("FormConfirmationTitle")}
                              </Text>
                            ),
                            children: (
                              <Text size="sm">
                                {" "}
                                {t("FormConfirmationMessage")}
                              </Text>
                            ),
                            labels: { confirm: "Confirm", cancel: "Cancel" },
                            confirmProps: { color: "red.6" },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => {
                              dispatch(
                                deleteEntityData("core/user/" + data.id)
                              );
                            },
                          });
                        }}
                        rightSection={
                          <IconTrashX
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        {t("Delete")}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              ),
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
          scrollAreaProps={{ type: "never" }}
        />
      </Box>
      {viewDrawer && (
        <__UserViewDrawer
          userObject={userObject}
          viewDrawer={viewDrawer}
          setViewDrawer={setViewDrawer}
        />
      )}
    </>
  );
}

export default _DiscountUserTable;
