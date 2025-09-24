const API_URL = 'https://ensalud.info/generator/api-actriz.php';

interface Actriz {
  id: string;
  name: string;
  slug: string;
  image: string;
  bio: string;
  birthDate: string;
  birthPlace: string;
  height: string;
  featured: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

/** Obtener todas las actrices */
export const getActrices = async (): Promise<Actriz[]> => {
  const endpoint = `${API_URL}?action=all`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Error ${response.status} al obtener actrices.`);
  const data: ApiResponse<Actriz[]> = await response.json();
  if (!data.success) throw new Error(data.error || 'Error desconocido al obtener actrices');
  return data.data;
};

/** Obtener actrices destacadas */
export const getActricesDestacadas = async (): Promise<Actriz[]> => {
  const endpoint = `${API_URL}?action=featured`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Error ${response.status} al obtener actrices destacadas.`);
  const data: ApiResponse<Actriz[]> = await response.json();
  if (!data.success) throw new Error(data.error || 'Error desconocido al obtener actrices destacadas');
  return data.data;
};

/** Obtener una actriz por ID */
export const getActrizById = async (id: string): Promise<Actriz> => {
  const endpoint = `${API_URL}?action=by-id&id=${id}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Error ${response.status} al obtener actriz.`);
  const data: ApiResponse<Actriz> = await response.json();
  if (!data.success) throw new Error(data.error || `No se encontró la actriz con ID: ${id}`);
  return data.data;
};

/** Obtener una actriz por slug */
export const getActrizBySlug = async (slug: string): Promise<Actriz> => {
  const endpoint = `${API_URL}?action=by-slug&slug=${slug}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Error ${response.status} al obtener actriz.`);
  const data: ApiResponse<Actriz> = await response.json();
  if (!data.success) throw new Error(data.error || `No se encontró la actriz con slug: ${slug}`);
  return data.data;
};

/** Buscar actrices */
export const searchActrices = async (query: string): Promise<Actriz[]> => {
  const endpoint = `${API_URL}?action=search&q=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Error ${response.status} al buscar actrices.`);
  const data: ApiResponse<Actriz[]> = await response.json();
  if (!data.success) throw new Error(data.error || 'Error desconocido al buscar actrices');
  return data.data;
};

/** Obtener actrices con filtros */
export interface FilterOptions {
  sortBy?: 'name' | 'birthDate';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
}

export const getActricesFiltered = async (filters: FilterOptions): Promise<Actriz[]> => {
  // Get all actresses first
  let actrices = await getActrices();
  
  // Apply featured filter
  if (filters.featured) {
    actrices = actrices.filter(actriz => actriz.featured);
  }

  // Apply sorting
  if (filters.sortBy) {
    actrices.sort((a, b) => {
      const aValue = filters.sortBy === 'name' ? a.name : a.birthDate;
      const bValue = filters.sortBy === 'name' ? b.name : b.birthDate;
      
      if (filters.sortBy === 'birthDate') {
        const dateA = new Date(aValue).getTime();
        const dateB = new Date(bValue).getTime();
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const compareResult = aValue.localeCompare(bValue);
        return filters.sortOrder === 'asc' ? compareResult : -compareResult;
      }
    });
  }

  return actrices;
};
