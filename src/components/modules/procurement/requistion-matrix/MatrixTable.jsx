import {
  ActionIcon,
  Box,
  Center,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  Button,
  Flex,
} from "@mantine/core";
import _RequisitionSearch from "../purchase-requisition/_RequisitionSearch";
import _ShortcutTable from "../../shortcut/_ShortcutTable";
import { DataTable } from "mantine-datatable";
import matrixTable from "./Table.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { IconX, IconDeviceFloppy } from "@tabler/icons-react";

const data = [
  {
    product: "Peasdasdssfsdfdsfsdfdsfsdfsdfda sdasdsfsdfsdfaasdasdasdasdasdasdsdasdasdasd",
    agora: 10,
    shopno: 5,
    apex: 8,
    bata: 8,
    bay: 8,
    apple: 8,
    kfc: 8,
    secret_receipe: 8,
    tasty_treat: 8,
    khanas: 8,
    kakoli_furniture: 8,
    hatil: 8,
    paris_furniture: 8,
    akhtar_furniture: 8,
    opening_stock: 10,
  },
  {
    product: "Pencil",
    agora: 20,
    shopno: 15,
    apex: 12,
    bata: 8,
    bay: 8,
    apple: 8,
    kfc: 8,
    secret_receipe: 8,
    tasty_treat: 8,
    khanas: 8,
    kakoli_furniture: 8,
    hatil: 8,
    paris_furniture: 8,
    akhtar_furniture: 8,
    opening_stock: 10,
  },
  {
    product: "Rubber",
    agora: 7,
    shop2: 9,
    apex: 6,
    bata: 8,
    bay: 8,
    apple: 8,
    kfc: 8,
    secret_receipe: 8,
    tasty_treat: 8,
    khanas: 8,
    kakoli_furniture: 8,
    hatil: 8,
    paris_furniture: 8,
    akhtar_furniture: 8,
    opening_stock: 10,
  },
];
const shops = [
  "Agora",
  "Shopno",
  "Apex",
  "Bata",
  "Bay",
  "Apple",
  "KFC",
  "Secret Receipe",
  "Tasty Treat",
  "Khanas",
  "Kakoli Furniture",
  "Hatil",
  "Paris Furniture",
  "Akhtar Furniture",
];
export default function MatrixTable(props) {
  const fetching = useSelector((state) => state.crudSlice.fetching);
  const perPage = 50;
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const tableHeight = mainAreaHeight - 106;
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
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
              <Grid>
                <Grid.Col>
                  <_RequisitionSearch checkList={1} customerId={1} />
                </Grid.Col>
              </Grid>
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
      <Box>
        <Grid columns={24} gutter={{ base: 8 }}>
          <Grid.Col span={23}>
            <Box bg={"white"} p={"xs"} className="borderRadiusAll">
              <Box className="borderRadiusAll">
                <Grid columns={12} gutter={0}>
                  <Grid.Col span={2}>
                    <DataTable
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
                          title: "Product",
                          cellsClassName: matrixTable.idColumnCells,
                          width : 100
                        },
                      ]}
                      records={data}
                      totalRecords={data.length}
                      loaderSize="xs"
                      loaderColor="grape"
                      height={tableHeight - 46}
                    />
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <DataTable
                      classNames={{
                        root: matrixTable.root,
                        table: matrixTable.table,
                        header: matrixTable.header,
                        footer: matrixTable.footer,
                        pagination: matrixTable.pagination,
                      }}
                      columns={[
                        ...shops.map((shop) => ({
                          accessor: shop.toLowerCase().replace(/\s+/g, "_"),
                          title: shop,
                          width: 150,
                          render: (item) => {
                            const shopKey = shop
                              .toLowerCase()
                              .replace(/\s+/g, "_"); // Dynamic key for shop

                            const [editedQuantity, setEditedQuantity] =
                              useState(item[shopKey] || 0); // Default quantity

                            const handleQuantityChange = (e) => {
                              const newQuantity = e.currentTarget.value;
                              setEditedQuantity(newQuantity);

                              // Get the existing data
                              const tempCardProducts = localStorage.getItem(
                                "temp-sales-products"
                              );
                              const cardProducts = tempCardProducts
                                ? JSON.parse(tempCardProducts)
                                : [];

                              // Update the relevant shop quantity
                              const updatedProducts = cardProducts.map(
                                (product) => {
                                  if (product.product_id === item.product_id) {
                                    return {
                                      ...product,
                                      [shopKey]: newQuantity, // Update specific shop quantity
                                      sub_total:
                                        newQuantity * (item.sales_price || 0), // Update sub-total
                                    };
                                  }
                                  return product;
                                }
                              );
                            };

                            return (
                              <TextInput
                                type="number"
                                size="xs"
                                value={editedQuantity}
                                onChange={handleQuantityChange}
                              />
                            );
                          },
                        })),
                        // {
                        //   accessor: "remaining_stock",
                        //   title: "Remaining Stock",
                        //   width: 150,
                        //   pinned: true,
                        // },
                        // {
                        //   accessor: "action",
                        //   title: t("Action"),
                        //   textAlign: "right",
                        //   fixed: "right",
                        //   render: (item) => (
                        //     <Group gap={4} justify="right" wrap="nowrap">
                        //       <Text fz={"xs"} fw={500}>
                        //         8
                        //       </Text>
                        //       <ActionIcon
                        //         size="sm"
                        //         variant="subtle"
                        //         color="red"
                        //         onClick={() => {}}
                        //       >
                        //         <IconX
                        //           size={16}
                        //           style={{ width: "70%", height: "70%" }}
                        //           stroke={1.5}
                        //         />
                        //       </ActionIcon>
                        //     </Group>
                        //   ),
                        // },
                      ]}
                      records={data}
                      totalRecords={data.length}
                      loaderSize="xs"
                      loaderColor="grape"
                      height={tableHeight - 46}
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <DataTable
                      classNames={{
                        root: matrixTable.root,
                        table: matrixTable.table,
                        header: matrixTable.header,
                        footer: matrixTable.footer,
                        pagination: matrixTable.pagination,
                      }}
                      columns={[
                        {
                          accessor: "opening_stock",
                          title: "Opening Stock",
                        },
                        {
                          accessor: "remaining_stock",
                          title: "Remaining Stock",
                        },
                        // {
                        //   accessor: "action",
                        //   title: t("Action"),
                        //   textAlign: "right",
                        //   fixed: "right",
                        //   render: (item) => (
                        //     <Group gap={4} justify="right" wrap="nowrap">
                        //       <Text fz={"xs"} fw={500}>
                        //         8
                        //       </Text>
                        //       <ActionIcon
                        //         size="sm"
                        //         variant="subtle"
                        //         color="red"
                        //         onClick={() => {}}
                        //       >
                        //         <IconX
                        //           size={16}
                        //           style={{ width: "70%", height: "70%" }}
                        //           stroke={1.5}
                        //         />
                        //       </ActionIcon>
                        //     </Group>
                        //   ),
                        // },
                      ]}
                      records={data}
                      pinFirstColumn
                      totalRecords={data.length}
                      loaderSize="xs"
                      loaderColor="grape"
                      height={tableHeight - 46}
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
          <Grid.Col span={1}>
            <Box bg={"white"} pt={16} className="borderRadiusAll">
              <_ShortcutTable heightOffset={0} />
            </Box>
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
}
