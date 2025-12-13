import { api } from '@/src/shared/services/api';
import { Journey } from '../types';

export const journeyService = {
  async getJourneys(): Promise<Journey[]> {
    return api.get<Journey[]>('/api/journey');
  },

  async getJourney(id: string): Promise<Journey> {
    const journeys = await this.getJourneys();
    const journey = journeys.find(j => j.id === id);
    if (!journey) {
      throw new Error('Journey not found');
    }
    return journey;
  },
};

