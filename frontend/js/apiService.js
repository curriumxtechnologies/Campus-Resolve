// js/apiService.js

// Determine the base URL based on the current environment
const getBaseUrl = () => {
  // If we're running on localhost or 127.0.0.1, use local dev server
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000';
  }
  // Otherwise, use the production Render API
  return 'https://campus-resolve-api-eqof.onrender.com';
};

const BASE_URL = getBaseUrl();

// Helper to get stored token
function getToken() {
  return localStorage.getItem('token');
}

// Generic request handler
async function request(method, endpoint, body = null, isFormData = false) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {};

  if (getToken()) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  }

  // If not sending FormData, set JSON content type
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    // Throw an error with the message from the backend (or a default)
    const message = data.message || 'Something went wrong';
    throw new Error(message);
  }

  return data;
}

export const get = (endpoint) => request('GET', endpoint);
export const post = (endpoint, body, isFormData = false) => request('POST', endpoint, body, isFormData);
export const put = (endpoint, body, isFormData = false) => request('PUT', endpoint, body, isFormData);
export const del = (endpoint) => request('DELETE', endpoint);