import { Table } from "@mantine/core";

const TABLE_ROW_OBJECT_DATA = [
  {
    item: "Malabar Spinach",
    unit: "KG",
    opening: 100,
    narayangonj: 60,
    totalStock: 160,
    macaron: { issue: 20, receive: 18 },
    heartSheep: { issue: 4000, receive: 3500 },
    total: { issue: 4020, expense: 3518, less: 502, more: "" },
    stock: { in: 160, remaining: -3358 }
  },
  {
    item: "Mota লবণ",
    unit: "KG",
    opening: 100,
    narayangonj: 60,
    totalStock: 160,
    macaron: { issue: 0, receive: 0 },
    heartSheep: { issue: 0, receive: 0 },
    total: { issue: 0, expense: 0, less: 0, more: "" },
    stock: { in: "", remaining: "" }
  },
  {
    item: "Liquid Milk",
    unit: "KG",
    opening: 100,
    narayangonj: 60,
    totalStock: 160,
    macaron: { issue: 0, receive: 0 },
    heartSheep: { issue: 5, receive: 6 },
    total: { issue: 5, expense: 6, less: "", more: 1 },
    stock: { in: "", remaining: "" }
  },
  {
    item: "Gourd",
    unit: "KG",
    opening: 100,
    narayangonj: 60,
    totalStock: 160,
    macaron: { issue: 20, receive: 25 },
    heartSheep: { issue: 0, receive: 0 },
    total: { issue: 20, expense: 25, less: "", more: 5 },
    stock: { in: "", remaining: "" }
  },
  {
    item: "Sugar Open",
    unit: "KG",
    opening: 100,
    narayangonj: 60,
    totalStock: 160,
    macaron: { issue: 50, receive: 40 },
    heartSheep: { issue: 0, receive: 0 },
    total: { issue: 50, expense: 40, less: "", more: 10 },
    stock: { in: "", remaining: "" }
  }
];

const TABLE_HEADER_DATA = [
  [
    { label: '', colSpan: 5, rowSpan: 3 },
    { label: 'Issue Production Quantity', colSpan: 4, ta: 'center' },
    { label: 'Total Expense Material', colSpan: 4, ta: 'center' },
    { label: 'Current Stock Status', colSpan: 2, ta: 'center' },
  ],
  [
    { label: 'Issue Quantity' },
    { label: 'Receive Quantity' },
    { label: 'Issue Quantity' },
    { label: 'Receive Quantity' },
    { label: 'Issue Quantity' },
    { label: 'Expense Quantity' },
    { label: 'Less' },
    { label: 'More' },
    { label: 'Stock In' },
    { label: 'Remaining Stock' },
  ],
  [
    { label: '5', ta: 'center' },
    { label: '4', ta: 'center' },
    { label: '1000', ta: 'center' },
    { label: '800', ta: 'center' },
    { label: '' },
    { label: '' },
    { label: '' },
    { label: '' },
    { label: '' },
    { label: '' },
  ],
  [
    { label: 'Material Element Item' },
    { label: 'Unit' },
    { label: 'Opening' },
    { label: 'Narayangonj' },
    { label: 'Total Stock' },
    { label: 'Mecaroon Cookies', colSpan: 2, ta: 'center' },
    { label: 'Heart Sheep Pastry', colSpan: 2, ta: 'center' },
    { label: '' },
    { label: '' },
    { label: '' },
    { label: '' },
    { label: '' },
    { label: '' },
  ],
];

function flattenRow(row) {
  return [
    row.item,
    row.unit,
    row.opening,
    row.narayangonj,
    row.totalStock,
    row.macaron.issue,
    row.macaron.receive,
    row.heartSheep.issue,
    row.heartSheep.receive,
    row.total.issue,
    row.total.expense,
    row.total.less,
    row.total.more,
    row.stock.in,
    row.stock.remaining
  ];
}

export default function ProductBatchTable() {
  return (
    <Table withTableBorder withColumnBorders striped highlightOnHover>
      <Table.Thead>
        {TABLE_HEADER_DATA.map((row, rowIdx) => (
          <Table.Tr key={rowIdx}>
            {row.map((cell, colIdx) => (
              <Table.Th
                key={colIdx}
                colSpan={cell.colSpan}
                rowSpan={cell.rowSpan}
                style={cell.ta ? { textAlign: cell.ta } : {}}
              >
                {cell.label}
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {TABLE_ROW_OBJECT_DATA.map((row, rowIdx) => {
          const flatRow = flattenRow(row);
          return (
            <Table.Tr key={rowIdx}>
              {flatRow.map((cell, colIdx) => (
                <Table.Td key={colIdx}>{cell}</Table.Td>
              ))}
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}
