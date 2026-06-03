"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ArrowRightLeft,
  CheckCircle2,
  Eye,
  FileLock2,
  Lock,
  Plus,
  Save,
  ShieldCheck,
  UserCog,
  UsersRound
} from "lucide-react";
import { useMemo, useState } from "react";

type AccessLevel = "無權限" | "問卷式使用者" | "僅閱覽" | "佈告欄式使用者" | "管理者";

type PermissionRow = {
  level: AccessLevel;
  view: string;
  create: string;
  edit: string;
  description: string;
  stars: string;
};

type Group = {
  id: string;
  name: string;
  members: number;
  accessLevel: AccessLevel;
  modules: string[];
};

type FormPermission = {
  id: string;
  formName: string;
  ownerGroup: string;
  accessLevel: AccessLevel;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

const accessRows: PermissionRow[] = [
  {
    level: "無權限",
    view: "看不到任何資料",
    create: "不可以",
    edit: "不可以",
    description: "無法看見該表單",
    stars: "★"
  },
  {
    level: "問卷式使用者",
    view: "自己新增及被指派的資料",
    create: "可以",
    edit: "自己新增及被指派的資料",
    description: "可以新增或編輯自己的資料，但無法看見別人新增的資料",
    stars: "★★"
  },
  {
    level: "僅閱覽",
    view: "所有資料",
    create: "不可以",
    edit: "不可以",
    description: "可以瀏覽所有資料，但不能修改或新增資料",
    stars: "★★★"
  },
  {
    level: "佈告欄式使用者",
    view: "所有資料",
    create: "可以",
    edit: "自己新增及被指派的資料",
    description: "可以新增並編輯自己的資料，也可以瀏覽所有人的資料，但無法編輯不是他所新增的資料",
    stars: "★★★★"
  },
  {
    level: "管理者",
    view: "所有資料",
    create: "可以",
    edit: "所有資料",
    description: "可以新增、編輯、查看、刪除所有資料",
    stars: "★★★★★"
  }
];

const defaultGroups: Group[] = [
  { id: "g1", name: "系統管理者", members: 2, accessLevel: "管理者", modules: ["全部模組"] },
  { id: "g2", name: "業務部", members: 8, accessLevel: "問卷式使用者", modules: ["銷售客戶", "訂單管理", "報價單"] },
  { id: "g3", name: "主管群組", members: 4, accessLevel: "僅閱覽", modules: ["報表中心", "人事管理", "財務管理"] },
  { id: "g4", name: "行政部", members: 5, accessLevel: "佈告欄式使用者", modules: ["行政管理", "公文收發", "會議室管理"] },
  { id: "g5", name: "外勤人員", members: 16, accessLevel: "問卷式使用者", modules: ["外勤回報", "任務派工"] }
];

const defaultFormPermissions: FormPermission[] = [
  { id: "p1", formName: "報價單", ownerGroup: "業務部", accessLevel: "問卷式使用者", canView: true, canCreate: true, canEdit: true, canDelete: false },
  { id: "p2", formName: "客戶資料", ownerGroup: "業務部", accessLevel: "問卷式使用者", canView: true, canCreate: true, canEdit: true, canDelete: false },
  { id: "p3", formName: "薪資資料", ownerGroup: "主管群組", accessLevel: "僅閱覽", canView: true, canCreate: false, canEdit: false, canDelete: false },
  { id: "p4", formName: "財務報表", ownerGroup: "系統管理者", accessLevel: "管理者", canView: true, canCreate: true, canEdit: true, canDelete: true },
  { id: "p5", formName: "外勤回報", ownerGroup: "外勤人員", accessLevel: "問卷式使用者", canView: true, canCreate: true, canEdit: true, canDelete: false }
];

const accessLevels: AccessLevel[] = ["無權限", "問卷式使用者", "僅閱覽", "佈告欄式使用者", "管理者"];
const modules = ["全部模組", "銷售客戶", "訂單管理", "報價單", "人事管理", "薪資資料", "財務管理", "報表中心", "外勤回報", "任務派工", "行政管理"];

function levelClass(level: AccessLevel) {
  if (level === "管理者") return "bg-brand-600 text-white";
  if (level === "佈告欄式使用者") return "bg-violet-50 text-violet-700";
  if (level === "僅閱覽") return "bg-blue-50 text-blue-700";
  if (level === "問卷式使用者") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-500";
}

export default function AdvancedPermissionsPage() {
  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [formPermissions, setFormPermissions] = useState<FormPermission[]>(defaultFormPermissions);
  const [activeGroupId, setActiveGroupId] = useState("g2");
  const [fromUser, setFromUser] = useState("A 業務");
  const [toUser, setToUser] = useState("B 業務");

  const activeGroup = useMemo(
    () => groups.find((group) => group.id === activeGroupId) ?? groups[0],
    [groups, activeGroupId]
  );

  function updateGroup(key: keyof Group, value: string | number | string[]) {
    setGroups((prev) => prev.map((group) => group.id === activeGroup.id ? { ...group, [key]: value } : group));
  }

  function addGroup() {
    const next: Group = {
      id: crypto.randomUUID(),
      name: "新增群組",
      members: 0,
      accessLevel: "問卷式使用者",
      modules: ["銷售客戶"]
    };
    setGroups((prev) => [...prev, next]);
    setActiveGroupId(next.id);
  }

  function updateFormPermission(id: string, key: keyof FormPermission, value: string | boolean) {
    setFormPermissions((prev) => prev.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }

  function toggleModule(module: string) {
    const exists = activeGroup.modules.includes(module);
    const nextModules = exists
      ? activeGroup.modules.filter((item) => item !== module)
      : [...activeGroup.modules, module];

    updateGroup("modules", nextModules);
  }

  function demoSave() {
    alert("Demo：權限設定已儲存。\n正式版會寫入資料庫，並依群組控制每張表單的瀏覽、新增、修改、刪除權限。");
  }

  function transferData() {
    alert(`Demo：已將 ${fromUser} 的客戶資料轉移給 ${toUser}。\n正式版可在業務離職時批次轉移客戶、報價單、訂單與待辦任務。`);
  }

  return (
    <AppLayout title="權限控管進階版">
      <PageHeader
        title="權限控管進階版"
        description="設定群組、表單存取權限、資料可見範圍，避免不同業務互看客戶資料，也支援離職業務資料轉移。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={addGroup}>
              <Plus className="mr-2 h-4 w-4" />
              新增群組
            </button>
            <button className="btn-primary" onClick={demoSave}>
              <Save className="mr-2 h-4 w-4" />
              儲存權限
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="使用者群組" value={`${groups.length} 組`} icon={<UsersRound className="h-5 w-5" />} />
        <Stat label="已設定表單" value={`${formPermissions.length} 張`} icon={<FileLock2 className="h-5 w-5" />} />
        <Stat label="管理者群組" value={`${groups.filter((g) => g.accessLevel === "管理者").length} 組`} icon={<ShieldCheck className="h-5 w-5" />} />
        <Stat label="資料轉移紀錄" value="3 筆" icon={<ArrowRightLeft className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <div className="card">
            <h3 className="mb-4 font-bold">使用者群組</h3>

            <div className="space-y-2">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setActiveGroupId(group.id)}
                  className={`w-full rounded-2xl border p-4 text-left ${
                    activeGroupId === group.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold">{group.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">{group.members} 位使用者</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${levelClass(group.accessLevel)}`}>
                      {group.accessLevel}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold">客戶資料轉移</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              當 A 業務離職，可以將他的客戶資料、報價單、訂單與待辦任務轉移給 B 業務。
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">原負責人</label>
                <input className="input" value={fromUser} onChange={(event) => setFromUser(event.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">轉移給</label>
                <input className="input" value={toUser} onChange={(event) => setToUser(event.target.value)} />
              </div>

              <button className="btn-primary w-full" onClick={transferData}>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                執行資料轉移
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <div className="mb-5 flex items-center gap-2">
              <UserCog className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold">群組權限設定</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">群組名稱</label>
                <input className="input" value={activeGroup.name} onChange={(event) => updateGroup("name", event.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">成員數</label>
                <input className="input" type="number" value={activeGroup.members} onChange={(event) => updateGroup("members", Number(event.target.value))} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">存取權限</label>
                <select className="input" value={activeGroup.accessLevel} onChange={(event) => updateGroup("accessLevel", event.target.value)}>
                  {accessLevels.map((level) => <option key={level}>{level}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-medium">可使用模組</p>
              <div className="flex flex-wrap gap-2">
                {modules.map((module) => (
                  <button
                    key={module}
                    onClick={() => toggleModule(module)}
                    className={`rounded-full px-3 py-2 text-sm ${
                      activeGroup.modules.includes(module) ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    {module}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center gap-2">
              <Lock className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold">存取權限層級說明</h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["存取權限設定", "瀏覽", "新增", "修改", "權限描述", "層級"].map((head) => (
                      <th key={head} className="border-b border-slate-200 px-3 py-3 text-left">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accessRows.map((row) => (
                    <tr key={row.level}>
                      <td className="border-b border-slate-100 px-3 py-3 font-bold">{row.level}</td>
                      <td className="border-b border-slate-100 px-3 py-3">{row.view}</td>
                      <td className="border-b border-slate-100 px-3 py-3">{row.create}</td>
                      <td className="border-b border-slate-100 px-3 py-3">{row.edit}</td>
                      <td className="border-b border-slate-100 px-3 py-3 text-slate-500">{row.description}</td>
                      <td className="border-b border-slate-100 px-3 py-3 text-brand-700">{row.stars}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center gap-2">
              <FileLock2 className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold">表單權限設定</h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["表單", "群組", "權限層級", "瀏覽", "新增", "修改", "刪除"].map((head) => (
                      <th key={head} className="border-b border-slate-200 px-3 py-3 text-left">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formPermissions.map((item) => (
                    <tr key={item.id}>
                      <td className="border-b border-slate-100 px-3 py-3 font-medium">{item.formName}</td>
                      <td className="border-b border-slate-100 px-3 py-3">
                        <input
                          className="w-full bg-transparent outline-none"
                          value={item.ownerGroup}
                          onChange={(event) => updateFormPermission(item.id, "ownerGroup", event.target.value)}
                        />
                      </td>
                      <td className="border-b border-slate-100 px-3 py-3">
                        <select
                          className="rounded-xl border border-slate-200 px-2 py-1"
                          value={item.accessLevel}
                          onChange={(event) => updateFormPermission(item.id, "accessLevel", event.target.value)}
                        >
                          {accessLevels.map((level) => <option key={level}>{level}</option>)}
                        </select>
                      </td>
                      {["canView", "canCreate", "canEdit", "canDelete"].map((key) => (
                        <td key={key} className="border-b border-slate-100 px-3 py-3">
                          <input
                            type="checkbox"
                            checked={Boolean(item[key as keyof FormPermission])}
                            onChange={(event) => updateFormPermission(item.id, key as keyof FormPermission, event.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm leading-6 text-brand-800">
              範例：A 業務只能看到自己的報價單，主管可以看到全部業務報價單，管理者可以新增、修改、刪除所有資料。
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
