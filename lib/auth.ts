export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'github';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Mock authentication functions - integrate with your preferred auth provider
export const socialLogin = async (provider: 'google' | 'facebook' | 'github'): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
    provider
  };
};

export const logout = async (): Promise<void> => {
  // Simulate logout
  await new Promise(resolve => setTimeout(resolve, 500));
};