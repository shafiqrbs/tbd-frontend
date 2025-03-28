import {
  Drawer,
  Text,
  Box,
  ActionIcon,
  ScrollArea,
  Stack,
  Grid,
  Checkbox,
  Center,
  Title,
  Button,
  Flex,
} from "@mantine/core";
import { IconX, IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";

export default function __DrawerAddon(props) {
  const { addonDrawer, setAddonDrawer, id } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mainAreaHeight, isOnline } = useOutletContext();
  const height = mainAreaHeight;
  const [indexData, setIndexData] = useState(null);
  const [saveCreateLoading, setSaveCreateLoading] = useState(false);

  const [addonMap, setAddonMap] = useState({});

  useEffect(() => {
    console.log(id)
    setIndexData({
      data: [
        {
          id: 1,
          name: "Product 1",
          description: "Product 1 Description",
          price: 100,
          quantity: 10,
          category: "Category 1",
          status: "Active",
        },
        {
          id: 2,
          name: "Product 2",
          description: "Product 2 Description",
          price: 200,
          quantity: 20,
          category: "Category 2",
          status: "Active",
        },
        {
          id: 3,
          name: "Product 3",
          description: "Product 3 Description",
          price: 300,
          quantity: 30,
          category: "Category 3",
          status: "Active",
        },
      ],
    });

  }, [id]);

  const closeDrawer = () => {
    setAddonDrawer(false);
  };

  const handleToggleAddon = (addon) => {
    setAddonMap((prevMap) => {
      const newMap = { ...prevMap };

      if (prevMap[addon.id]) {

        delete newMap[addon.id];
      } else {
        newMap[addon.id] = addon;
      }

      return newMap;
    });
  };

  const handleSaveAddons = async () => {
    try {
      setSaveCreateLoading(true);
      const selectedAddonIds = Object.keys(addonMap);

      console.log("Saving add-ons for product ID:", id);
      console.log("Selected add-on IDs:", selectedAddonIds);

      notifications.show({
        title: t("Success"),
        message: t("Add-ons updated successfully"),
        color: "green",
      });

      closeDrawer();
    } catch (error) {
      console.error("Error saving add-ons:", error);
      notifications.show({
        title: t("Error"),
        message: t("Failed to update add-ons"),
        color: "red",
      });
    } finally {
      setSaveCreateLoading(false);
    }
  };

  return (
    <>
      <Drawer.Root
        opened={addonDrawer}
        position="right"
        onClose={closeDrawer}
        size={"30%"}
        bg={"gray.1"}
        closeOnClickOutside={true}
      >
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <Text fw={"600"} fz={"16"}>
                {t("ProductAddon")}
              </Text>
            </Drawer.Title>
            <ActionIcon
              className="ActionIconCustom"
              radius="xl"
              color="red.6"
              size="lg"
              onClick={closeDrawer}
            >
              <IconX
                style={{ width: "70%", height: "70%", paddingLeft: "2px" }}
                stroke={1.5}
              />
            </ActionIcon>
          </Drawer.Header>
          <Drawer.Body>
            <Box mb={0} bg={"white"}>
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
                      {t("ProductAddon")}
                    </Title>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack right align="flex-end">
                      <>
                        {!saveCreateLoading && isOnline && (
                          <Button
                            size="xs"
                            color={`green.8`}
                            onClick={handleSaveAddons}
                            leftSection={<IconDeviceFloppy size={16} />}
                            loading={saveCreateLoading}
                          >
                            <Flex direction={`column`} gap={0}>
                              <Text fz={14} fw={400}>
                                {t("Update")}
                              </Text>
                            </Flex>
                          </Button>
                        )}
                      </>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Box>
              <ScrollArea
                className="boxBackground borderRadiusAll"
                h={height - 50}
              >
                <DataTable
                  classNames={{
                    root: tableCss.root,
                    table: tableCss.table,
                    header: tableCss.header,
                    footer: tableCss.footer,
                    pagination: tableCss.pagination,
                  }}
                  records={indexData?.data}
                  columns={[
                    {
                      accessor: "id",
                      title: "S/N",
                      width: 48,
                      render: (data, index) => index + 1,
                    },
                    {
                      accessor: "name",
                      title: t("Name"),
                    },
                    {
                      accessor: "status",
                      title: t("Status"),
                      textAlign: "center",
                      render: (data) => (
                        <>
                          <Center>
                            <Checkbox
                              color="red.6"
                              variant="filled"
                              checked={!!addonMap[data.id]}
                              onChange={() => handleToggleAddon(data)}
                            />
                          </Center>
                        </>
                      ),
                    },
                  ]}
                  loaderSize="xs"
                  loaderColor="grape"
                  height={height - 52}
                  scrollAreaProps={{ type: "never" }}
                />
              </ScrollArea>
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
