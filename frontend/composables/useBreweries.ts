/**
 * @file Service class for managing breweries data.
 * Provides methods to fetch, filter, and group brewery data from an API.
 */

import { AxiosService } from './useAxios'
import type { AxiosResponse } from 'axios'

import type { Brewery } from '@/types/index'

export class BreweryService {
    public data
    public error
    public loading
    public filteredData
    private axiosService = new AxiosService<Brewery[]>()
    constructor() {
      this.data = this.axiosService.data
      this.error = this.axiosService.error
      this.loading = this.axiosService.loading
      this.filteredData = ref<Brewery[] | null>(null)
    }
  
    async fetchBreweries(): Promise<AxiosResponse<Brewery[]> | undefined> {
      this.loading.value = true
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await this.axiosService.fetch('/api/breweries/list/', 'GET', {
        axiosConfig: {
          headers: {
            Authorization: token
          }
        }
      })
      const list= response?.data || []
      this.data.value = list
      this.filteredData.value = [...list]
      this.loading.value = false  
      return response
    }
  
    filterDataByField(field: keyof Brewery ,value: string) {
      if (!this.data.value) return
      this.filteredData.value = this.data.value.filter((brewery) => {
          const fieldValue = brewery[field]
          if (typeof fieldValue === 'string') {
              return fieldValue.toLowerCase().includes(value.toLowerCase())
          } else if (typeof fieldValue === 'number') {
              return fieldValue.toString().includes(value)
          }
          return false
      })
  }

    async fetchGroupedBreweries(groupByField: keyof Brewery): Promise<Record<string, number> | undefined> {
      this.loading.value = true;
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Authentication token not found.');
    
        const response = await this.axiosService.fetch(
          `/api/breweries/grouped/?group_by=${encodeURIComponent(groupByField)}`,
          'GET',
          { axiosConfig: { headers: { Authorization: token } } }
        );
        if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            return response.data as Record<string, number>;
        } else {
            throw new Error('Unexpected response format');
        }
      } catch (error) {
        this.error.value = error instanceof Error ? error.message : String(error);
        return undefined;
      } finally {
        this.loading.value = false;
      }
    }
    
    resetFilter() {
      this.filteredData.value = this.data.value
    }
  }