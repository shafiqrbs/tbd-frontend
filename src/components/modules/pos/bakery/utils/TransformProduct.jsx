export const TransformProduct = (products) => {
  return products.map((product) => ({
    display_name: product.display_name,
    product_id: product.id || product.product_id,
    quantity: product.quantity,
    purchase_price: product.purchase_price,
    sales_price: product.sales_price,
    sub_total: product.sub_total,
  }));
};
