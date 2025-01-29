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
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { IconX, IconDeviceFloppy } from "@tabler/icons-react";

const data = [
  {
    product:
      "Peasdasdssfsdfdsfsdfdsfsdfsdfda sdasdsfsdfsdfaasdasdasdasdasdasdsdasdasdasd",
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
  {
    product: "asd",
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
  {
    product: "Rubasber",
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
  {
    product: "Rasubber",
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
  {
    product: "Russbber",
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
  {
    product: "Raubber",
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
  {
    product: "12ubber",
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
  {
    product: "Ru12bber",
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
  {
    product: "Rubasber",
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
  {
    product: "Rubreber",
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
  {
    product: "Ruasdbber",
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
  {
    product: "Rubbasder",
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
  {
    product: "Rubasdber",
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
  {
    product: "Rppubber",
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
  {
    product: "Rasdubber",
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
  const leftTableRef = useRef(null);
  const centerTableRef = useRef(null);
  const rightTableRef = useRef(null);

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
                          title: "Product",
                          cellsClassName: matrixTable.idColumnCells,
                          width: 100,
                        },
                      ]}
                      records={data}
                      totalRecords={data.length}
                      loaderSize="xs"
                      loaderColor="grape"
                      height={tableHeight - 46}
                      scrollAreaProps={{ type: "never" }}
                    />
                  </Grid.Col>

                  <Grid.Col span={8}>
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
                      columns={shops.map((shop) => ({
                        accessor: shop.toLowerCase().replace(/\s+/g, "_"),
                        title: shop,
                        width: 150,
                        render: (item) => {
                          const shopKey = shop
                            .toLowerCase()
                            .replace(/\s+/g, "_");
                          const [editedQuantity, setEditedQuantity] = useState(
                            item[shopKey] || 0
                          );

                          const handleQuantityChange = (e) => {
                            const newQuantity = e.currentTarget.value;
                            setEditedQuantity(newQuantity);

                            const tempCardProducts = localStorage.getItem(
                              "temp-sales-products"
                            );
                            const cardProducts = tempCardProducts
                              ? JSON.parse(tempCardProducts)
                              : [];

                            const updatedProducts = cardProducts.map(
                              (product) => {
                                if (product.product_id === item.product_id) {
                                  return {
                                    ...product,
                                    [shopKey]: newQuantity,
                                    sub_total:
                                      newQuantity * (item.sales_price || 0),
                                  };
                                }
                                return product;
                              }
                            );

                            localStorage.setItem(
                              "temp-sales-products",
                              JSON.stringify(updatedProducts)
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
                      }))}
                      records={data}
                      totalRecords={data.length}
                      loaderSize="xs"
                      loaderColor="grape"
                      height={tableHeight - 46}
                    />
                  </Grid.Col>

                  <Grid.Col span={2}>
                    <DataTable
                      scrollAreaProps={{ type: "never" }}
                      scrollViewportRef={rightTableRef}
                      classNames={{
                        root: matrixTable.root,
                        table: matrixTable.table,
                        header: matrixTable.header,
                        footer: matrixTable.footer,
                        pagination: matrixTable.pagination,
                      }}
                      columns={[

                        {
                          accessor: "total_requested",
                          title: "Total Requested",
                        },
                        {
                          accessor: "opening_stock",
                          title: "Stock",
                        },
                        {
                          accessor: "remaining_stock",
                          title: "Remaining Stock",
                        },
                      ]}
                      records={data}
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
