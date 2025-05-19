import { Box } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import React from 'react'

export default function WarehouseListTable() {
    const data = [
        {
            id: 1,
            user_id: 1,
            user_name: "John Doe",
            user_email: "john.doe@example.com",
            user_phone: "1234567890",
            warehouses: [
                {   
                    id: 1,
                    name: "Warehouse 1",
                    address: "123 Main St",
                },
                {
                    id: 2,
                    name: "Warehouse 2",
                    address: "123 Main St",
                },
                {
                    id: 3,
                    name: "Warehouse 3",
                    address: "123 Main St",
                }
            ]
        },
        {
            id: 2,
            user_id: 2,
            user_name: "Jane Doe",
            user_email: "jane.doe@example.com",
            user_phone: "1234567890",
            warehouses: [
                {
                    id: 1,
                    name: "Warehouse 1",
                    address: "123 Main St",
                },
                {
                    id: 2,
                    name: "Warehouse 2",
                    address: "123 Main St",
                }
                    
            ]
        }
    ]

    // <SwitchForm
    //     tooltip={t('Status')}
    //     label=''
    //     nextField={saveId}
    //     name={'status'}
    //     form={settingsForm}
    //     color="red"
    //     id={'status'}
    //     position={'left'}
    //     defaultChecked={1}
    // />
  return (
    <Box>
        {/* <DataTable /> */}
    </Box>
  )
}
