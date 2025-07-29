// components/Pagination.tsx
import { useState, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input'; // Assuming you use shadcn/ui
import { Button } from '@/components/ui/button'; // Assuming you use shadcn/ui

// 1. Define the props the component needs
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // 2. Manage the input field's state locally within this component
  const [pageInput, setPageInput] = useState(currentPage.toString());

  // 3. Sync the input value if the currentPage prop changes from the parent
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // 4. Handle form submission to go to a specific page
  const handleGoToPage = (e: FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
      onPageChange(pageNum); // Call the function passed from the parent
    }
  };

  return (
    <div className="flex items-center justify-center flex-wrap gap-4 mt-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <form onSubmit={handleGoToPage} className="flex items-center gap-2">
        <Input
          type="number"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          min="1"
          max={totalPages}
          className="w-20 text-center"
        />
        <Button type="submit">Go</Button>
      </form>

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>

      <span className="text-sm text-muted-foreground w-full text-center mt-2 sm:w-auto sm:mt-0">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}