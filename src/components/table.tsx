import * as React from "react";
import { useState, useMemo } from "react";
import usePagination from "../hooks/usePagination";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export interface Column {
  id: string;
  label: string;
}

export interface GenericTableProps<T> {
  columns: Column[];
  data: T[];
  renderCell: (row: T) => React.ReactElement[];
  itemsPerPage: number;
}

const GenericTable = <T extends Record<string, any>>({
  columns,
  data,
  renderCell,
  itemsPerPage,
}: GenericTableProps<T>) => {
  const [search, setSearch] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Global Search + Sorting
  const filteredAndSortedData = useMemo(() => {
    const searched = data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortColumn) {
      searched.sort((a, b) => {
        const valA = a[sortColumn];
        const valB = b[sortColumn];

        if (valA == null) return sortAsc ? -1 : 1;
        if (valB == null) return sortAsc ? 1 : -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }

        return sortAsc
          ? valA.toString().localeCompare(valB.toString())
          : valB.toString().localeCompare(valA.toString());
      });
    }

    return searched;
  }, [data, search, sortColumn, sortAsc]);

  const { currentData, totalPages, currentPage, handlePageChange } =
    usePagination<T>(filteredAndSortedData, itemsPerPage);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(columnId);
      setSortAsc(true);
    }
  };

  return (
    <div className="m-table" style={{ display: "flex", flexDirection: "column" }}>
     
    {/* 🔍 Unified Search UI */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        padding: "0.5rem 0",
        // marginBottom: "1.5rem",
        // backgroundColor: "#ffffff",
        borderRadius: "8px",
        // border: "1px solid #ddd", // Matches table lines
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          // flex: 1,
          maxWidth: "250px",
          backgroundColor: "#f9f9f9", // Match table background
          borderRadius: "6px",
          padding: "0.5rem 0.8rem",
          border: "1px solid #ccc",
        }}
      >
        <svg
          style={{ width: "18px", height: "18px",  fill: "#666" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M21.71 20.29l-3.388-3.388A8.935 8.935 0 0019 11a9 9 0 10-9 9 8.935 8.935 0 005.902-1.678l3.388 3.388a1 1 0 001.42-1.42zM4 11a7 7 0 1114 0 7 7 0 01-14 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search table..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            flex: 1,
            fontSize: "15px",
            color: "#333", // Match table font
            paddingLeft:"0.1rem"
          }}
        />
      </div>

    </div>
      {/* 🧾 Table */}
      <div
        className="table-wrapper"
        style={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "400px",
        }}
      >
        <table className="styled-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  {column.label}{" "}
                  {sortColumn === column.id ? (sortAsc ? "▲" : "▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index}>{renderCell(row)}</tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div
        className="pagination"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          paddingTop: "1rem",
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <IoIosArrowBack style={{ fontSize: "15px", marginTop: "7px" }} />
        </button>
        <span style={{ fontSize: "14px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <IoIosArrowForward style={{ fontSize: "15px", marginTop: "7px" }} />
        </button>
      </div>
    </div>
  );
};

export default GenericTable;