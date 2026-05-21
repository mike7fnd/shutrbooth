'use client';

import { useState, useCallback } from 'react';
import { FilterName, getFilterCSS } from '@/lib/filters';

interface UseFilterReturn {
  selectedFilter: FilterName;
  setSelectedFilter: (filter: FilterName) => void;
  getCSSFilter: () => string;
  filterCSS: string;
}

export function useFilter(initialFilter: FilterName = 'none'): UseFilterReturn {
  const [selectedFilter, setSelectedFilterState] = useState<FilterName>(initialFilter);
  const [filterCSS, setFilterCSS] = useState<string>(getFilterCSS(initialFilter));

  const setSelectedFilter = useCallback((filter: FilterName) => {
    setSelectedFilterState(filter);
    setFilterCSS(getFilterCSS(filter));
  }, []);

  const getCSSFilter = useCallback((): string => {
    return getFilterCSS(selectedFilter);
  }, [selectedFilter]);

  return {
    selectedFilter,
    setSelectedFilter,
    getCSSFilter,
    filterCSS,
  };
}
