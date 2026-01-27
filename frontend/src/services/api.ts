/**
 * API service for communicating with the backend
 */

const API_BASE_URL = 'http://localhost:8000/api';

interface ApiError {
  detail: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    // Add timeout to avoid hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          detail: 'Error de conexion con el servidor',
        }));
        throw new Error(error.detail);
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return null as T;
      }

      return JSON.parse(text);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('El servidor no responde. Verifica que el backend este corriendo.');
      }
      throw err;
    }
  }

  // Auth endpoints
  async signup(email: string, username: string, password: string) {
    const data = await this.request<{
      access_token: string;
      user: User;
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{
      access_token: string;
      user: User;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getAuthStatus() {
    return this.request<{
      authenticated: boolean;
      user: User | null;
    }>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Round endpoints
  async getActiveRound() {
    return this.request<ActiveRound | null>('/rounds/active');
  }

  // Predictions endpoints
  async submitPrediction(roundId: number, selections: Record<number, string>) {
    return this.request<Prediction>('/predictions', {
      method: 'POST',
      body: JSON.stringify({ round_id: roundId, selections }),
    });
  }

  async getPredictionHistory() {
    return this.request<PredictionHistory[]>('/predictions/history');
  }

  async getPredictionForRound(roundId: number) {
    return this.request<Prediction | null>(`/predictions/${roundId}`);
  }

  async getPredictionDetail(predictionId: number) {
    return this.request<PredictionDetail>(`/predictions/${predictionId}/detail`);
  }
}

// Round/Matchup types
export interface ApiPlayer {
  id: number;
  name: string;
  team: string;
  position: string;
  photo_url: string | null;
  avg_points: number;
}

export interface ApiMatchup {
  id: number;
  player_a: ApiPlayer;
  player_b: ApiPlayer;
  order: number;
  result: string | null;
}

export interface ActiveRound {
  id: number;
  name: string;
  deadline: string;
  is_active: boolean;
  matchups: ApiMatchup[];
}

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

export interface Prediction {
  id: number;
  round_id: number;
  selections: string;
  submitted_at: string;
  score: number | null;
}

export interface PredictionHistory {
  id: number;
  round_name: string;
  submitted_at: string;
  score: number | null;
  total_matchups: number;
}

export interface MatchupDetail {
  id: number;
  order: number;
  player_a: ApiPlayer;
  player_b: ApiPlayer;
  user_selection: string;
  result: string | null;
  is_correct: boolean | null;
}

export interface PredictionDetail {
  id: number;
  round_id: number;
  round_name: string;
  submitted_at: string;
  score: number | null;
  correct_count: number;
  total_count: number;
  matchups: MatchupDetail[];
}

// Singleton instance
export const api = new ApiService();
