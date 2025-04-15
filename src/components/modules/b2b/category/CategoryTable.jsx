import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
  Group,
  Box,
  Button,
  Menu,
  ActionIcon,
  rem,
  Text,
  TextInput,
  Grid,
  Card,
  ScrollArea, LoadingOverlay,
} from "@mantine/core";

import {DataTable} from "mantine-datatable";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import tableCss from "../../../../assets/css/Table.module.css";
import _Search from "../common/_Search.jsx";
import {IconDotsVertical, IconTrashX} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import {getHotkeyHandler} from "@mantine/hooks";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import {useForm} from "@mantine/form";
import classes from "../../../../assets/css/FeaturesCards.module.css";
import {getCategoryDropdown} from "../../../../store/inventory/utilitySlice.js";
import {setDropdownLoad} from "../../../../store/inventory/crudSlice.js";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";

export default function CategoryTable(props) {
    const {id} = props;
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const {isOnline, mainAreaHeight} = useOutletContext();
    const height = mainAreaHeight - 120;

    const navigate = useNavigate();
    const perPage = 50;
    const [page, setPage] = useState(1);

    const [fetching, setFetching] = useState(false);
    const searchKeyword = useSelector((state) => state.crudSlice.searchKeyword);
    const [indexData, setIndexData] = useState([]);

    const [subDomainData, setSubDomainData] = useState([])
    const [reloadList, setReloadList] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'domain/b2b/sub-domain', param: {}
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setSubDomainData(resultAction.payload);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setReloadList(false)
            }
        };

        fetchData();
    }, [dispatch, fetching]);

    const form = useForm({
        initialValues: {
            mode_id: "",
        },
    });
    const [selectedDomainId, setSelectedDomainId] = useState(id);
    const dropdownLoad = useSelector((state) => state.inventoryCrudSlice.dropdownLoad);
    const categoryDropdownData = useSelector((state) => state.inventoryUtilitySlice.categoryDropdownData);
    useEffect(() => {
        const value = {
            url: "inventory/select/category",
            param: {
                type: "all",
            },
        };
        dispatch(getCategoryDropdown(value));
        dispatch(setDropdownLoad(false));
    }, [dropdownLoad]);


    const [subDomainCategoryData, setSubDomainCategoryData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            const value = {
                url: 'domain/b2b/sub-domain/setting/' + selectedDomainId, param: {}
            }

            try {
                const resultAction = await dispatch(getIndexEntityData(value));

                if (getIndexEntityData.rejected.match(resultAction)) {
                    console.error('Error:', resultAction);
                } else if (getIndexEntityData.fulfilled.match(resultAction)) {
                    setSubDomainCategoryData(resultAction.payload.data);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setReloadList(false)
            }
        };

        fetchData();
    }, [dispatch, fetching, reloadList]);

    const [modeMap, setModeMap] = useState({});

    useEffect(() => {
        if (subDomainCategoryData && subDomainCategoryData?.sub_domain_category.length > 0) {
            const initialMap = {};
            subDomainCategoryData?.sub_domain_category.forEach(item => {
                initialMap[item.id] = item.percent_mode || null;
            });
            setModeMap(initialMap);
        }
    }, [subDomainCategoryData?.sub_domain_category]);


    return (
        <>
          <LoadingOverlay visible={reloadList} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

                  <Grid columns={24} gutter={{base: 8}}>
                    <Grid.Col span={4}>
                      <Card shadow="md" radius="md" className={classes.card} padding="lg">
                        <Grid gutter={{base: 2}}>
                          <Grid.Col span={10}>
                            <Text fz="md" fw={500} className={classes.cardTitle}>
                              {t("ManageBranchAndFranchise")}
                            </Text>
                          </Grid.Col>
                        </Grid>
                        <Grid columns={9} gutter={{base: 8}}>
                          <Grid.Col span={9}>
                            <Box bg={"white"}>
                              <Box mt={8} pt={"8"}>
                                <ScrollArea
                                    h={height}
                                    scrollbarSize={2}
                                    scrollbars="y"
                                    type="never"
                                >
                                  {subDomainData && subDomainData?.data && subDomainData.data.map((data) => (
                                      <Box
                                          style={{
                                            borderRadius: 4,
                                            cursor: "pointer",
                                          }}
                                          className={`${classes["pressable-card"]} border-radius`}
                                          mih={40}
                                          mt={"4"}
                                          variant="default"
                                          key={data.id}
                                          onClick={() => {
                                            setSelectedDomainId(data.id);
                                            navigate(`/b2b/sub-domain/category/${data.id}`);
                                              setReloadList(true)
                                          }}
                                          bg={
                                            data.id == selectedDomainId ? "gray.6" : "gray.1"
                                          }
                                      >
                                        <Text
                                            size={"sm"}
                                            pl={14}
                                            pt={8}
                                            fw={500}
                                            c={data.id === selectedDomainId ? "white" : "black"}
                                        >
                                          {data.name}
                                        </Text>
                                      </Box>
                                  ))}
                                </ScrollArea>
                              </Box>
                            </Box>
                          </Grid.Col>
                        </Grid>
                      </Card>
                    </Grid.Col>
                    <Grid.Col span={20}>
                      <Box p={"xs"} bg={"white"} className={"borderRadiusAll"}>
                        <Box
                            pl={`xs`}
                            pb={"xs"}
                            pr={8}
                            pt={"xs"}
                            mb={"xs"}
                            className={"boxBackground borderRadiusAll"}
                        >
                          <_Search module={"product"}/>
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
                              records={subDomainCategoryData?.sub_domain_category}
                              columns={[
                                {
                                  accessor: "index",
                                  title: t("S/N"),
                                  textAlignment: "right",
                                  render: (item) =>
                                      subDomainCategoryData?.sub_domain_category.indexOf(item) + 1 + (page - 1) * perPage,
                                },
                                {accessor: "category_name", title: t("Category")},
                                /*{
                                  accessor: "percent_mode",
                                  title: t("Mode"),
                                  width: "220px",
                                  textAlign: "center",
                                  render: (item) => (
                                      <>
                                        <SelectForm
                                            tooltip={t("ChooseMode")}
                                            placeholder={t("ChooseMode")}
                                            required={true}
                                            name={"percent_mode"}
                                            form={form}
                                            dropdownValue={["Increase", "Decrease"]}
                                            id={"percent_mode"}
                                            searchable={true}
                                            value={modeMap[item.id] || null}
                                            changeValue={(value) => {
                                              setModeMap((prev) => ({
                                                ...prev,
                                                [item.id]: value,
                                              }));
                                            }}
                                        />
                                      </>
                                  ),
                                },*/
                                  {
                                      accessor: "percent_mode", // Optional if you're using render
                                      title: t("Mode"),
                                      width: "220px",
                                      textAlign: "center",
                                      render: (item) => (
                                          <>
                                              <SelectForm
                                                  tooltip={t("ChooseMode")}
                                                  placeholder={t("ChooseMode")}
                                                  required={true}
                                                  name="percent_mode"
                                                  form={form}
                                                  dropdownValue={["Increase", "Decrease"]}
                                                  id={`percent_mode_${item.id}`}
                                                  searchable={true}
                                                  value={modeMap[item.id] || null}
                                                  changeValue={(value) =>
                                                      setModeMap((prev) => ({
                                                          ...prev,
                                                          [item.id]: value,
                                                      }))
                                                  }
                                              />
                                          </>
                                      ),
                                  }
,
                                  {
                                  accessor: "mrp_percent",
                                  textAlign: "center",
                                  title: t("MRPPercent"),
                                  width: "220px",
                                  render: (item) => {
                                    const [editedSalesPercent, setEditedSalesPrice] =
                                        useState(item.mrp_percent);

                                    const handlQuantityChange = (e) => {
                                      const editedSalesPercent = e.currentTarget.value;
                                      setEditedSalesPrice(editedSalesPercent);

                                      let salesPercentElement = document.getElementById(
                                          "inline-update-sales-percent-" + item.id
                                      );
                                    };

                                    return (
                                        <>
                                          <TextInput
                                              type="number"
                                              label=""
                                              size="xs"
                                              id={"inline-update-sales-percent-" + item.id}
                                              value={Number(editedSalesPercent)}
                                              onChange={() => {
                                              }}
                                              onKeyDown={getHotkeyHandler([
                                                [
                                                  "Enter",
                                                  (e) => {
                                                    document
                                                        .getElementById(
                                                            "inline-update-sales-percent-" + item.id
                                                        )
                                                        .focus();
                                                  },
                                                ],
                                              ])}
                                          />
                                        </>
                                    );
                                  },
                                },
                                {
                                  accessor: "purchase_percent",
                                  textAlign: "center",
                                  title: t("PurchasePercent"),
                                  width: "220px",
                                  render: (item) => {
                                    const [editedDiscountPrice, setEditedDiscountPrice] =
                                        useState(item.purchase_percent);

                                    const handlQuantityChange = (e) => {
                                      const editedDiscountPrice = e.currentTarget.value;
                                      setEditedDiscountPrice(editedDiscountPrice);

                                      let discountPriceElement = document.getElementById(
                                          "inline-update-discount-price-" + item.id
                                      );
                                    };

                                    return (
                                        <>
                                          <TextInput
                                              type="number"
                                              label=""
                                              size="xs"
                                              id={"inline-update-discount-price-" + item.id}
                                              value={Number(editedDiscountPrice)}
                                              onChange={() => {
                                              }}
                                              onKeyDown={getHotkeyHandler([
                                                [
                                                  "Enter",
                                                  (e) => {
                                                    document
                                                        .getElementById(
                                                            "inline-update-discount-price-" + item.id
                                                        )
                                                        .focus();
                                                  },
                                                ],
                                              ])}
                                          />
                                        </>
                                    );
                                  },
                                },
                                {
                                  accessor: "bonus_percent",
                                  textAlign: "center",
                                  title: t("BonusPercent"),
                                  width: "220px",
                                  render: (item) => {
                                    const [editedBonusPercent, setEditedBonusPercent] =
                                        useState(item.discount_percent);

                                    const handlQuantityChange = (e) => {
                                      const editedBonusPercent = e.currentTarget.value;
                                      setEditedBonusPercent(editedBonusPercent);

                                      let discountPriceElement = document.getElementById(
                                          "inline-update-bonus-price-" + item.id
                                      );
                                    };

                                    return (
                                        <>
                                          <TextInput
                                              type="number"
                                              label=""
                                              size="xs"
                                              id={"inline-update-bonus-percent-" + item.id}
                                              value={Number(editedBonusPercent)}
                                              onChange={() => {
                                              }}
                                              onKeyDown={getHotkeyHandler([
                                                [
                                                  "Enter",
                                                  (e) => {
                                                    document
                                                        .getElementById(
                                                            "inline-update-bonus-percent-" + item.id
                                                        )
                                                        .focus();
                                                  },
                                                ],
                                              ])}
                                          />
                                        </>
                                    );
                                  },
                                },
                                {
                                  accessor: "action",
                                  title: t("Action"),
                                  textAlign: "right",
                                  render: (item) => (
                                      <Group gap={4} justify="right" wrap="nowrap">
                                        <Button
                                            component="a"
                                            size="compact-xs"
                                            radius="xs"
                                            variant="filled"
                                            fw={"100"}
                                            fz={"12"}
                                            color="red.3"
                                            mr={"4"}
                                            onClick={() => {
                                            }}
                                        >
                                          {t("Generate")}
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
                                            <Menu.Item onClick={() => {
                                            }}>
                                              {t("Edit")}
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
                                                    labels: {
                                                      confirm: "Confirm",
                                                      cancel: "Cancel",
                                                    },
                                                    confirmProps: {color: "red.6"},
                                                    onCancel: () => console.log("Cancel"),
                                                    onConfirm: () => {
                                                      console.log("ok pressed");
                                                    },
                                                  });
                                                }}
                                                rightSection={
                                                  <IconTrashX
                                                      style={{width: rem(14), height: rem(14)}}
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
                              scrollAreaProps={{type: "never"}}
                          />
                        </Box>
                      </Box>
                    </Grid.Col>
                  </Grid>
              {/*)*/}
          {/*}*/}
        </>
    );
}
