import { Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

export default function Datatable() {
  return (
    <DataTable
      withBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      // provide data
      records={[
        { id: 1, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 2, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 3, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 4, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 5, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 6, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 7, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 8, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 9, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        { id: 10, name: 'Joe Biden', bornIn: 1942, party: 'Democratic' },
        // more records...
      ]}
      // define columns
      columns={[
        {
          accessor: 'id',
          // this column has a custom title
          title: '#',
          // right-align column
          textAlignment: 'right',
        },
        { accessor: 'name' ,title: 'Full Name', },
        {
          accessor: 'party',
          // this column has custom cell data rendering
          render: ({ party }) => (
            <Text weight={700} color={party === 'Democratic' ? 'blue' : 'red'}>
              {party.slice(0, 3).toUpperCase()}
            </Text>
          ),
        },
        { accessor: 'bornIn' },
      ]}
      // execute this callback when a row is clicked
      onRowClick={({ name, party, bornIn }) =>
        alert(`You clicked on ${name}, a ${party.toLowerCase()} president born in ${bornIn}.`)
      }
    />
  );
}