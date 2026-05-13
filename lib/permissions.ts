import { ModuleKey } from "./modules";

export type RoleKey =
  | "owner"
  | "admin"
  | "regional-manager"
  | "store-manager"
  | "department-manager"
  | "staff"
  | "field-staff"
  | "finance"
  | "hr"
  | "viewer";

export type AppUser = {
  id: string;
  role: RoleKey;
  workspaceId: string;
  departmentId?: string;
  branchId?: string;
  regionId?: string;
};

export type AppRecord = {
  id: string;
  workspaceId: string;
  createdById?: string;
  departmentId?: string;
  branchId?: string;
  regionId?: string;
};

const roleModules: Record<RoleKey, ModuleKey[]> = {
  owner: ["dashboard", "templates", "form-builder", "inventory", "crm", "production", "equipment", "hr", "admin-office", "finance", "projects", "permissions", "settings"],
  admin: ["dashboard", "templates", "form-builder", "inventory", "crm", "production", "equipment", "hr", "admin-office", "finance", "projects", "permissions"],
  "regional-manager": ["dashboard", "inventory", "crm", "production", "equipment", "projects"],
  "store-manager": ["dashboard", "inventory", "crm", "hr", "projects"],
  "department-manager": ["dashboard", "crm", "hr", "projects", "admin-office"],
  staff: ["dashboard", "forms", "projects", "admin-office"] as ModuleKey[],
  "field-staff": ["dashboard", "form-builder", "projects"] as ModuleKey[],
  finance: ["dashboard", "finance", "crm", "admin-office"],
  hr: ["dashboard", "hr", "admin-office"],
  viewer: ["dashboard"]
};

export function canViewModule(user: AppUser, module: ModuleKey) {
  return roleModules[user.role]?.includes(module) ?? false;
}

export function canCreateRecord(user: AppUser, module: ModuleKey) {
  if (user.role === "viewer") return false;
  if (user.role === "field-staff") return ["projects", "form-builder"].includes(module);
  return canViewModule(user, module);
}

export function canEditRecord(user: AppUser, record: AppRecord) {
  if (user.workspaceId !== record.workspaceId) return false;
  if (["owner", "admin"].includes(user.role)) return true;
  if (user.role === "regional-manager") return user.regionId === record.regionId;
  if (user.role === "store-manager") return user.branchId === record.branchId;
  if (user.role === "department-manager") return user.departmentId === record.departmentId;
  return record.createdById === user.id;
}

export function canDeleteRecord(user: AppUser, record: AppRecord) {
  if (user.workspaceId !== record.workspaceId) return false;
  return ["owner", "admin"].includes(user.role);
}

export function canApproveRecord(user: AppUser, record: AppRecord) {
  if (user.workspaceId !== record.workspaceId) return false;
  return ["owner", "admin", "department-manager", "finance", "hr"].includes(user.role);
}

export function canExportData(user: AppUser, module: ModuleKey) {
  if (!canViewModule(user, module)) return false;
  return ["owner", "admin", "regional-manager", "finance", "hr"].includes(user.role);
}

export function canViewField(user: AppUser, field: { sensitive?: boolean; module?: ModuleKey }) {
  if (!field.sensitive) return true;
  if (field.module === "finance") return ["owner", "admin", "finance"].includes(user.role);
  if (field.module === "hr") return ["owner", "admin", "hr"].includes(user.role);
  return ["owner", "admin"].includes(user.role);
}

export function filterDataByScope<T extends AppRecord>(user: AppUser, records: T[]) {
  return records.filter((record) => {
    if (user.workspaceId !== record.workspaceId) return false;
    if (["owner", "admin"].includes(user.role)) return true;
    if (user.role === "regional-manager") return user.regionId === record.regionId;
    if (user.role === "store-manager") return user.branchId === record.branchId;
    if (user.role === "department-manager") return user.departmentId === record.departmentId;
    return record.createdById === user.id;
  });
}
