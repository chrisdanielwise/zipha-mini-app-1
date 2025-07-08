"use client";

import React, { useState } from "react";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import TablePagination from '@mui/material/TablePagination';
import  Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow'

import  TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer'
interface Column {
  id: string;
  label: string;
}

interface Row {
  id: number;
  name: string;
  category: string;
  orders: number;
  revenue: string;
  sales: string;
  status: string;
  action: string;
}

interface TableProps {
  columns: Column[];
  data: Row[];
  rowsPerPageOptions: number[];
}

export const Tables: React.FC<TableProps> = ({ columns, data, rowsPerPageOptions }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <div>
      <TableContainer component={Paper} style={{ width: '95%', margin: '20px auto' }}>
        <Table>
          <TableHead>
            <TableRow className="bg-[#13173c]">
              {columns.map((column) => (
                <TableCell key={column.id} className="text-white font-semibold text-lg">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} className="bg-[#13173c]">
                  {columns.map((column) => (
                    <TableCell key={column.id} className="text-white">
                      {row[column.id as keyof Row]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page"
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
        />
      </TableContainer>
    </div>
  );
}