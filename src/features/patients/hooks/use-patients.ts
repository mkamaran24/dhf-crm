import { useState, useEffect, useCallback } from 'react';
import { Patient, PatientFilters } from '../types';
import { patientsService } from '../services/patients-service';
import { useDebounce, usePagination } from '@/src/shared/hooks';
import { PatientStatus } from '@/src/shared/types';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PatientFilters>({});
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { pagination, updatePagination, resetPagination, setPage } = usePagination(20);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const data = await patientsService.getPatients({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        status: filters.status,
      });
      
      setPatients(data.patients);
      updatePagination(data.pagination);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
      updatePagination({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, debouncedSearch, filters, updatePagination, pagination.limit]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    resetPagination();
  }, [debouncedSearch, filters.status, resetPagination]);

  const deletePatient = async (patientId: string) => {
    setPatients(patients.filter(p => p.id !== patientId));
    
    try {
      await patientsService.deletePatient(patientId);
      
      if (patients.length === 1 && pagination.page > 1) {
        setPage(pagination.page - 1);
      } else {
        fetchPatients();
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      fetchPatients();
    }
  };

  const setStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status: status as PatientStatus || undefined }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({});
  };

  return {
    patients,
    isLoading,
    searchQuery,
    filters,
    pagination,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
    deletePatient,
    setPage,
    refetch: fetchPatients,
  };
}

