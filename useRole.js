// useRole.js
// Hook derivado que expone el rol del usuario y helpers booleanos.
// La nomenclatura de labels cambia según institution.type.

import { useAuth } from './useAuth';

const ROLE_LABELS = {
  university: {
    admin:       'Administrador',
    coordinator: 'Coordinador Académico',
    teacher:     'Docente',
  },
  school: {
    admin:       'Director',
    coordinator: 'Coordinador Académico',
    teacher:     'Docente',
  },
};

export function useRole() {
  const { role, institution } = useAuth();

  const instType = institution?.type ?? 'university';
  const labels   = ROLE_LABELS[instType] ?? ROLE_LABELS.university;

  return {
    role,
    roleLabel:       role ? (labels[role] ?? role) : '—',
    isAdmin:         role === 'admin',
    isCoordinator:   role === 'coordinator',
    isTeacher:       role === 'teacher',
  };
}
