import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters } from '../types';
import { leadsService } from '../services/leads-service';
import { useDebounce, usePagination } from '@/src/shared/hooks';
import { LeadStatus } from '@/src/shared/types';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<LeadFilters>({});
  
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { pagination, updatePagination, resetPagination, setPage } = usePagination(20);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const data = await leadsService.getLeads({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        status: filters.status,
        source: filters.source,
      });
      
      setLeads(data.leads);
      updatePagination(data.pagination);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, debouncedSearch, filters, updatePagination, pagination.limit]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    resetPagination();
  }, [debouncedSearch, filters.status, filters.source, resetPagination]);

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status } : l));
    
    try {
      await leadsService.updateLeadStatus(leadId, status);
    } catch (error) {
      console.error("Error updating lead status:", error);
      fetchLeads();
    }
  };

  const deleteLead = async (leadId: string) => {
    setLeads(leads.filter(l => l.id !== leadId));
    
    try {
      await leadsService.deleteLead(leadId);
      
      if (leads.length === 1 && pagination.page > 1) {
        setPage(pagination.page - 1);
      } else {
        fetchLeads();
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      fetchLeads();
    }
  };

  const setStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status: status as LeadStatus || undefined }));
  };

  const setSourceFilter = (source: string) => {
    setFilters(prev => ({ ...prev, source: source || undefined }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({});
  };

  return {
    leads,
    isLoading,
    searchQuery,
    filters,
    pagination,
    setSearchQuery,
    setStatusFilter,
    setSourceFilter,
    clearFilters,
    updateLeadStatus,
    deleteLead,
    setPage,
  };
}

