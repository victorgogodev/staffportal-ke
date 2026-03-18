import { create } from 'zustand';

const safeParse = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

const useAuthStore = create((set) => ({
  user: safeParse('user') || null,
  token: localStorage.getItem('token') || null,

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify);
    set({ user });
  }
}));

export default useAuthStore;