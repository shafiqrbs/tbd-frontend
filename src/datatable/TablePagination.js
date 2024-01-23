import {ActionIcon, Text, Anchor, Edit, Trash, Group} from '@mantine/core';
import {data} from 'autoprefixer';
import {DataTable} from 'mantine-datatable';
import {useEffect, useState} from 'react';
import {HiEye, HiPencil, HiTrash} from 'react-icons/hi';
import employees from '../data/employee.json';
import axios from "axios";


const PAGE_SIZE = 20;

export default function TablePagination() {

    const [page, setPage] = useState(100);
    const [records, setRecords] = useState(employees.slice(0, PAGE_SIZE));
    const [items, setItems] = useState(employees.slice(0, PAGE_SIZE));
    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(employees.slice(from, to));
    }, [page]);


    /*const [item,setItem] = useState([]);

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api/master-data/items/list`).then(res =>{
            setItem(res.data.results)
        });
    },[]);*/


    const actionInfo = (items) => {
        setShow(true);
        setData(items)
    }

    return (
        <>

            <DataTable
                withBorder
                paginationSize="md"
                records={items}
                sx={{
                    '.mantine-p90qec': {
                        backgroundColor: '#fffefe',
                        'padding-top': '5px',
                        'padding-bottom': '5px'
                    },
                    '.mantine-cxvbgt[data-active]': {
                        backgroundColor: '#c7d2fe',
                        color: 'rgb(41, 39, 39)',
                    },
                    '.MuiBox-root': {
                        backgroundColor: 'yellow',
                        color: 'black',
                        '& .MuiSvgIcon-root': {
                            backgroundColor: 'purple',
                            color: 'black',
                        },
                    },
                }}
                columns={[
                    {accessor: 'id', width: 100},
                    {accessor: 'userId', width: 100},
                    {accessor: 'title', width: '100%'},
                    {accessor: 'completed', width: '100%'},
                    // { accessor: 'prices', width: '100%' },
                    {
                        accessor: 'actions',
                        title: <Text mr="xs">Action</Text>,
                        textAlignment: 'right',
                        render: (data) => (
                            <Group spacing={4} position="right" noWrap>
                                <ActionIcon color="green" onClick={() => actionInfo(data)}>
                                    <HiPencil size={16}/>
                                </ActionIcon>
                                <ActionIcon color="blue">
                                    <HiEye size={16}/>
                                </ActionIcon>
                                <ActionIcon color="red">
                                    <HiTrash size={16}/>
                                </ActionIcon>
                            </Group>
                        ),
                    },

                ]}
                totalRecords={items.length}
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
            />
        </>

    );
}
