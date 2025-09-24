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
}

export const getActricesFiltered = async (filters: FilterOptions = {}): Promise<Actriz[]> => {
  const params = new URLSearchParams();
  params.append('action', 'filter');
  
  if (filters.orderBy) {
    params.append('orderBy', filters.orderBy);
  }
  
  if (filters.featured) {
    params.append('featured', 'true');
  }

  const endpoint = `${API_URL}?${params.toString()}`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Error desconocido');
    return data.data;
  } catch (error) {
    console.error('Error en filtros:', error);
    return await getActrices(); // Fallback a todas las actrices si hay error
  }
};
