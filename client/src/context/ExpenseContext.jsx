import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ExpenseContext = createContext();

const fetchWithAuth = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
};

export function ExpenseProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: 100, ...params }).toString();
      const res = await fetchWithAuth(`${API}/expenses?${qs}`);
      const json = await res.json();
      setTransactions(json.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchBudgets = useCallback(async (month) => {
    try {
      const m = month || new Date().toISOString().slice(0, 7);
      const res = await fetchWithAuth(`${API}/budgets?month=${m}`);
      const json = await res.json();
      setBudgets(json);
    } catch (e) { console.error(e); }
  }, []);

  const addTransaction = async (data) => {
    const res = await fetchWithAuth(`${API}/expenses`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) 
    });
    if (!res.ok) throw new Error('Failed to add');
    showToast('Transaction added!');
    await fetchTransactions();
  };

  const updateTransaction = async (id, data) => {
    const res = await fetchWithAuth(`${API}/expenses/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) 
    });
    if (!res.ok) throw new Error('Failed to update');
    showToast('Transaction updated!');
    await fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await fetchWithAuth(`${API}/expenses/${id}`, { method: 'DELETE' });
    showToast('Transaction deleted!');
    await fetchTransactions();
  };

  const addBudget = async (data) => {
    const res = await fetchWithAuth(`${API}/budgets`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) 
    });
    if (!res.ok) throw new Error('Failed to add budget');
    showToast('Budget added!');
    await fetchBudgets();
  };

  const updateBudget = async (id, data) => {
    const res = await fetchWithAuth(`${API}/budgets/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(data) 
    });
    if (!res.ok) throw new Error('Failed to update budget');
    showToast('Budget updated!');
    await fetchBudgets();
  };

  const deleteBudget = async (id) => {
    await fetchWithAuth(`${API}/budgets/${id}`, { method: 'DELETE' });
    showToast('Budget deleted!');
    await fetchBudgets();
  };

  useEffect(() => { 
    fetchTransactions(); 
    fetchBudgets(); 
  }, [fetchTransactions, fetchBudgets]);

  return (
    <ExpenseContext.Provider value={{ transactions, budgets, loading, toast, fetchTransactions, fetchBudgets, addTransaction, updateTransaction, deleteTransaction, addBudget, updateBudget, deleteBudget }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => useContext(ExpenseContext);
