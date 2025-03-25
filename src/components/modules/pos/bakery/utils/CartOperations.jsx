import { useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { storeEntityData } from "../../../../../store/inventory/crudSlice";
import { useDispatch } from "react-redux";
import { showNotificationComponent } from "../../../../core-component/showNotificationComponent";
storeEntityData;

export const useCartOperations = ({
  enableTable,
  tableId,
  products,
  currentStatus,
  updateTableStatus,
  setLoadCartProducts,
  tables,
  setTables,
  setReloadInvoiceData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getStorageKey = useCallback(() => {
    return enableTable && tableId
      ? `table-${tableId}-pos-products`
      : "temp-pos-products";
  }, [enableTable, tableId]);

  const getCartProducts = useCallback(() => {
    const cartProducts = localStorage.getItem(getStorageKey());
    return cartProducts ? JSON.parse(cartProducts) : [];
  }, [getStorageKey]);

  const updateTableStatusIfNeeded = useCallback(
    (cartLength) => {
      if (!enableTable || !tableId) return;

      if (cartLength === 1 && currentStatus === "Free") {
        updateTableStatus("Occupied");
      } else if (cartLength === 0 && currentStatus === "Occupied") {
        // Update both table status and tables state
        updateTableStatus("Free");
        if (tables && setTables) {
          setTables(
            tables.map((table) =>
              table.id === tableId ? { ...table, status: "Free" } : table
            )
          );
        }
      }
    },
    [enableTable, tableId, currentStatus, updateTableStatus, tables, setTables]
  );

  const handleIncrement = useCallback(
    async (productId) => {
      if (!products) {
        const storedProducts = localStorage.getItem("core-products");
        const allProducts = storedProducts ? JSON.parse(storedProducts) : [];
        product = allProducts.find((p) => p.id === productId);
      }
      const product = products?.find((p) => p.id === productId);
      const data = {
        url: "inventory/pos/inline-update",
        data: {
          invoice_id: tableId,
          field_name: "items",
          value: {
            ...product,
            quantity: 1,
          },
        },
      };
      try {
        const resultAction = await dispatch(storeEntityData(data));

        if (resultAction.payload?.status !== 200) {
          showNotificationComponent(
            resultAction.payload?.message || "Error updating invoice",
            "red",
            "",
            "",
            true
          );
        }
      } catch (error) {
        showNotificationComponent(
          "Request failed. Please try again.",
          "red",
          "",
          "",
          true
        );
        console.error("Error updating invoice:", error);
      } finally {
        setReloadInvoiceData(true);
      }
    },
    [products, tableId, dispatch, setReloadInvoiceData]
  );

  const handleDecrement = useCallback(
    (productId) => {
      const myCartProducts = getCartProducts();

      const updatedProducts = myCartProducts
        .map((item) => {
          if (item.product_id === productId) {
            const newQuantity = Math.max(0, item.quantity - 1);
            return {
              ...item,
              quantity: newQuantity,
              sub_total: newQuantity * item.sales_price,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      updateTableStatusIfNeeded(updatedProducts.length);
      localStorage.setItem(getStorageKey(), JSON.stringify(updatedProducts));
      setLoadCartProducts(true);
    },
    [
      getStorageKey,
      getCartProducts,
      updateTableStatusIfNeeded,
      setLoadCartProducts,
    ]
  );

  const handleDelete = useCallback(
    (productId) => {
      const myCartProducts = getCartProducts();

      const updatedProducts = myCartProducts.filter(
        (item) => item.product_id !== productId
      );

      // Show notification for successful deletion
      notifications.show({
        title: t("Success"),
        message: t("Item removed from cart"),
        color: "green",
        position: "bottom-right",
        autoClose: 2000,
      });

      updateTableStatusIfNeeded(updatedProducts.length);
      localStorage.setItem(getStorageKey(), JSON.stringify(updatedProducts));
      setLoadCartProducts(true);
    },
    [
      getCartProducts,
      getStorageKey,
      updateTableStatusIfNeeded,
      setLoadCartProducts,
    ]
  );

  const handleClearCart = useCallback(() => {
    localStorage.removeItem(getStorageKey());
    if (enableTable && tableId) {
      updateTableStatus("Free");
      if (tables && setTables) {
        setTables(
          tables.map((table) =>
            table.id === tableId ? { ...table, status: "Free" } : table
          )
        );
      }
    }
    setLoadCartProducts(true);
  }, [
    getStorageKey,
    enableTable,
    tableId,
    updateTableStatus,
    tables,
    setTables,
    setLoadCartProducts,
  ]);

  return {
    handleIncrement,
    handleDecrement,
    handleDelete,
    handleClearCart,
    getCartProducts,
  };
};
