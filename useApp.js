// Hook separado para evitar el error react-refresh/only-export-components
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useAppContext = () => useContext(AppContext);
