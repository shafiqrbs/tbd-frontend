export const TransformProduct = (products) => {
  return products.map((product) => ({
    product_id: product.id || product.product_id,
    item_name: product.display_name,
    sales_price: product.sales_price,
    price: product.sales_price,
    percent: "",
    quantity: product.quantity,
    uom: "",
    unit_id: "",
    purchase_price: product.purchase_price,
    sub_total: product.sub_total,
  }));
};
