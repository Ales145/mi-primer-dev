const API_URL = 'https://ensalud.info/generator/api-actriz.php';

export interface Actriz {
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
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Error desconocido');
    return data.data;
  } catch (error) {
    console.error('Error en búsqueda:', error);
    return [];
  }
};

/** Obtener actrices con filtros */
export interface FilterOptions {
  orderBy?: string;
  featured?: boolean;
  page?: number;
  perPage?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export const getActricesFiltered = async (filters: FilterOptions = {}): Promise<PaginatedResponse<Actriz>> => {
  const params = new URLSearchParams();
  
  // Si hay búsqueda, usamos action search, si no, action all
  if (filters.search) {
    params.append('action', 'search');
    params.append('q', filters.search);
  } else {
    params.append('action', 'all');
  }
  
  // Parámetros de filtrado
  if (filters.orderBy) {
    params.append('order', filters.orderBy);
  }
  
  if (filters.featured) {
    params.append('featured', 'true');
  }
  
  // Parámetros de paginación
  const page = filters.page || 1;
  const perPage = filters.perPage || 12;
  params.append('page', page.toString());
  params.append('per_page', perPage.toString());

  const endpoint = `${API_URL}?${params.toString()}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data: ApiResponse<Actriz[]> = await response.json();
    
    if (!data.success) throw new Error(data.error || 'Error desconocido');
    
    const actrices = data.data;
    const totalItems = data.count || actrices.length;
    const totalPages = Math.ceil(totalItems / perPage);
    
    return {
      data: actrices,
      totalItems,
      currentPage: page,
      totalPages,
      itemsPerPage: perPage
    };
  } catch (error) {
    console.error('Error en filtros:', error);
    // Fallback con paginación vacía
    return {
      data: [],
      totalItems: 0,
      currentPage: page,
      totalPages: 0,
      itemsPerPage: perPage
    };
  }
};
