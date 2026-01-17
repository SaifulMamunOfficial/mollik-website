// Admin role checker utility
// Allows SUPER_ADMIN, ADMIN, EDITOR, and MANAGER roles

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'] as const;

export function isAdmin(role: string | undefined | null): boolean {
    if (!role) return false;
    return ADMIN_ROLES.includes(role as typeof ADMIN_ROLES[number]);
}

export function isSuperAdmin(role: string | undefined | null): boolean {
    return role === 'SUPER_ADMIN';
}
