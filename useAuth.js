// Hook separado para evitar el error react-refresh/only-export-components
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => useContext(AuthContext);
