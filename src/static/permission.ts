enum Permission {
  ANNOUNCEMENT_CREATE = 'ANNOUNCEMENT_CREATE',
  ANNOUNCEMENT_DELETE = 'ANNOUNCEMENT_DELETE',
  ANNOUNCEMENT_READ = 'ANNOUNCEMENT_READ',
  ANNOUNCEMENT_UPDATE = 'ANNOUNCEMENT_UPDATE',
  AUDIT_READ = 'AUDIT_READ',
  ROLE_CREATE = 'ROLE_CREATE',
  ROLE_DELETE = 'ROLE_DELETE',
  ROLE_READ = 'ROLE_READ',
  ROLE_UPDATE = 'ROLE_UPDATE',
  SETTINGS_READ = 'SETTINGS_READ',
  USER_CREATE = 'USER_CREATE',
  USER_DELETE = 'USER_DELETE',
  USER_READ = 'USER_READ',
  USER_UPDATE = 'USER_UPDATE',
}

export const permissionDescriptions: Record<string, string> = {
  [Permission.ANNOUNCEMENT_CREATE]: 'Can create announcements',
  [Permission.ANNOUNCEMENT_DELETE]: 'Can delete announcements',
  [Permission.ANNOUNCEMENT_READ]: 'Can read announcements',
  [Permission.ANNOUNCEMENT_UPDATE]: 'Can update announcements',
  [Permission.AUDIT_READ]: 'Can view audits',
  [Permission.ROLE_READ]: 'Can view roles',
  [Permission.ROLE_CREATE]: 'Can create roles',
  [Permission.ROLE_UPDATE]: 'Can update roles',
  [Permission.ROLE_DELETE]: 'Can delete roles',
  [Permission.SETTINGS_READ]: 'Can view settings',
  [Permission.USER_READ]: 'Can view users',
  [Permission.USER_CREATE]: 'Can create users',
  [Permission.USER_UPDATE]: 'Can update users',
  [Permission.USER_DELETE]: 'Can delete users',
};

export default Permission;
