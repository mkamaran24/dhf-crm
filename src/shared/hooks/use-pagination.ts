import { useState, useCallback } from 'react';
import { PaginationInfo } from '@/src/shared/types';

export function usePagination(initialLimit: number = 20) {
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination(prev => 
      prev.page < prev.totalPages ? { ...prev, page: prev.page + 1 } : prev
    );
  }, []);

  const previousPage = useCallback(() => {
    setPagination(prev => 
      prev.page > 1 ? { ...prev, page: prev.page - 1 } : prev
    );
  }, []);

  const updatePagination = useCallback((newPagination: Partial<PaginationInfo>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return {
    pagination,
    setPage,
    nextPage,
    previousPage,
    updatePagination,
    resetPagination,
  };
}

