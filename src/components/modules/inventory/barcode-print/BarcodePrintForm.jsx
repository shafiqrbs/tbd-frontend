import {
  ActionIcon,
  Group,
  Grid,
  Box,
  Title,
  Stack,
  Button,
  Flex,
  ScrollArea,
  Text,
  Checkbox,
  Table,
  Center,
} from "@mantine/core";
import SelectForm from "../../../form-builders/SelectForm";
import {
  IconUsersGroup,
  IconDeviceFloppy,
  IconSortAscendingNumbers,
  IconBarcode,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import Shortcut from "../../shortcut/Shortcut";
import InputForm from "../../../form-builders/InputForm";
import SelectServerSideForm from "../../../form-builders/SelectServerSideForm";

export default function BarcodePrintForm(props) {
  const { preview, setPreview, barcodeObjects, setBarcodeObjects } = props;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 100;

  const [saveCreateLoading, setSaveCreateLoading] = useState(false);
  const [barcodeTypeId, setBarcodeTypeId] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [print, setPrint] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [productDropdown, setProductDropdown] = useState([]);

  useEffect(() => {
    if (searchValue.length > 0) {
      const storedProducts = localStorage.getItem("core-products");
      const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

      // Filter products where product_nature is not 'raw-materials'
      const filteredProducts = localProducts.filter(
        (product) => product.product_nature !== "raw-materials"
      );

      const lowerCaseSearchTerm = searchValue.toLowerCase();
      const fieldsToSearch = ["product_name"];
      const productFilterData = filteredProducts.filter((product) =>
        fieldsToSearch.some(
          (field) =>
            product[field] &&
            String(product[field]).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
      const formattedProductData = productFilterData.map((type) => ({
        label: type.product_name,
        value: String(type.id),
      }));

      setProductDropdown(formattedProductData);
    } else {
      setProductDropdown([]);
    }
  }, [searchValue]);

  const handlePrint = () => {
    console.log("Barcode Objects:", barcodeObjects);

    setPrint(!print);

    if (!print) {
      const checkedBarcodes = barcodeObjects.filter((item) => item.is_checked);

      if (checkedBarcodes.length > 0) {
        localStorage.removeItem("barcode-objects");

        setTimeout(() => {
          setBarcodeObjects([]);
        }, 1000);
      }
    }
  };
  const handlePreview = () => {
    preview ? setPreview(false) : setPreview(true);
  };
  const form = useForm({
    initialValues: {
      barcode_type_id: "",
      quantity: "",
    },
    validate: {
      barcode_type_id: isNotEmpty(),
    },
  });
  const value = [
    { label: "Stock", value: "1" },
    { label: "Product batch", value: "2" },
    { label: "Unique Barcode", value: "3" },
  ];

  useHotkeys(
    [
      [
        "alt+n",
        () => {
          document.getElementById("barcode_type_id").click();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+r",
        () => {
          form.reset();
        },
      ],
    ],
    []
  );

  useHotkeys(
    [
      [
        "alt+s",
        () => {
          document.getElementById("EntityFormSubmit").click();
        },
      ],
    ],
    []
  );
  const rows =
    barcodeObjects &&
    barcodeObjects.map((item, index) => (
      <Table.Tr key={index}>
        <Table.Td fz="xs">{index + 1}</Table.Td>
        <Table.Td ta="left" fz="xs">
          {item.product_id}
        </Table.Td>
        <Table.Td ta="center" fz="xs">
          {item.quantity}
        </Table.Td>
        <Table.Td fz="xs">
          <Center>
            <Checkbox
              color="red"
              checked={item.is_checked || false}
              onChange={() => {
                // Create a new array with the updated item
                const updatedObjects = barcodeObjects.map((obj, idx) => {
                  if (idx === index) {
                    return { ...obj, is_checked: !obj.is_checked };
                  }
                  return obj;
                });
                setBarcodeObjects(updatedObjects);
              }}
            />
          </Center>
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <>
      <Grid columns={9} gutter={{ base: 8 }}>
        <Grid.Col span={8}>
          <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
            <Box bg={"white"}>
              {/* title box */}
              <Box
                pl={`xs`}
                pr={8}
                pt={"6"}
                pb={"6"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
              >
                <Grid>
                  <Grid.Col span={6}>
                    <Title order={6} pt={"6"}>
                      {t("CreateBarcodePrint")}
                    </Title>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack right align="flex-end">
                      <>
                        {!saveCreateLoading && isOnline && (
                          <Button
                            id="barcodePrintFormSubmit"
                            size="xs"
                            form="barcodePrintForm"
                            color={`red.6`}
                            type="submit"
                            leftSection={<IconDeviceFloppy size={16} />}
                          >
                            <Flex direction={`column`} gap={0}>
                              <Text fz={14} fw={400}>
                                {t("Add")}
                              </Text>
                            </Flex>
                          </Button>
                        )}
                      </>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Box>
              <Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
                <Box>
                  <form
                    id="barcodePrintForm"
                    onSubmit={form.onSubmit((values) => {
                      modals.openConfirmModal({
                        title: (
                          <Text size="md"> {t("FormConfirmationTitle")}</Text>
                        ),
                        children: (
                          <Text size="sm"> {t("FormConfirmationMessage")}</Text>
                        ),
                        labels: { confirm: t("Submit"), cancel: t("Cancel") },
                        confirmProps: { color: "red" },
                        onCancel: () => console.log("Cancel"),
                        // Fix the onConfirm function in the form submission:
                        onConfirm: () => {
                          const newBarcodeObject = {
                            ...values,
                            barcode_type_id: barcodeTypeId,
                            product_id: values.product_id,
                            quantity: values.quantity,
                            is_checked: false,
                          };

                          const updatedBarcodeObjects = [
                            ...barcodeObjects,
                            newBarcodeObject,
                          ];

                          localStorage.setItem(
                            "barcode-objects",
                            JSON.stringify(updatedBarcodeObjects)
                          );

                          setBarcodeObjects(updatedBarcodeObjects);

                          setBarcodeTypeId(null);
                          setSearchValue("");
                          form.reset();
                        },
                      });
                    })}
                  >
                    <Box mt={"8"}>
                      <SelectServerSideForm
                        tooltip={t("ChooseStockProduct")}
                        label={t("ChooseStockProduct")}
                        placeholder={t("ChooseStockProduct")}
                        required={false}
                        nextField={"barcode_type_id"}
                        name={"product_id"}
                        form={form}
                        id={"product_id"}
                        searchable={true}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        dropdownValue={productDropdown}
                        closeIcon={true}
                      />
                    </Box>
                    <Box mt={"8"}>
                      <SelectForm
                        tooltip={t("BarcodeType")}
                        label={t("BarcodeType")}
                        placeholder={t("ChooseBarcodeType")}
                        required={false}
                        nextField={"name"}
                        name={"barcode_type_id"}
                        form={form}
                        dropdownValue={value}
                        mt={8}
                        id={"barcode_type_id"}
                        searchable={false}
                        value={barcodeTypeId}
                        changeValue={setBarcodeTypeId}
                      />
                    </Box>
                    <Box mt={"md"}>
                      <Grid columns={24} gutter={{ base: 8 }}>
                        <Grid.Col span={5}>
                          <Text fz={14} fw={600} mt={8}>
                            {t("Quantity")}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Text ta={"center"} fz={14} fw={600} mt={8}>
                            {quantity}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={5}>
                          <Text fz={14} fw={600} mt={8}>
                            {t("PrintQuantity")}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={8}>
                          <InputForm
                            tooltip={t("PrintQuantity")}
                            label={t("")}
                            placeholder={t("PrintQuantity")}
                            required={false}
                            nextField={"barcodePrintFormSubmit"}
                            name={"quantity"}
                            leftSection={
                              <IconSortAscendingNumbers
                                size={16}
                                opacity={0.5}
                              />
                            }
                            form={form}
                            type={"number"}
                          />
                        </Grid.Col>
                      </Grid>
                    </Box>
                  </form>
                </Box>
                <ScrollArea
                  mt={"lg"}
                  h={height - 258}
                  scrollbarSize={2}
                  scrollbars="y"
                  type="never"
                  mr={-10}
                  ml={-10}
                >
                  <Box
                    pl={`xs`}
                    pr={8}
                    pt={"4"}
                    pb={"4"}
                    mb={"4"}
                    className={"boxBackground"}
                  >
                    <Title order={6} pt={"xs"} pb={"xs"}>
                      {t("BarcodePrintList")}
                    </Title>
                  </Box>
                  {barcodeObjects.length > 0 && (
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th fz="xs">{t("S/N")}</Table.Th>
                          <Table.Th fz="xs" ta="left">
                            {t("ProductName")}
                          </Table.Th>
                          <Table.Th fz="xs" ta="center">
                            {t("Quantity")}
                          </Table.Th>
                          <Table.Th fz="xs" ta="center">
                            {t("Enable")}
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                  )}
                </ScrollArea>
              </Box>
              <Box
                pl={`xs`}
                pr={8}
                pt={"6"}
                pb={"6"}
                mb={"4"}
                className={"boxBackground borderRadiusAll"}
                mt={4}
              >
                <Grid>
                  <Grid.Col span={6}></Grid.Col>
                  <Grid.Col span={6}>
                    <Group justify="flex-end">
                      <>
                        <Button
                          size="xs"
                          color={`green.8`}
                          onClick={handlePreview}
                          leftSection={<IconBarcode size={16} />}
                        >
                          <Flex direction={`column`} gap={0}>
                            <Text fz={14} fw={400}>
                              {t("Preview")}
                            </Text>
                          </Flex>
                        </Button>
                        <Button
                          size="xs"
                          color={`red.6`}
                          onClick={handlePrint}
                          leftSection={<IconBarcode size={16} />}
                        >
                          <Flex direction={`column`} gap={0}>
                            <Text fz={14} fw={400}>
                              {t("Print")}
                            </Text>
                          </Flex>
                        </Button>
                      </>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Grid.Col>
        <Grid.Col span={1}>
          <Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
            <Shortcut
              form={form}
              FormSubmit={"EntityFormSubmit"}
              Name={"barcode_type_id"}
              inputType="select"
            />
          </Box>
        </Grid.Col>
      </Grid>
    </>
  );
}
