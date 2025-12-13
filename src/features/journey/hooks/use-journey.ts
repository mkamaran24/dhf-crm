import { useState, useEffect, useCallback, useMemo } from 'react';
import { Journey } from '../types';
import { journeyService } from '../services/journey-service';
import { JourneyStage } from '@/src/shared/types';
import { useDebounce } from '@/src/shared/hooks';

export function useJourneys() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<JourneyStage | "all">("all");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchJourneys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await journeyService.getJourneys();
      setJourneys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch journeys');
      console.error("Error fetching journeys:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  const filteredJourneys = useMemo(() => {
    let filtered = [...journeys];

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        journey =>
          journey.name.toLowerCase().includes(query) ||
          journey.email.toLowerCase().includes(query)
      );
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter(journey => journey.currentStage === stageFilter);
    }

    return filtered;
  }, [journeys, debouncedSearch, stageFilter]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStageFilter("all");
  }, []);

  return {
    journeys: filteredJourneys,
    allJourneys: journeys,
    isLoading,
    error,
    searchQuery,
    stageFilter,
    setSearchQuery,
    setStageFilter,
    clearFilters,
    refetch: fetchJourneys,
  };
}

export function useJourney(id: string) {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJourney() {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await journeyService.getJourney(id);
        setJourney(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch journey');
        console.error("Error fetching journey:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchJourney();
    }
  }, [id]);

  return {
    journey,
    isLoading,
    error,
  };
}
