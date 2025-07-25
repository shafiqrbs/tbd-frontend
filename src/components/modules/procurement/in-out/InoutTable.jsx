import {
  ActionIcon,
  Box,
  Grid,
  Stack,
  Text,
  TextInput,
  Button,
  Flex,
  Tooltip,
  rem,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import matrixTable from "../requistion-matrix/Table.module.css";
import { useDispatch } from "react-redux";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { IconX, IconDeviceFloppy, IconSearch } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { getIndexEntityData } from "../../../../store/inventory/crudSlice.js";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import { modals } from "@mantine/modals";
import RequisitionNavigation from "../common/RequisitionNavigation";

export default function InoutTable(props) {
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const tableHeight = mainAreaHeight - 160;
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [generateButton, setGenerateButton] = useState(false);
  const leftTableRef = useRef(null);
  const centerTableRef = useRef(null);
  const rightTableRef = useRef(null);

  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false); //will be true
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [expectedDate, setExpectedDate] = useState(null);
  // Static data for first table as requested
  const first_table_data = [
    { product: "Potato", unit: "kg", opening_quantity: 25 },
    { product: "Carrot", unit: "kg", opening_quantity: 12 },
    { product: "Lemon", unit: "pcs", opening_quantity: 40 },
    { product: "Green Chilli", unit: "kg", opening_quantity: 8 },
    { product: "Papaya", unit: "pcs", opening_quantity: 10 },
    {
      product: "Coriender Leafes / Donia pata",
      unit: "bundle",
      opening_quantity: 7,
    },
    { product: "Stuff vegetables", unit: "kg", opening_quantity: 15 },
    { product: "Potol", unit: "kg", opening_quantity: 9 },
    { product: "Lettuce leaves", unit: "bundle", opening_quantity: 5 },
    { product: "Korola", unit: "kg", opening_quantity: 6 },
    { product: "Derosh", unit: "kg", opening_quantity: 11 },
    { product: "Yardlong bean", unit: "kg", opening_quantity: 13 },
    { product: "Staff Kohi", unit: "kg", opening_quantity: 4 },
    { product: "Gourd", unit: "pcs", opening_quantity: 3 },
    { product: "Tomato", unit: "kg", opening_quantity: 18 },
    { product: "Brinjal (Begun)", unit: "kg", opening_quantity: 14 },
    { product: "Capsicum", unit: "kg", opening_quantity: 7 },
    { product: "Dundal", unit: "kg", opening_quantity: 5 },
    { product: "Chichinga", unit: "kg", opening_quantity: 6 },
    { product: "Sweet Pumpkin", unit: "pcs", opening_quantity: 2 },
    { product: "Mint Leves", unit: "bundle", opening_quantity: 3 },
    { product: "Kakroll", unit: "kg", opening_quantity: 4 },
    { product: "cauliflower", unit: "pcs", opening_quantity: 6 },
    { product: "Cucumber", unit: "kg", opening_quantity: 10 },
    { product: "jali kumra", unit: "pcs", opening_quantity: 2 },
    { product: "Cabbage", unit: "pcs", opening_quantity: 5 },
    { product: "Radish", unit: "kg", opening_quantity: 8 },
    { product: "Bombai Chili", unit: "kg", opening_quantity: 2 },
    { product: "Red Capsicum", unit: "kg", opening_quantity: 3 },
    { product: "Oregano leaves", unit: "bundle", opening_quantity: 1 },
  ];
  const [indexData, setIndexData] = useState(first_table_data);
  const finished_products_data = [
    { name: "Burger Bun" },
    { name: "Tiffin Bun" },
    { name: "Potato Chips" },
    { name: "Butter Bun" },
    { name: "Family Bun" },
    { name: "Sandwich Bread" },
    { name: "Milk Bread" },
    { name: "Raisins Sesame Roll" },
    { name: "Burger Bun" },
    { name: "Fancy bread" },
    { name: "English Bread" },
    { name: "Premium Bread" },
    { name: "Baby Bun (6 Pcs)" },
    { name: "Baby Bun (4 Pcs)" },
    { name: "Plain Bun" },
    { name: "Roll Bun" },
    { name: "Sub Bun 2pcs" },
    { name: "Small Hot Dog Bun 2pcs" },
    { name: "Mini Pizza Bread 1pcs (4Inch)" },
    { name: "Pizza Bread (6 Inch)" },
    { name: "Pizza Bread (8 Inch)" },
    { name: "Shwarma Bread" },
    { name: "Coconut pudding" },
    { name: "Burger Bun 1pcs" },
    { name: "Hot Dog Bun 1pcs" },
    { name: "Mini Burger" },
    { name: "Ghee" },
    { name: "Pesta Cookies" },
  ];
  const [customers, setCustomers] = useState(
    finished_products_data.map((fp) => fp.name)
  );

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  //   const fetchData = async () => {
  //     !expectedDate && setExpectedDate(new Date());
  //     setGenerateButton(false);

  //     const value = {
  //       url: "inventory/requisition/matrix/board",
  //       param: {
  //         expected_date: new Date(expectedDate).toLocaleDateString(
  //           "en-CA",
  //           options
  //         ),
  //       },
  //     };

  //     try {
  //       const resultAction = await dispatch(getIndexEntityData(value));

  //       if (getIndexEntityData.rejected.match(resultAction)) {
  //         console.error("Error:", resultAction);
  //       } else if (getIndexEntityData.fulfilled.match(resultAction)) {
  //         setIndexData(resultAction.payload.data);
  //         setCustomers(resultAction.payload.customers);
  //       }
  //     } catch (err) {
  //       console.error("Unexpected error:", err);
  //     } finally {
  //       setTimeout(() => {
  //         setFetching(false);
  //       }, 700);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchData();
  //   }, [fetching]);

  useEffect(() => {
    const syncScroll = (sourceRef, targetRefs) => {
      const handleScroll = () => {
        targetRefs.forEach((ref) => {
          if (ref.current) {
            ref.current.scrollTop = sourceRef.current.scrollTop;
          }
        });
      };

      if (sourceRef.current) {
        sourceRef.current.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (sourceRef.current) {
          sourceRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    };

    const cleanupLeft = syncScroll(leftTableRef, [
      centerTableRef,
      rightTableRef,
    ]);
    const cleanupCenter = syncScroll(centerTableRef, [
      leftTableRef,
      rightTableRef,
    ]);
    const cleanupRight = syncScroll(rightTableRef, [
      leftTableRef,
      centerTableRef,
    ]);

    return () => {
      cleanupLeft();
      cleanupCenter();
      cleanupRight();
    };
  }, []);

  const QuantityInput = ({ item, shopKey }) => {
    const [editedQuantity, setEditedQuantity] = useState(item[shopKey] || 0);
    const [branchApproveQuantity, setBranchApproveQuantity] = useState(
      item[shopKey + "_approved_quantity"] || null
    );
    const [branchRequestQuantity, setBranchRequestQuantity] = useState(
      item[shopKey + "_requested_quantity"] || null
    );

    !generateButton && item.process === "Confirmed" && setGenerateButton(true);

    const handleQuantityChange = (e) => {
      const newQuantity = e.currentTarget.value;
      setEditedQuantity(newQuantity);
    };

    const handleQuantityUpdateDB = async () => {
      const indexKey = shopKey + "_id";
      const values = {
        quantity: editedQuantity,
        id: item[indexKey],
      };

      const value = {
        url: "inventory/requisition/matrix/board/quantity-update",
        data: values,
      };

      const resultAction = await dispatch(storeEntityData(value));

      if (storeEntityData.rejected.match(resultAction)) {
        showNotificationComponent(
          resultAction.payload.message,
          "red",
          true,
          1000,
          true
        );
      } else if (storeEntityData.fulfilled.match(resultAction)) {
        if (resultAction.payload.data.status === 200) {
          // setFetching(true)
          // showNotificationComponent(resultAction.payload.data.message, 'teal', 'lightgray', true, 1000, true)
        } else {
          showNotificationComponent(
            resultAction.payload.data.message,
            "teal",
            true,
            1000,
            true
          );
        }
      }
    };

    return (
      <TextInput
        disabled={item[shopKey] <= 0 || item.process === "Confirmed"}
        type="number"
        size="xs"
        value={editedQuantity}
        onChange={handleQuantityChange}
        onBlur={handleQuantityUpdateDB}
        rightSection={<>{branchRequestQuantity}</>}
      />
    );
  };

  const handleGenerateMatrixBatch = async () => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const values = {
      expected_date: new Date(expectedDate).toLocaleDateString(
        "en-CA",
        options
      ),
      config_id: props.configId,
    };

    const value = {
      url: "inventory/requisition/matrix/board/batch-generate",
      data: values,
    };

    const resultAction = await dispatch(storeEntityData(value));

    if (storeEntityData.rejected.match(resultAction)) {
      showNotificationComponent(
        resultAction.payload.message,
        "red",
        true,
        1000,
        true
      );
    } else if (storeEntityData.fulfilled.match(resultAction)) {
      if (resultAction.payload.data.status === 200) {
        setFetching(true);
        showNotificationComponent(
          resultAction.payload.data.message,
          "teal",
          true,
          1000,
          true
        );
      } else {
        showNotificationComponent(
          resultAction.payload.data.message,
          "teal",
          true,
          1000,
          true
        );
      }
    }
  };

  return (
    <>
      <Box>
        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={24}>
            <Box
              pl={"xs"}
              pb={4}
              pr={"xs"}
              pt={4}
              mb={4}
              className={"boxBackground borderRadiusAll"}
            >
              <Grid columns={24} gutter={{ base: 8 }}>
                <Grid.Col span={1}></Grid.Col>
                <Grid.Col span={23}>
                  <Tooltip
                    label={t("ExpectedDate")}
                    opened={startDateTooltip}
                    px={16}
                    py={2}
                    position="top-end"
                    color="var(--theme-primary-color-6)"
                    withArrow
                    offset={2}
                    zIndex={100}
                    transitionProps={{
                      transition: "pop-bottom-left",
                      duration: 5000,
                    }}
                  >
                    <DateInput
                      disabled={fetching}
                      clearable
                      maxDate={new Date()}
                      onChange={(e) => {
                        setExpectedDate(e);
                        e != ""
                          ? setStartDateTooltip(false)
                          : (setStartDateTooltip(true),
                            setTimeout(() => {
                              setStartDateTooltip(false);
                            }, 1000));
                      }}
                      value={expectedDate}
                      placeholder={t("ExpectedDate")}
                    />
                  </Tooltip>
                </Grid.Col>
              </Grid>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
      <Box>
        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={1}>
            <RequisitionNavigation module={"requisition"} />
          </Grid.Col>
          <Grid.Col span={23}>
            <Box bg={"white"} p={"xs"} className="borderRadiusAll">
              <Box className="borderRadiusAll">
                <Grid columns={24} gutter={0}>
                  <Grid.Col span={4}>
                    <DataTable
                      scrollViewportRef={leftTableRef}
                      classNames={{
                        root: matrixTable.root,
                        table: matrixTable.table,
                        header: matrixTable.header,
                        footer: matrixTable.footer,
                        pagination: matrixTable.pagination,
                      }}
                      columns={[
                        {
                          accessor: "product",
                          title: t("Product"),
                          cellsClassName: matrixTable.idColumnCells,
                          width: 140,
                        },
                        {
                          accessor: "unit",
                          title: t("Unit"),
                          cellsClassName: matrixTable.idColumnCells,
                        },
                        {
                          accessor: "opening_quantity",
                          title: t("Opening"),
                          cellsClassName: matrixTable.idColumnCells,
                        },
                      ]}
                      records={indexData}
                      totalRecords={indexData.length}
                      loaderSize="xs"
                      fetching={fetching}
                      loaderColor="grape"
                      height={tableHeight}
                      scrollAreaProps={{ type: "never" }}
                    />
                  </Grid.Col>
                  <Grid.Col span={20}>
                    <DataTable
                      scrollAreaProps={{ type: "hover", scrollHideDelay: 1 }}
                      scrollViewportRef={centerTableRef}
                      classNames={{
                        root: matrixTable.root,
                        table: matrixTable.table,
                        header: matrixTable.header,
                        footer: matrixTable.footer,
                        pagination: matrixTable.pagination,
                      }}
                      columns={
                        customers.length > 0
                          ? customers.map((shop) => ({
                              accessor: shop.toLowerCase().replace(/\s+/g, "_"),
                              title: shop ? shop : t("BranchName"),
                              width: 150,
                              render: (item) => {
                                const shopKey = shop
                                  .toLowerCase()
                                  .replace(/\s+/g, "_");
                                return (
                                  <QuantityInput
                                    item={item}
                                    shopKey={shopKey}
                                  />
                                );
                              },
                            }))
                          : [
                              {
                                accessor: "",
                                title: t("BranchName"),
                              },
                            ]
                      }
                      records={indexData}
                      totalRecords={indexData.length}
                      fetching={fetching}
                      loaderSize="xs"
                      loaderColor="grape"
                      height={tableHeight}
                    />
                  </Grid.Col>
                </Grid>
              </Box>
              <Box
                mt={4}
                pl={`xs`}
                pr={8}
                pt={"6"}
                pb={"6"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid>
                  <Grid.Col span={6}></Grid.Col>
                  <Grid.Col span={6}>
                    <Stack right align="flex-end">
                      <>
                        {!saveCreateLoading && isOnline && (
                          <Button
                            disabled={generateButton}
                            onClick={async () => {
                              modals.openConfirmModal({
                                title: (
                                  <Text size="md">
                                    {" "}
                                    {t("SuretoProcessMatrixData")}
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
                                onCancel: () => console.log("Cancel"),
                                onConfirm: () => {
                                  handleGenerateMatrixBatch();
                                },
                              });
                            }}
                            size="xs"
                            color={`green.8`}
                            type="submit"
                            id="EntityFormSubmit"
                            leftSection={<IconDeviceFloppy size={16} />}
                          >
                            <Flex direction={`column`} gap={0}>
                              <Text fz={14} fw={400}>
                                {" "}
                                {t("Generate")}
                              </Text>
                            </Flex>
                          </Button>
                        )}
                      </>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Box>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
}
