import { Box } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import React from 'react';
import { useTranslation } from 'react-i18next';
import tableCss from '../../../../assets/css/Table.module.css';

export default function LedgerItemsTable() {
  const { t } = useTranslation();

  const data = [
		{
			sn: 1,
			date: "2024-03-20",
			dr: 123333,
			cr: 0,
			balance: 123333,
		},
		{
			sn: 2,
			date: "2024-03-21",
			dr: 0,
			cr: 124332,
			balance: -999,
		},
		{
			sn: 3,
			date: "2024-03-22",
			dr: 0,
			cr: 124332,
			balance: -999,
		},
		{
			sn: 4,
			date: "2024-03-23",
			dr: 123333,
			cr: 2990,
			balance: 123333,
		},
		{
			sn: 5,
			date: "2024-03-24",
			dr: 43333,
			cr: 2990,
			balance: 43333,
		},
  ];

  const columns = [
    {
      accessor: 'sn',
      title: t('S/N'),
      textAlign: 'left',
      width: 70
    },
    {
      accessor: 'date',
      title: t('Date'),
      width: 100
    },
    {
      accessor: 'dr',
      title: t('Dr'),
      textAlign: 'right',
      width: 120,
      render: (record) => record.dr.toLocaleString()
    },
    {
      accessor: 'cr',
      title: t('Cr'),
      textAlign: 'right',
      width: 120,
      render: (record) => record.cr.toLocaleString()
    },
    {
      accessor: 'balance',
      title: t('Balance'),
      textAlign: 'right',
      width: 120,
      render: (record) => record.balance.toLocaleString()
    }
  ];

  return (
    <Box className={'borderRadiusAll'}>
      <DataTable
        classNames={{
          root: tableCss.root,
          table: tableCss.table,
          header: tableCss.header,
          footer: tableCss.footer,
          pagination: tableCss.pagination,
        }}
        columns={columns}
        records={data}
        minHeight={300}
        verticalSpacing="sm"
        horizontalSpacing="sm"
        striped
        highlightOnHover
      />
    </Box>
  );
}
