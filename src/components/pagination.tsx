// components/Pagination.tsx
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
}: PaginationProps) => {
  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <IoIosArrowBack />
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;