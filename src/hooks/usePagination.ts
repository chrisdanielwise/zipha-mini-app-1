import { useState } from 'react';

// Define the generic usePagination hook
const usePagination = <T>(data: T[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState<number>(1); // Specify the type for currentPage

    // Calculate total pages based on the length of the data and items per page
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Function to handle page changes
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return; // Prevent invalid page numbers
        setCurrentPage(page);
    };

    // Get the current data for the current page
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Return the current data, total pages, current page, and page change handler
    return { currentData, totalPages, currentPage, handlePageChange };
};

export default usePagination;