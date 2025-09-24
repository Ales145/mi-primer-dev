import type { APIRoute } from 'astro';
import { searchActrices } from '../../lib/wp';

export const GET: APIRoute = async ({ url }) => {
  try {
    const query = url.searchParams.get('query');
    
    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Se requiere un término de búsqueda de al menos 2 caracteres' 
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store' 
          } 
        }
      );
    }

    const results = await searchActrices(query);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: results 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        } 
      }
    );
    
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error al procesar la búsqueda' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        } 
      }
    );
  }
}