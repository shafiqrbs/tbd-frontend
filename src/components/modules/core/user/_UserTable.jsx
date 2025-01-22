import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Group, Box, ActionIcon, Text, rem, Menu } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDotsVertical, IconTrashX, IconAlertCircle } from "@tabler/icons-react";
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
import __UserViewDrawer from "./__UserViewDrawer.jsx";
import { notifications } from "@mantine/notifications";

function _UserTable() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 98; //TabList height 104
  const [fetching,setFetching] = useState(true)

  const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
  const userFilterData = useSelector((state) => state.crudSlice.userFilterData);
  const fetchingReload = useSelector((state) => state.crudSlice.fetching)

  const entityDataDelete = useSelector(
    (state) => state.crudSlice.entityDataDelete
  );

  const perPage = 50;
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [viewDrawer, setViewDrawer] = useState(false);

  const users = JSON.parse(localStorage.getItem("core-users"));
  const [userObject, setUserObject] = useState(null);

  const [indexData,setIndexData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true)
      const value = {
        url: "core/user",
        param: {
          term: searchKeyword,
          name: userFilterData.name,
          mobile: userFilterData.mobile,
          email: userFilterData.email,
          page: page,
          offset: perPage,
        }
      };

      try {
        const resultAction = await dispatch(getIndexEntityData(value));

        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error('Error:', resultAction);
        } else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload);
          setFetching(false)
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchData();
  }, [dispatch, searchKeyword, userFilterData, page , fetchingReload]);

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
              accessor: "action",
              title: t("Action"),
              textAlign: "right",
              render: (data) => (
                <Group gap={4} justify="right" wrap="nowrap">
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

export default _UserTable;
