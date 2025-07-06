import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    rem,
    Grid,
    Tooltip,
    TextInput,
    ActionIcon,
    Button,
    Flex,
    Menu, Group,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
    IconArrowRight,
    IconFilter,
    IconInfoCircle,
    IconRestore,
    IconSearch,
    IconX,
    IconLoader,
    IconDotsVertical, IconDeviceFloppy, IconPlus,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import FilterModel from "../../filter/FilterModel.jsx";
import {
  setFetching,
  setPurchaseItemsFilterData,
} from "../../../../store/inventory/crudSlice.js";
import { DateInput } from "@mantine/dates";
import FileUploadModel from "../../../core-component/FileUploadModel.jsx";
import __FilterPopover from "./__FilterPopover"
import AddProductDrawer from "../sales/drawer-form/AddProductDrawer";

function _OpeningSearch(props) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOnline } = useOutletContext();
  const {module} = props
  const [productDrawer, setProductDrawer] = useState(false);
  const [stockProductRestore, setStockProductRestore] = useState(false)
  const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
  const [startDateTooltip, setStartDateTooltip] = useState(false);
  const [endDateTooltip, setEndDateTooltip] = useState(false);
  const [filterModel, setFilterModel] = useState(false);
  const [uploadOpeningStockModel, setUploadOpeningStockModel] = useState(false);

  const purchaseItemsFilterData = useSelector(
    (state) => state.inventoryCrudSlice.purchaseItemsFilterData
  );
  let [resetKey, setResetKey] = useState(0);

  const resetDropDownState = () => setResetKey((prevKey) => prevKey + 1);

  useHotkeys(
    [
      [
        "alt+F",
        () => {
          document.getElementById("SearchKeyword").focus();
        },
      ],
    ],
    []
  );

  return (
    <>
      {module === 'opening-approve-stock' && (
          <Grid columns={14} justify="flex-end" align="flex-end">
          <Grid.Col span={10}>
              <Tooltip
                  label={t("EnterSearchAnyKeyword")}
                  opened={searchKeywordTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color='var(--theme-primary-color-6)'
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
              >
                  <TextInput
                      leftSection={<IconSearch size={16} opacity={0.5} />}
                      size="sm"
                      placeholder={t("EnterSearchAnyKeyword")}
                      onChange={(e) => {
                          dispatch(
                              setPurchaseItemsFilterData({
                                  ...purchaseItemsFilterData,
                                  ["searchKeyword"]: e.currentTarget.value,
                              })
                          );
                          e.target.value !== ""
                              ? setSearchKeywordTooltip(false)
                              : (setSearchKeywordTooltip(true),
                                  setTimeout(() => {
                                      setSearchKeywordTooltip(false);
                                  }, 1000));
                      }}
                      value={purchaseItemsFilterData.searchKeyword}
                      id={"SearchKeyword"}
                      rightSection={
                          purchaseItemsFilterData.searchKeyword ? (
                              <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                                  <IconX
                                      color={`red`}
                                      size={16}
                                      opacity={0.5}
                                      onClick={() => {
                                          dispatch(
                                              setPurchaseItemsFilterData({
                                                  ...purchaseItemsFilterData,
                                                  ["searchKeyword"]: "",
                                              })
                                          );
                                      }}
                                  />
                              </Tooltip>
                          ) : (
                              <Tooltip
                                  label={t("FieldIsRequired")}
                                  withArrow
                                  position={"bottom"}
                                  c={"red"}
                                  bg={`red.1`}
                              >
                                  <IconInfoCircle size={16} opacity={0.5} />
                              </Tooltip>
                          )
                      }
                  />
              </Tooltip>
          </Grid.Col>
          <Grid.Col span={2}>
          <ActionIcon.Group mt={"1"}>
          <ActionIcon
          variant="transparent"
          c={"red.4"}
          size="lg"
          mr={8}
          aria-label="Filter"
          onClick={() => {
          purchaseItemsFilterData.searchKeyword.length > 0 ||
          purchaseItemsFilterData.start_date
              ? (dispatch(setFetching(true)),
                  setSearchKeywordTooltip(false))
              : (setSearchKeywordTooltip(true),
                  setTimeout(() => {
                      setSearchKeywordTooltip(false);
                  }, 1500));
      }}
          >
          <Tooltip
          label={t("SearchButton")}
          px={16}
          py={2}
          withArrow
          position={"bottom"}
          c={"red"}
          bg={`red.1`}
          transitionProps={{
          transition: "pop-bottom-left",
          duration: 500,
      }}
          >
          <IconSearch style={{ width: rem(20) }} stroke={2.0} />
          </Tooltip>
          </ActionIcon>

          <__FilterPopover />

          <ActionIcon
          variant="transparent"
          c={"gray.6"}
          size="lg"
          aria-label="Settings"
          >
          <Tooltip
          label={t("ResetButton")}
          px={16}
          py={2}
          withArrow
          position={"bottom"}
          c={"red"}
          bg={`red.1`}
          transitionProps={{
          transition: "pop-bottom-left",
          duration: 500,
      }}
          >
          <IconRestore
          style={{ width: rem(20) }}
          stroke={2.0}
          onClick={() => {
          dispatch(setFetching(true));
          resetDropDownState();
          dispatch(
              setPurchaseItemsFilterData({
                  ...purchaseItemsFilterData,
                  ["start_date"]: "",
                  ["end_date"]: "",
                  ["searchKeyword"]: "",
              })
          );
      }}
          />
          </Tooltip>
          </ActionIcon>
          </ActionIcon.Group>
          </Grid.Col>
          <Grid.Col span={2}>
      <Flex justify="flex-end" align="center" gap={"xs"}>
        <Button
          onClick={(e) => {
            navigate("/inventory/opening-stock");
          }}
          size="sm"
          c={"red.8"}
          variant="link"
          bg={"#f7f4f4"}
          mt={0}
          rightSection={<IconArrowRight size={16} />}
        >
          {t("OpeningStock")}
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
              size="md"
              variant="transparent"
              color='var(--theme-primary-color-6)'
              aria-label="Settings"
            >
              <IconDotsVertical height={"20"} width={"20"} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={(e) => {
                setUploadOpeningStockModel(true);
              }}
              component="a"
              bg={"#d7e8cd"}
              w={"200"}
              rightSection={
                <IconLoader style={{ width: rem(14), height: rem(14) }} />
              }
            >
              {t("Upload")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Grid.Col>
          </Grid>
      )}
      {module === 'opening-stock' && (
          <Grid columns={14} justify="flex-end" align="flex-end">
          <Grid.Col span={8}>
              <Tooltip
                  label={t("EnterSearchAnyKeyword")}
                  opened={searchKeywordTooltip}
                  px={16}
                  py={2}
                  position="top-end"
                  color='var(--theme-primary-color-6)'
                  withArrow
                  offset={2}
                  zIndex={100}
                  transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
              >
                  <TextInput
                      leftSection={<IconSearch size={16} opacity={0.5} />}
                      size="sm"
                      placeholder={t("EnterSearchAnyKeyword")}
                      onChange={(e) => {
                          dispatch(
                              setPurchaseItemsFilterData({
                                  ...purchaseItemsFilterData,
                                  ["searchKeyword"]: e.currentTarget.value,
                              })
                          );
                          e.target.value !== ""
                              ? setSearchKeywordTooltip(false)
                              : (setSearchKeywordTooltip(true),
                                  setTimeout(() => {
                                      setSearchKeywordTooltip(false);
                                  }, 1000));
                      }}
                      value={purchaseItemsFilterData.searchKeyword}
                      id={"SearchKeyword"}
                      rightSection={
                          purchaseItemsFilterData.searchKeyword ? (
                              <Tooltip label={t("Close")} withArrow bg={`red.5`}>
                                  <IconX
                                      color={`red`}
                                      size={16}
                                      opacity={0.5}
                                      onClick={() => {
                                          dispatch(
                                              setPurchaseItemsFilterData({
                                                  ...purchaseItemsFilterData,
                                                  ["searchKeyword"]: "",
                                              })
                                          );
                                      }}
                                  />
                              </Tooltip>
                          ) : (
                              <Tooltip
                                  label={t("FieldIsRequired")}
                                  withArrow
                                  position={"bottom"}
                                  c={"red"}
                                  bg={`red.1`}
                              >
                                  <IconInfoCircle size={16} opacity={0.5} />
                              </Tooltip>
                          )
                      }
                  />
              </Tooltip>
          </Grid.Col>
          <Grid.Col span={2}>
          <ActionIcon.Group mt={"1"}>
          <ActionIcon
          variant="transparent"
          c={"red.4"}
          size="lg"
          mr={8}
          aria-label="Filter"
          onClick={() => {
          purchaseItemsFilterData.searchKeyword.length > 0 ||
          purchaseItemsFilterData.start_date
              ? (dispatch(setFetching(true)),
                  setSearchKeywordTooltip(false))
              : (setSearchKeywordTooltip(true),
                  setTimeout(() => {
                      setSearchKeywordTooltip(false);
                  }, 1500));
      }}
          >
          <Tooltip
          label={t("SearchButton")}
          px={16}
          py={2}
          withArrow
          position={"bottom"}
          c={"red"}
          bg={`red.1`}
          transitionProps={{
          transition: "pop-bottom-left",
          duration: 500,
      }}
          >
          <IconSearch style={{ width: rem(20) }} stroke={2.0} />
          </Tooltip>
          </ActionIcon>

          <__FilterPopover />

          <ActionIcon
          variant="transparent"
          c={"gray.6"}
          size="lg"
          aria-label="Settings"
          >
          <Tooltip
          label={t("ResetButton")}
          px={16}
          py={2}
          withArrow
          position={"bottom"}
          c={"red"}
          bg={`red.1`}
          transitionProps={{
          transition: "pop-bottom-left",
          duration: 500,
      }}
          >
          <IconRestore
          style={{ width: rem(20) }}
          stroke={2.0}
          onClick={() => {
          dispatch(setFetching(true));
          resetDropDownState();
          dispatch(
              setPurchaseItemsFilterData({
                  ...purchaseItemsFilterData,
                  ["start_date"]: "",
                  ["end_date"]: "",
                  ["searchKeyword"]: "",
              })
          );
      }}
          />
          </Tooltip>
          </ActionIcon>
          </ActionIcon.Group>
          </Grid.Col>
          <Grid.Col span={4}>
          <Flex justify="flex-end" align="center" gap={"xs"}>
              <Tooltip
                  multiline
                  bg={'orange.8'}
                  position="top"
                  withArrow
                  ta={'center'}
                  offset={{ crossAxis: '-50', mainAxis: '5' }}
                  transitionProps={{ duration: 200 }}
                  label={t('InstantProductCreate')}
              >
                  <ActionIcon
                      mr={'sm'}
                      variant="outline"
                      size={'lg'}
                      color="red.5"
                      aria-label="Settings"
                      onClick={() => setProductDrawer(true)}
                  >
                      <IconPlus style={{ width: '100%', height: '70%' }}
                                stroke={1.5} />
                  </ActionIcon>
              </Tooltip>
              <Button onClick={(e) => {
                  dispatch(setPurchaseItemsFilterData({...purchaseItemsFilterData, ['searchKeyword']: ''}))
                  navigate('/inventory/opening-approve-stock')
              }}
                      size="sm"
                      c={"red.8"}
                      variant="link"
                      bg={"#f7f4f4"}
                      rightSection={<IconArrowRight size={16} />}
              >
                  {t("ApproveStock")}
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
                          size="md"
                          variant="transparent"
                          color='var(--theme-primary-color-6)'
                          aria-label="Settings"
                      >
                          <IconDotsVertical height={"20"} width={"20"} stroke={1.5} />
                      </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                      <Menu.Item
                          onClick={(e) => {
                              setUploadOpeningStockModel(true);
                          }}
                          component="a"
                          bg={"#d7e8cd"}
                          w={"200"}
                          rightSection={
                              <IconLoader style={{ width: rem(14), height: rem(14) }} />
                          }
                      >
                          {t("Upload")}
                      </Menu.Item>
                  </Menu.Dropdown>
              </Menu>
          </Flex>
      </Grid.Col>
          </Grid>
      )}
      {filterModel && (
        <FilterModel
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          module={props.module}
        />
      )}
        {productDrawer &&
        <AddProductDrawer
            productDrawer={productDrawer}
            setProductDrawer={setProductDrawer}
            setStockProductRestore={setStockProductRestore}
            focusField={'product_id'}
            fieldPrefix="purchase_"
        />
        }
      {uploadOpeningStockModel && (
        <FileUploadModel
          modelStatus={uploadOpeningStockModel}
          setFileUploadStateFunction={setUploadOpeningStockModel}
          filyType={"Opening-Stock"}
          tableDataLoading={props.tableDataLoading}
        />
      )}
    </>
  );
}

export default _OpeningSearch;
