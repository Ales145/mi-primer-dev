// Función para manejar la navegación de la paginación
function handlePagination(event, page, currentParams) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    window.location.href = `?${params.toString()}`;
}

// Función para limpiar todos los filtros
function clearAllFilters() {
    window.location.search = '';
}

// Función para actualizar los filtros
function updateFilters(type, value) {
    const params = new URLSearchParams(window.location.search);
    
    if (value) {
        params.set(type, value);
    } else {
        params.delete(type);
    }
    
    // Resetear la página a 1 cuando se cambian los filtros
    params.set('page', '1');
    
    window.location.href = `?${params.toString()}`;
}

// Función para manejar la búsqueda
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.querySelector('#search-input');
    if (!searchInput) return;

    const params = new URLSearchParams(window.location.search);
    if (searchInput.value.trim()) {
        params.set('q', searchInput.value.trim());
    } else {
        params.delete('q');
    }
    
    // Resetear la página a 1 cuando se hace una búsqueda
    params.set('page', '1');
    
    window.location.href = `?${params.toString()}`;
}

// Función para mostrar el loading state
function showLoading() {
    const grid = document.querySelector('.grid');
    if (grid) {
        grid.style.opacity = '0.5';
    }
}

// Escuchar eventos una vez que el DOM está cargado
document.addEventListener('DOMContentLoaded', () => {
    // Configurar listener para el formulario de búsqueda
    const searchForm = document.querySelector('#search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // Configurar listeners para los filtros
    const orderSelect = document.querySelector('#order-select');
    if (orderSelect) {
        orderSelect.addEventListener('change', (e) => {
            updateFilters('orderBy', e.target.value);
        });
    }

    const featuredCheckbox = document.querySelector('#featured-checkbox');
    if (featuredCheckbox) {
        featuredCheckbox.addEventListener('change', (e) => {
            updateFilters('featured', e.target.checked ? 'true' : '');
        });
    }

    // Configurar listeners para los botones de paginación
    document.querySelectorAll('.pagination-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const page = button.dataset.page;
            handlePagination(e, page);
            showLoading();
        });
    });
});