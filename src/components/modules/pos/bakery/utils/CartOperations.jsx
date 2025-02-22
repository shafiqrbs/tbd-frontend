import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

export const useCartOperations = ({
  enableTable,
  tableId,
  products,
  currentStatus,
  updateTableStatus,
  setLoadCartProducts,
  tables,
  setTables
}) => {
  const { t } = useTranslation();

  const getStorageKey = useCallback(() => {
    return enableTable && tableId ? `table-${tableId}-pos-products` : "temp-pos-products";
  }, [enableTable, tableId]);

  const getCartProducts = useCallback(() => {
    const cartProducts = localStorage.getItem(getStorageKey());
    return cartProducts ? JSON.parse(cartProducts) : [];
  }, [getStorageKey]);

  const validateProductPrice = useCallback((product) => {
    if (product.sales_price === 0 || product.sales_price === null) {
      notifications.show({
        title: t("Error"),
        position: "bottom-right",
        autoClose: 2000,
        withCloseButton: true,
        message: t("Sales price cant be zero"),
        color: "red",
      });
      return false;
    }
    return true;
  }, [t]);

  const updateTableStatusIfNeeded = useCallback((cartLength) => {
    if (!enableTable || !tableId) return;

    if (cartLength === 1 && currentStatus === "Free") {
      updateTableStatus("Occupied");
    } else if (cartLength === 0 && currentStatus === "Occupied") {
      // Update both table status and tables state
      updateTableStatus("Free");
      if (tables && setTables) {
        setTables(tables.map((table) =>
          table.id === tableId ? { ...table, status: "Free" } : table
        ));
      }
    }
  }, [enableTable, tableId, currentStatus, updateTableStatus, tables, setTables]);

  const handleIncrement = useCallback((productId) => {
    const product = products.find((p) => p.id === productId);
    if (!validateProductPrice(product)) return;

    const myCartProducts = getCartProducts();
    let found = false;

    const updatedProducts = myCartProducts.map((item) => {
      if (item.product_id === productId) {
        found = true;
        const newQuantity = item.quantity + 1;
        return {
          ...item,
          quantity: newQuantity,
          sub_total: newQuantity * item.sales_price,
        };
      }
      return item;
    });

    if (!found) {
      updatedProducts.push({
        product_id: product.id,
        display_name: product.display_name,
        quantity: 1,
        unit_name: product.unit_name,
        purchase_price: Number(product.purchase_price),
        sub_total: Number(product.sales_price),
        sales_price: Number(product.sales_price),
      });
    }

    updateTableStatusIfNeeded(updatedProducts.length);
    localStorage.setItem(getStorageKey(), JSON.stringify(updatedProducts));
    setLoadCartProducts(true);
  }, [products, getStorageKey, validateProductPrice, updateTableStatusIfNeeded, setLoadCartProducts]);

  const handleDecrement = useCallback((productId) => {
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
  }, [getStorageKey, getCartProducts, updateTableStatusIfNeeded, setLoadCartProducts]);

  const handleDelete = useCallback((productId) => {
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
  }, [getCartProducts, getStorageKey, updateTableStatusIfNeeded, setLoadCartProducts]);

  const handleClearCart = useCallback(() => {
    localStorage.removeItem(getStorageKey());
    if (enableTable && tableId) {
      updateTableStatus("Free");
      if (tables && setTables) {
        setTables(tables.map((table) =>
          table.id === tableId ? { ...table, status: "Free" } : table
        ));
      }
    }
    setLoadCartProducts(true);
  }, [getStorageKey, enableTable, tableId, updateTableStatus, tables, setTables, setLoadCartProducts]);

  return {
    handleIncrement,
    handleDecrement,
    handleDelete,
    handleClearCart,
    getCartProducts
  };
};