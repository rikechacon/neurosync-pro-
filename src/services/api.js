/**
 * Servicio de API para NeuroSync Pro
 * Conecta con el backend en Render
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Obtener token del localStorage
const getToken = () => localStorage.getItem('neurosync_token');

// Headers comunes con autenticación
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': getToken() ? `Bearer ${getToken()}` : ''
});

// Manejar respuestas
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  
  return data;
};

// === Autenticación ===
export const authAPI = {
  // Registro
  register: async (email, password, name) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name })
    });
    return handleResponse(response);
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(response);
    
    // Guardar token
    if (data.token) {
      localStorage.setItem('neurosync_token', data.token);
      localStorage.setItem('neurosync_user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('neurosync_token');
    localStorage.removeItem('neurosync_user');
  },

  // Obtener perfil
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Verificar si está logueado
  isAuthenticated: () => {
    return !!getToken();
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('neurosync_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// === Rutinas ===
export const routinesAPI = {
  // Crear rutina
  create: async (routineData) => {
    const response = await fetch(`${API_BASE_URL}/routines`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(routineData)
    });
    return handleResponse(response);
  },

  // Obtener rutinas
  getAll: async (limit = 10, offset = 0) => {
    const response = await fetch(
      `${API_BASE_URL}/routines?limit=${limit}&offset=${offset}`,
      { headers: getHeaders() }
    );
    return handleResponse(response);
  },

  // Obtener rutina específica
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/routines/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Eliminar rutina
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/routines/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Registrar sesión completada
  logSession: async (routineId, sessionData) => {
    const response = await fetch(`${API_BASE_URL}/routines/${routineId}/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sessionData)
    });
    return handleResponse(response);
  }
};

// === Estadísticas ===
export const statsAPI = {
  // Obtener resumen
  getSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/summary`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Obtener historial de sesiones
  getSessions: async (limit = 20, offset = 0) => {
    const response = await fetch(
      `${API_BASE_URL}/stats/sessions?limit=${limit}&offset=${offset}`,
      { headers: getHeaders() }
    );
    return handleResponse(response);
  }
};

// === Health Check ===
export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return handleResponse(response);
  }
};

export default {
  auth: authAPI,
  routines: routinesAPI,
  stats: statsAPI,
  health: healthAPI
};
