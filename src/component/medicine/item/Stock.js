import React, {useEffect, useRef} from 'react';
import {ActionIcon, Group, Text, Box, ScrollArea} from "@mantine/core";
import TablePagination from "../../../datatable/Datatable";
const PAGE_SIZE = 1;

function Pagination() {
    return (
        <>
            <main className="flex flex-1">
                <div className="min-h-full w-full">
                    <div className="flex w-full md:w-auto">
                        <div className="flex min-w-0 flex-1 bg-white xl:flex">
                            <div className="w-full">
                                <Box>
                                    <TablePagination></TablePagination>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
export default Pagination