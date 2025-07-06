import { Box } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import tableCss from "../../../../assets/css/Table.module.css";
import { useState } from "react";
import { DataTable } from "mantine-datatable";
import KeywordSearch from "../../filter/KeywordSearch";
import _ReconciliationViewDrawer from "./_ReconciliationViewDrawer";

export default function ReconciliationTable() {
  const { t } = useTranslation();
  const { isOnline, mainAreaHeight } = useOutletContext();
  const height = mainAreaHeight - 98;

  const [indexData, setIndexData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 50;
  const [viewDrawer, setViewDrawer] = useState(false);

  return (
    <>
      <Box
        pl={`xs`}
        pr={8}
        pt={"6"}
        pb={"4"}
        className={"boxBackground borderRadiusAll border-bottom-none"}
      >
        <KeywordSearch module={"reconciliation"} />
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
            { accessor: "product_name", title: t("Name") },
            { accessor: "warehouse", title: t("Warehouse") },
            { accessor: "quantity_id", title: t("QuantityMode") },
            { accessor: "quantity", title: t("Quantity") },
            { accessor: "bonus_id", title: t("BonusMode") },
            { accessor: "bonus_quantity", title: t("BonusQuantity") },
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
                        color='var(--theme-primary-color-6)'
                        radius="xl"
                        aria-label="Settings"
                      >
                        <IconDotsVertical
                          height={"16"}
                          width={"16"}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {}}
                        target="_blank"
                        component="a"
                        w={"200"}
                      >
                        {t("Edit")}
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          setViewDrawer(true);
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
                            confirmProps: { color: "red.6" },
                            labels: { confirm: "Confirm", cancel: "Cancel" },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => {
                              dispatch(
                                deleteEntityData(
                                  "inventory/stock-reconciliation/" + data.id
                                )
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
            setFetching(true);
          }}
          loaderSize="xs"
          loaderColor="grape"
          height={height}
          scrollAreaProps={{ type: "never" }}
        />
      </Box>
      {viewDrawer && (
        <_ReconciliationViewDrawer
          viewDrawer={viewDrawer}
          setViewDrawer={setViewDrawer}
        />
      )}
    </>
  );
}
