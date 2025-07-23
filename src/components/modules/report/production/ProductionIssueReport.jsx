import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress";
import {
  Progress,
  Box,
  Grid,
  Table,
} from "@mantine/core";
import ProductionHeaderNavbar from "../common/ProductionHeaderNavbar";
import ProductionNavigation from "../common/ProductionNavigation";
import {getIndexEntityData} from "../../../../store/core/crudSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useOutletContext} from "react-router-dom";
import batchTableCss from "../../../../assets/css/ProductBatchTable.module.css";
import {
  editEntityData,
} from "../../../../store/production/crudSlice.js";
import _ProductionReportSearch from "./_ProductionReportSearch.jsx";

export default function ProductionIssueReport() {
  const progress = getLoadingProgress();
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const { isOnline, mainAreaHeight} = useOutletContext();
  const height = mainAreaHeight - 120;

  const [batchReloadWithUpload, setBatchReloadWithUpload] = useState(false);

  const [indexData,setIndexData] = useState([])
  const [searchValue,setSearchValue] = useState(false)
  const fetching = useSelector((state) => state.productionCrudSlice.fetching);
  const [reloadBatchData,setReloadBatchData] = useState(false)
  const searchKeyword = useSelector((state) => state.productionCrudSlice.searchKeyword)
  const productionBatchFilterData = useSelector((state) => state.productionCrudSlice.productionBatchFilterData);
  const salesFilterData = useSelector(
      (state) => state.inventoryCrudSlice.salesFilterData
  );

  // console.log(salesFilterData)

  const perPage = 20;
  const [page,setPage] = useState(1);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  useEffect(() => {
    const fetchData = async () => {
      const value = {
        url: 'production/report/issue',
        param: {
          // term: searchKeyword,
          start_date: salesFilterData.start_date && new Date(salesFilterData.start_date).toLocaleDateString("en-CA", options),
          end_date: salesFilterData.end_date && new Date(salesFilterData.end_date).toLocaleDateString("en-CA", options),
          page: page,
          offset: perPage
        }
      }

      try {
        const resultAction = await dispatch(getIndexEntityData(value));
        // Handle rejected state
        if (getIndexEntityData.rejected.match(resultAction)) {
          console.error("Error:", resultAction);
        }
        // Handle fulfilled state
        else if (getIndexEntityData.fulfilled.match(resultAction)) {
          setIndexData(resultAction.payload)
        }
        setReloadBatchData(false);
      } catch (error) {
        console.error("Unexpected error in fetchData:", error);
      }finally {
        setSearchValue(false)
      }
    };
    // dispatch(editEntityData(`production/batch/11`));
    // Call the async function
    fetchData();
  }, [dispatch, fetching, reloadBatchData,searchValue]);

  /*const editedData = useSelector((state) => state.productionCrudSlice.entityEditData)
  const createTableData = () => {
    const allMaterials = new Map()
    indexData?.data?.batch_items?.forEach((item) => {
      item?.production_expenses?.forEach((expense) => {
        if (!allMaterials.has(expense.material_id)) {
          allMaterials.set(expense.material_id, {
            id: expense.material_id,
            material_name: expense.name,
            unit: expense.uom || "KG",
            opening_stock: expense.opening_quantity || 0,
            narayangonj_stock: expense.narayangonj_stock || 0,
            total_stock: (expense.opening_quantity || 0) + (expense.narayangonj_stock || 0),
            productions: {},
          })
        }
        const materialData = allMaterials.get(expense.material_id)
        materialData.productions[item.production_item_id] = {
          ...expense,
          production_item_name: item.name,
          batch_item_id: item.id,
          issue_quantity: item.issue_quantity || 0,
          receive_quantity: item.receive_quantity || 0,
          expense_quantity: expense.quantity || 0,
          less_quantity: expense.less_quantity || 0,
          more_quantity: expense.more_quantity || 0,
          remaining_stock: materialData.total_stock - (expense.quantity || 0),
        }
      })
    })
    return Array.from(allMaterials.values())
  }

  const tableData = createTableData()
  const productionItems = indexData?.data?.batch_items

  const calculateTotals = () => {
    const totals = {
      opening_stock: 0,
      narayangonj_stock: 0,
      total_stock: 0,
      issue_quantities: {},
      receive_quantities: {},
      total_issue: 0,
      total_expense: 0,
      total_less: 0,
      total_more: 0,
      remaining_stock: 0
    }

    tableData.forEach(material => {
      totals.opening_stock += material.opening_stock
      totals.narayangonj_stock += material.narayangonj_stock
      totals.total_stock += material.total_stock

      let materialTotalIssue = 0
      let materialTotalExpense = 0

      Object.values(material.productions).forEach(production => {
        materialTotalIssue += production.raw_issue_quantity || 0
        materialTotalExpense += production.needed_quantity || 0

        if (!totals.issue_quantities[production.production_item_id]) {
          totals.issue_quantities[production.production_item_id] = 0
        }
        totals.issue_quantities[production.production_item_id] += production.raw_issue_quantity || 0

        if (!totals.receive_quantities[production.production_item_id]) {
          totals.receive_quantities[production.production_item_id] = 0
        }
        totals.receive_quantities[production.production_item_id] += production.needed_quantity || 0
      })

      totals.total_issue += materialTotalIssue
      totals.total_expense += materialTotalExpense

      if (materialTotalIssue > materialTotalExpense) {
        totals.total_less += materialTotalIssue - materialTotalExpense
      } else {
        totals.total_more += materialTotalExpense - materialTotalIssue
      }

      totals.remaining_stock += material.total_stock - materialTotalExpense
    })

    return totals
  }

  console.log(indexData.data)*/


  const createTableData = (batches) => {
    const allMaterials = new Map();

    batches?.forEach((batch) => {
      batch?.batch_items?.forEach((item) => {
        item?.production_expenses?.forEach((expense) => {
          if (!allMaterials.has(expense.material_id)) {
            allMaterials.set(expense.material_id, {
              id: expense.material_id,
              material_name: expense.name,
              unit: expense.uom || "KG",
              opening_stock: expense.opening_quantity || 0,
              narayangonj_stock: expense.narayangonj_stock || 0,
              total_stock: (expense.opening_quantity || 0) + (expense.narayangonj_stock || 0),
              productions: {},
            });
          }

          const materialData = allMaterials.get(expense.material_id);

          materialData.productions[item.production_item_id] = {
            ...expense,
            production_item_name: item.name,
            batch_item_id: item.id,
            issue_quantity: item.issue_quantity || 0,
            receive_quantity: item.receive_quantity || 0,
            expense_quantity: expense.quantity || 0,
            less_quantity: expense.less_quantity || 0,
            more_quantity: expense.more_quantity || 0,
            remaining_stock: materialData.total_stock - (expense.quantity || 0),
          };
        });
      });
    });

    return Array.from(allMaterials.values());
  };

  const tableData = createTableData(indexData?.data || []);

// Optional: for productionItems (table headers)
//   const productionItems = indexData?.data?.flatMap((batch) => batch.batch_items);

  const getUniqueProductionItemsWithTotals = (batches) => {
    const productionMap = new Map();

    batches?.forEach((batch) => {
      batch?.batch_items?.forEach((item) => {
        const existing = productionMap.get(item.production_item_id);

        if (existing) {
          existing.issue_quantity += item.issue_quantity || 0;
          existing.receive_quantity += item.receive_quantity || 0;
        } else {
          productionMap.set(item.production_item_id, {
            id: item.id,
            name: item.name,
            production_item_id: item.production_item_id,
            issue_quantity: item.issue_quantity || 0,
            receive_quantity: item.receive_quantity || 0,
          });
        }
      });
    });

    return Array.from(productionMap.values());
  };

  const productionItems = getUniqueProductionItemsWithTotals(indexData?.data);


  return (
      <>
        {progress !== 100 && (
            <Progress
                color='var(--theme-primary-color-6)'
                size={"sm"}
                striped
                animated
                value={progress}
                transitionDuration={200}
            />
        )}
        {progress === 100 && (
            <Box>
              <ProductionHeaderNavbar
                  pageTitle={t("ProductionBatch")}
                  roles={t("Roles")}
                  setBatchReloadWithUpload={setBatchReloadWithUpload}
              />
              <Box p={8}>
                <Grid columns={24} gutter={{ base: 8 }}>
                  <Grid.Col span={1}>
                    <ProductionNavigation module={"batch"} />
                  </Grid.Col>
                  <Grid.Col span={23}>
                    <Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
                      <Box pl={`xs`} pb={'xs'} pr={8} pt={'xs'} mb={'xs'} className={'boxBackground borderRadiusAll'} >
                        <_ProductionReportSearch module={'production-batch'} setSearchValue={setSearchValue} />
                      </Box>
                      <Box className="borderRadiusAll">
                        <div
                            className={batchTableCss.responsiveTableWrapper}
                            style={{
                              height: height,
                              minHeight: "300px",
                              overflowY: "auto",
                              overflowX: "auto",
                            }}
                        >
                          <Table
                              stickyHeader
                              withTableBorder
                              withColumnBorders
                              striped
                              highlightOnHover
                              className={batchTableCss.table}
                          >
                            <Table.Thead>
                              <Table.Tr className={batchTableCss.topRowBackground}>
                                <Table.Th rowSpan={3} colSpan={5} ta="center">Basic Information</Table.Th>
                                <Table.Th ta="center" colSpan={productionItems?.length * 2 || 0}>
                                  Issue Production Quantity
                                </Table.Th>
                                <Table.Th ta="center" colSpan={4}>
                                  Total Expense Material
                                </Table.Th>
                                <Table.Th ta="center" colSpan={2}>
                                  Current Stock Status
                                </Table.Th>
                              </Table.Tr>
                              <Table.Tr>
                                {productionItems?.map((item) => (
                                    <React.Fragment key={`issue-${item.id}`}>
                                      <Table.Th className={batchTableCss.successBackground}
                                                ta="center">Issue</Table.Th>
                                      <Table.Th className={batchTableCss.warningBackground}
                                                ta="center">Receive</Table.Th>
                                    </React.Fragment>
                                ))}
                                <Table.Th className={batchTableCss.highlightedCell} rowSpan={3}
                                          ta="center">Issue</Table.Th>
                                <Table.Th className={batchTableCss.highlightedCell} rowSpan={3}
                                          ta="center">Expense</Table.Th>
                                <Table.Th className={batchTableCss.highlightedCell} rowSpan={3}
                                          ta="center">Less</Table.Th>
                                <Table.Th className={batchTableCss.highlightedCell} rowSpan={3}
                                          ta="center">More</Table.Th>
                                <Table.Th className={batchTableCss.errorBackground} rowSpan={3} ta="center">Stock
                                  In</Table.Th>
                                <Table.Th className={batchTableCss.warningDarkBackground} rowSpan={3} ta="center">Remaining
                                  Stock</Table.Th>
                              </Table.Tr>
                              <Table.Tr>
                                {productionItems?.map((item) => (
                                    <React.Fragment key={`values-${item.id}`}>
                                      <Table.Td className={batchTableCss.successBackground}>
                                        {item.issue_quantity}
                                      </Table.Td>
                                      <Table.Td className={batchTableCss.warningBackground}>
                                        {item.receive_quantity}
                                      </Table.Td>
                                    </React.Fragment>
                                ))}
                              </Table.Tr>
                              <Table.Tr className={batchTableCss.highlightedRow}>
                                <Table.Th>Material Item</Table.Th>
                                <Table.Th>Unit</Table.Th>
                                <Table.Th>Opening</Table.Th>
                                <Table.Th>Narayangonj</Table.Th>
                                <Table.Th>Total Stock</Table.Th>
                                {productionItems?.map((item) => (
                                    <Table.Th key={`header-${item.id}`} ta="center" colSpan={2} color={'red'}
                                              style={{fontWeight: 1000}}>
                                      {item.name}
                                    </Table.Th>
                                ))}
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {tableData.map((material) => {
                                let materialTotalIssue = 0
                                let materialTotalExpense = 0
                                let materialTotalLess = 0
                                let materialTotalMore = 0

                                Object.values(material.productions).forEach(production => {
                                  materialTotalIssue += production.raw_issue_quantity || 0
                                  materialTotalExpense += production.needed_quantity || 0

                                  if (production.raw_issue_quantity > production.needed_quantity) {
                                    materialTotalLess += production.raw_issue_quantity - production.needed_quantity
                                  } else {
                                    materialTotalMore += production.needed_quantity - production.raw_issue_quantity
                                  }
                                })

                                const remainingStock = material.total_stock - materialTotalExpense
                                const isNegative = remainingStock < 0
                                const remainingStockText = isNegative ? `(${Math.abs(remainingStock)})` : remainingStock

                                return (
                                    <Table.Tr key={material.id}>
                                      <Table.Td>{material.material_name}</Table.Td>
                                      <Table.Td>{material.unit}</Table.Td>
                                      <Table.Td>{material.opening_stock}</Table.Td>
                                      <Table.Td>{material.narayangonj_stock}</Table.Td>
                                      <Table.Td>{material.total_stock}</Table.Td>

                                      {productionItems?.map((item) => {
                                        const production = material.productions[item.production_item_id]
                                        return (
                                            <React.Fragment key={`prod-${item.id}-${material.id}`}>
                                              <Table.Td className={batchTableCss.successBackground}>
                                                {production?.raw_issue_quantity || 0}
                                              </Table.Td>
                                              <Table.Td className={batchTableCss.warningBackground}>
                                                {production?.needed_quantity ? production?.needed_quantity : '-'}
                                              </Table.Td>
                                            </React.Fragment>
                                        )
                                      })}

                                      <Table.Td>{materialTotalIssue}</Table.Td>
                                      <Table.Td>{materialTotalExpense}</Table.Td>
                                      <Table.Td>{materialTotalLess}</Table.Td>
                                      <Table.Td>{materialTotalMore}</Table.Td>
                                      <Table.Td className={batchTableCss.errorBackground}>
                                        {material.total_stock}
                                      </Table.Td>
                                      <Table.Td className={batchTableCss.warningDarkBackground}>
                                        {`${isNegative ? '-' : ''}${Math.abs(remainingStock)}`}
                                      </Table.Td>
                                    </Table.Tr>
                                )
                              })}
                            </Table.Tbody>
                          </Table>
                        </div>
                      </Box>
                    </Box>
                  </Grid.Col>
                </Grid>
              </Box>
            </Box>
        )}
      </>
  );
}
