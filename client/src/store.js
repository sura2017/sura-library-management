import { create } from 'zustand';
import API from './api';

const useBookStore = create((set) => ({
    books: [],
    loading: false,
    
    // Fetch all books from Backend
    fetchBooks: async () => {
        set({ loading: true });
        const res = await API.get('/books/all');
        set({ books: res.data, loading: false });
    },

    // Add a new book
    addBook: async (bookData) => {
        const res = await API.post('/books/add', bookData);
        set((state) => ({ books: [...state.books, res.data] }));
    }
}));

export default useBookStore;