import { Table } from "@mantine/core";
import batchTableCss from "../../../../../assets/css/ProductBatchTable.module.css";

export default function ProductBatchTable() {
	return (
		<Table.ScrollContainer minWidth={500}>
			<Table withTableBorder withColumnBorders striped highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th rowSpan={3} colSpan={5}></Table.Th>
						<Table.Th ta="center" colSpan={4}>
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
						<Table.Th>Issue Quantity</Table.Th>
						<Table.Th>Receive Quantity</Table.Th>
						<Table.Th>Issue Quantity</Table.Th>
						<Table.Th>Receive Quantity</Table.Th>
						<Table.Th>Issue Quantity</Table.Th>
						<Table.Th>Expense Quantity</Table.Th>
						<Table.Th>Less</Table.Th>
						<Table.Th>More</Table.Th>
						<Table.Th>Stock In</Table.Th>
						<Table.Th>Remaining Stock</Table.Th>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>5</Table.Td>
						<Table.Td>4</Table.Td>
						<Table.Td>1000</Table.Td>
						<Table.Td>800</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
					</Table.Tr>
					<Table.Tr className={batchTableCss.highlightedRow}>
						<Table.Th>Material Element Item</Table.Th>
						<Table.Th>Unit</Table.Th>
						<Table.Th>Opening</Table.Th>
						<Table.Th>Narayangonj</Table.Th>
						<Table.Th>Total Stock</Table.Th>
						<Table.Th ta="center" colSpan={2}>
							Mecaroon Cookies
						</Table.Th>
						<Table.Th ta="center" colSpan={2}>
							Heart Sheep Pastry
						</Table.Th>
						<Table.Th></Table.Th>
						<Table.Th></Table.Th>
						<Table.Th></Table.Th>
						<Table.Th></Table.Th>
						<Table.Th></Table.Th>
						<Table.Th></Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					<Table.Tr>
						<Table.Td>Malabar Spinach</Table.Td>
						<Table.Td>KG</Table.Td>
						<Table.Td>100</Table.Td>
						<Table.Td>60</Table.Td>
						<Table.Td>160</Table.Td>
						<Table.Td>20</Table.Td>
						<Table.Td>18</Table.Td>
						<Table.Td>4000</Table.Td>
						<Table.Td>3500</Table.Td>
						<Table.Td>4020</Table.Td>
						<Table.Td>3518</Table.Td>
						<Table.Td>502</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td>160</Table.Td>
						<Table.Td>-3358</Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>Mota লবণ</Table.Td>
						<Table.Td>KG</Table.Td>
						<Table.Td>100</Table.Td>
						<Table.Td>60</Table.Td>
						<Table.Td>160</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>Liquid Milk</Table.Td>
						<Table.Td>KG</Table.Td>
						<Table.Td>100</Table.Td>
						<Table.Td>60</Table.Td>
						<Table.Td>160</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>5</Table.Td>
						<Table.Td>6</Table.Td>
						<Table.Td>5</Table.Td>
						<Table.Td>6</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td>1</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>Gourd</Table.Td>
						<Table.Td>KG</Table.Td>
						<Table.Td>100</Table.Td>
						<Table.Td>60</Table.Td>
						<Table.Td>160</Table.Td>
						<Table.Td>20</Table.Td>
						<Table.Td>25</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>20</Table.Td>
						<Table.Td>25</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td>5</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
					</Table.Tr>
					<Table.Tr>
						<Table.Td>Sugar Open</Table.Td>
						<Table.Td>KG</Table.Td>
						<Table.Td>100</Table.Td>
						<Table.Td>60</Table.Td>
						<Table.Td>160</Table.Td>
						<Table.Td>50</Table.Td>
						<Table.Td>40</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>0</Table.Td>
						<Table.Td>50</Table.Td>
						<Table.Td>40</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td>10</Table.Td>
						<Table.Td></Table.Td>
						<Table.Td></Table.Td>
					</Table.Tr>
				</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	);
}
