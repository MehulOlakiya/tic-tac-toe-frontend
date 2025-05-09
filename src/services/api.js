/**
 * API service for making HTTP requests to the backend
 */

const API_URL = process.env.BACKEND_URL || "http://localhost:3001";

/**
 * Get all games with optional filtering
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with games data
 */
export const getGames = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.status) queryParams.append("status", params.status);
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  const response = await fetch(`${API_URL}/api/games${queryString}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

/**
 * Get a specific game by ID
 * @param {string} gameId - The game ID
 * @returns {Promise} - Promise with game data
 */
export const getGameById = async (gameId) => {
  const response = await fetch(`${API_URL}/api/games/${gameId}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

/**
 * Create a new game via REST API
 * @param {Object} data - Game creation data
 * @returns {Promise} - Promise with created game data
 */
export const createGame = async (data = {}) => {
  const response = await fetch(`${API_URL}/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

/**
 * Get game statistics
 * @returns {Promise} - Promise with game statistics
 */
export const getGameStats = async () => {
  const response = await fetch(`${API_URL}/api/games/stats/summary`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};
