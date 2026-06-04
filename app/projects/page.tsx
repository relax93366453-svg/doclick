"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Filter,
  GripVertical,
  Paperclip,
  Plus,
  Save,
  Search,
  Settings2,
  Trash2,
  UserRound,
  WalletCards,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type ProjectStage = "規劃" | "提案" | "執行" | "檢討" | "結案";
type ProjectCategory = "行銷" | "內部" | "合作" | "商品" | "實體" | "官網";
type FieldType = "文字" | "下拉選單" | "日期" | "金額" | "勾選" | "附件" | "備註";

type Project = {
  id: string;
  name: string;
  category: ProjectCategory;
  stage: ProjectStage;
  completed: boolean;
  description: string;
  owner: string;
  startDate: string;
  endDate: string;
  incomeExpense: number;
  attachment: string;
  attachmentUrl?: string;
  note: string;
};

type FieldSetting = {
  key: keyof Project;
  label: string;
  type: FieldType;
  visible: boolean;
  required: boolean;
  editable: boolean;
  width: string;
};

const initialProjects: Project[] = [
  {
    id: "PO-20200510-001",
    name: "端午節活促銷活動",
    category: "行銷",
    stage: "規劃",
    completed: false,
    description: "搭配六月新品規劃促銷活動、設計商品包裝",
    owner: "Rex",
    startDate: "2020/05/10",
    endDate: "2020/05/29",
    incomeExpense: 57480,
    attachment: "",
    attachmentUrl: "",
    note: "需重新選檔後才可點開"
  },
  {
    id: "PO-20200508-001",
    name: "外送平台分析",
    category: "內部",
    stage: "執行",
    completed: false,
    description: "四月外送平台成效、顧客滿意度",
    owner: "Lillian",
    startDate: "2020/05/08",
    endDate: "2020/05/15",
    incomeExpense: 0,
    attachment: "",
    attachmentUrl: "",
    note: ""
  },
  {
    id: "PO-20200507-001",
    name: "四月新品市調",
    category: "行銷",
    stage: "規劃",
    completed: false,
    description: "四月新品口味、價格、折扣分析",
    owner: "Rex",
    startDate: "2020/05/07",
    endDate: "2020/05/15",
    incomeExpense: 23000,
    attachment: "",
    attachmentUrl: "",
    note: ""
  },
  {
    id: "PO-20200505-001",
    name: "官網 2.0 分析",
    category: "官網",
    stage: "檢討",
    completed: true,
    description: "官網 2.0 流量、顧客滿意度、功能更新",
    owner: "Kayline",
    startDate: "2020/05/05",
    endDate: "2020/05/08",
    incomeExpense: 0,
    attachment: "",
    attachmentUrl: "",
    note: "已完成"
  }
];

const defaultFields: FieldSetting[] = [
  { key: "id", label: "專案編號", type: "文字", visible: true, required: true, editable: true, width: "160px" },
  { key: "name", label: "專案名稱", type: "文字", visible: true, required: true, editable: true, width: "180px" },
  { key: "category", label: "類別", type: "下拉選單", visible: true, required: false, editable: true, width: "100px" },
  { key: "stage", label: "階段", type: "下拉選單", visible: true, required: false, editable: true, width: "100px" },
  { key: "completed", label: "已完成", type: "勾選", visible: true, required: false, editable: true, width: "100px" },
  { key: "description", label: "描述", type: "備註", visible: true, required: false, editable: true, width: "280px" },
  { key: "owner", label: "負責人", type: "文字", visible: true, required: false, editable: true, width: "120px" },
  { key: "startDate", label: "開始日期", type: "日期", visible: true, required: false, editable: true, width: "140px" },
  { key: "endDate", label: "結束日期", type: "日期", visible: true, required: false, editable: true, width: "140px" },
  { key: "incomeExpense", label: "收支", type: "金額", visible: true, required: false, editable: true, width: "130px" },
  { key: "attachment", label: "附件檔案", type: "附件", visible: true, required: false, editable: true, width: "220px" },
  { key: "note", label: "備註", type: "備註", visible: true, required: false, editable: true, width: "220px" }
];

function money(value: number) {
  return value === 0 ? "$0" : `$${Number(value || 0).toLocaleString("zh-TW")}`;
}

function stageClass(stage: ProjectStage) {
  if (stage === "規劃") return "bg-sky-50 text-sky-700";
  if (stage === "提案") return "bg-amber-50 text-amber-700";
  if (stage === "執行") return "bg-rose-50 text-rose-700";
  if (stage === "檢討") return "bg-purple-50 text-purple-700";
  return "bg-emerald-50 text-emerald-700";
}

function categoryClass(category: ProjectCategory) {
  if (category === "行銷") return "bg-brand-50 text-brand-700";
  if (category === "內部") return "bg-slate-50 text-slate-700";
  if (category === "合作") return "bg-amber-50 text-amber-700";
  if (category === "商品") return "bg-orange-50 text-orange-700";
  if (category === "實體") return "bg-emerald-50 text-emerald-700";
  return "bg-purple-50 text-purple-700";
}

function todayId() {
  return `PO-${String(new Date().getTime()).slice(-9)}`;
}

function toInputDate(value: string) {
  return value.replaceAll("/", "-");
}

function toDisplayDate(value: string) {
  return value.replaceAll("-", "/");
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [fields, setFields] = useState<FieldSetting[]>(defaultFields);
  const [activeTab, setActiveTab] = useState<"list" | "fields" | "create">("list");
  const [keyword, setKeyword] = useState("");
  const [stageFilter, setStageFilter] = useState<"全部階段" | ProjectStage>("全部階段");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const visibleFields = fields.filter((field) => field.visible);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchKeyword = Object.values(project).join(" ").includes(keyword);
      const matchStage = stageFilter === "全部階段" || project.stage === stageFilter;
      return matchKeyword && matchStage;
    });
  }, [projects, keyword, stageFilter]);

  const totalAmount = filteredProjects.reduce((sum, project) => sum + project.incomeExpense, 0);
  const completedCount = filteredProjects.filter((project) => project.completed).length;
  const runningCount = filteredProjects.length - completedCount;

  function addProject() {
    const newProject: Project = {
      id: todayId(),
      name: "",
      category: "內部",
      stage: "規劃",
      completed: false,
      description: "",
      owner: "",
      startDate: "",
      endDate: "",
      incomeExpense: 0,
      attachment: "",
      attachmentUrl: "",
      note: ""
    };

    setProjects([newProject, ...projects]);
    setDraft(newProject);
    setEditingId(newProject.id);
    setActiveTab("list");
  }

  function startEdit(project: Project) {
    setDraft({ ...project });
    setEditingId(project.id);
  }

  function cancelEdit() {
    setDraft(null);
    setEditingId(null);
  }

  function saveEdit() {
    if (!draft || !editingId) return;
    setProjects((prev) => prev.map((project) => project.id === editingId ? draft : project));
    cancelEdit();
  }

  function deleteProject(id: string) {
    if (!confirm("確定要刪除這筆專案資料嗎？")) return;
    setProjects((prev) => prev.filter((project) => project.id !== id));
  }

  function updateDraft<K extends keyof Project>(key: K, value: Project[K]) {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  }
  function updateField(index: number, patch: Partial<FieldSetting>) {
    setFields((prev) => prev.map((field, i) => i === index ? { ...field, ...patch } : field));
  }

  function moveField(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    const current = next[index];
    next[index] = next[target];
    next[target] = current;
    setFields(next);
  }

  function addField() {
    if (!newFieldLabel.trim()) return;

    setFields([
      ...fields,
      {
        key: "note",
        label: newFieldLabel.trim(),
        type: "文字",
        visible: true,
        required: false,
        editable: true,
        width: "160px"
      }
    ]);

    setNewFieldLabel("");
  }

  function renderValue(project: Project, field: FieldSetting) {
    const value = project[field.key];

    if (field.key === "category") {
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${categoryClass(project.category)}`}>{project.category}</span>;
    }

    if (field.key === "stage") {
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${stageClass(project.stage)}`}>{project.stage}</span>;
    }

    if (field.key === "completed") {
      return project.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <span className="text-slate-300">未完成</span>;
    }

    if (field.key === "owner") {
      return <span className="inline-flex items-center gap-2"><UserRound className="h-3.5 w-3.5 text-slate-400" />{project.owner || "-"}</span>;
    }

    if (field.key === "startDate" || field.key === "endDate") {
      return value ? <span className="inline-flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-slate-400" />{String(value)}</span> : "-";
    }

    if (field.key === "incomeExpense") {
      return <span className={`font-bold ${project.incomeExpense > 0 ? "text-red-600" : "text-slate-700"}`}>{money(project.incomeExpense)}</span>;
    }

    if (field.key === "attachment") {
      if (!project.attachment) return "-";

      if (project.attachmentUrl) {
        return (
          <a
            href={project.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-brand-700 hover:underline"
          >
            <Paperclip className="h-3.5 w-3.5" />
            {project.attachment}
          </a>
        );
      }

      return (
        <span className="inline-flex items-center gap-2 text-slate-500">
          <Paperclip className="h-3.5 w-3.5" />
          {project.attachment}
          <span className="text-xs text-red-500">需重新上傳</span>
        </span>
      );
    }

    return <span>{String(value ?? "") || "-"}</span>;
  }

  return (
    <AppLayout title="專案任務">
      <PageHeader
        title="專案任務"
        description="管理專案列表、任務進度、專案收支、附件檔案與欄位設定。附件需編輯後重新選檔，儲存後才可點開。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => alert("Demo：已匯出專案資料。")}>
              <Download className="mr-2 h-4 w-4" />
              匯出
            </button>
            <button className="btn-primary" onClick={addProject}>
              <Plus className="mr-2 h-4 w-4" />
              新增專案
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="專案總數" value={`${filteredProjects.length} 筆`} icon={<FileText className="h-5 w-5" />} />
        <Stat label="已完成" value={`${completedCount} 筆`} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Stat label="進行中" value={`${runningCount} 筆`} icon={<CalendarDays className="h-5 w-5" />} />
        <Stat label="專案收支" value={money(totalAmount)} icon={<WalletCards className="h-5 w-5" />} />
      </div>

      <div className="card mb-5">
        <div className="flex flex-wrap gap-2">
          <TabButton active={activeTab === "list"} onClick={() => setActiveTab("list")}>專案列表</TabButton>
          <TabButton active={activeTab === "fields"} onClick={() => setActiveTab("fields")}>欄位設定</TabButton>
          <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>新增專案</TabButton>
        </div>
      </div>

      {activeTab === "list" && (
        <>
          <div className="card mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="搜尋專案編號、名稱、描述、負責人、附件..."
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>

              <select className="input max-w-44" value={stageFilter} onChange={(event) => setStageFilter(event.target.value as any)}>
                <option>全部階段</option>
                <option>規劃</option>
                <option>提案</option>
                <option>執行</option>
                <option>檢討</option>
                <option>結案</option>
              </select>

              <span className="flex items-center rounded-full bg-brand-50 px-3 py-2 text-sm text-brand-700">
                <Filter className="mr-2 h-4 w-4" />
                {filteredProjects.length} 筆資料
              </span>
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">專案列表</h2>
                <p className="mt-1 text-sm text-slate-500">
                  操作欄固定在左邊。附件要能點開，請先點編輯，選擇檔案後儲存。
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setActiveTab("fields")}>
                <Settings2 className="mr-2 h-4 w-4" />
                欄位設定
              </button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm" style={{ minWidth: `${visibleFields.length * 125 + 140}px` }}>
                <thead className="bg-slate-50">
                  <tr>
                    <th className="sticky left-0 z-20 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-center" style={{ minWidth: "130px" }}>
                      操作
                    </th>
                    {visibleFields.map((field, index) => (
                      <th key={`${field.key}-${index}`} className="border-b border-slate-200 px-4 py-3 text-left" style={{ minWidth: field.width }}>
                        {field.label}
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project) => {
                    const isEditing = editingId === project.id && draft;

                    if (isEditing && draft) {
                      return (
                        <tr key={project.id} className="bg-brand-50">
                          <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-brand-50 px-3 py-3">
                            <div className="flex justify-center gap-2">
                              <button className="rounded-xl bg-brand-600 px-3 py-2 text-white" onClick={saveEdit}>
                                <Save className="h-4 w-4" />
                              </button>
                              <button className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          {visibleFields.map((field, index) => (
                            <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-3 py-3" style={{ minWidth: field.width }}>
                              <EditableCell field={field} draft={draft} updateDraft={updateDraft} />
                            </td>
                          ))}
                        </tr>
                      );
                    }

                    return (
                      <tr key={project.id} className="hover:bg-slate-50">
                        <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-3 py-3">
                          <div className="flex justify-center gap-2">
                            <button className="rounded-xl bg-brand-50 px-3 py-2 text-brand-700 hover:bg-brand-100" onClick={() => startEdit(project)}>
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100" onClick={() => deleteProject(project.id)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        {visibleFields.map((field, index) => (
                          <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-4 py-3" style={{ minWidth: field.width }}>
                            {renderValue(project, field)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "fields" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">專案欄位設定</h2>
                <p className="mt-1 text-sm text-slate-500">可調整欄位名稱、類型、顯示、必填、可編輯與排序。</p>
              </div>
              <button className="btn-secondary" onClick={() => setFields(defaultFields)}>恢復預設</button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">排序</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">欄位名稱</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">欄位類型</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">顯示</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">必填</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">可編輯</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">寬度</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={`${field.key}-${index}`} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-slate-300" />
                          <button className="rounded-lg bg-slate-100 px-2 py-1 text-xs" onClick={() => moveField(index, -1)}>上</button>
                          <button className="rounded-lg bg-slate-100 px-2 py-1 text-xs" onClick={() => moveField(index, 1)}>下</button>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <input className="input min-w-36" value={field.label} onChange={(event) => updateField(index, { label: event.target.value })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <select className="input min-w-32" value={field.type} onChange={(event) => updateField(index, { type: event.target.value as FieldType })}>
                          <option>文字</option>
                          <option>下拉選單</option>
                          <option>日期</option>
                          <option>金額</option>
                          <option>勾選</option>
                          <option>附件</option>
                          <option>備註</option>
                        </select>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <button className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600" onClick={() => updateField(index, { visible: !field.visible })}>
                          {field.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <input type="checkbox" checked={field.required} onChange={(event) => updateField(index, { required: event.target.checked })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <input type="checkbox" checked={field.editable} onChange={(event) => updateField(index, { editable: event.target.checked })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <input className="input min-w-24" value={field.width} onChange={(event) => updateField(index, { width: event.target.value })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600" onClick={() => setFields((prev) => prev.filter((_, i) => i !== index))}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card">
              <h2 className="text-xl font-bold">新增欄位</h2>
              <p className="mt-1 text-sm text-slate-500">例如：優先級、客戶名稱、審核狀態、進度百分比。</p>
              <div className="mt-4 space-y-3">
                <input className="input" placeholder="輸入欄位名稱" value={newFieldLabel} onChange={(event) => setNewFieldLabel(event.target.value)} />
                <button className="btn-primary w-full justify-center" onClick={addField}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增欄位
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold">附件說明</h2>
              <div className="mt-4 space-y-3">
                <Info title="要重新選檔" text="只有重新選擇檔案並儲存後，才會產生可以點開的暫時連結。" />
                <Info title="Demo 限制" text="目前是前端暫存，重新整理後檔案連結會失效。" />
                <Info title="正式版" text="之後可接 Supabase Storage，附件就能永久保存與下載。" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="card">
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <FileText className="mb-4 h-12 w-12 text-brand-600" />
            <h2 className="text-xl font-bold">新增專案</h2>
            <p className="mt-2 text-sm text-slate-500">點下方按鈕會新增一筆空白專案，並切回專案列表讓你直接編輯。</p>
            <button className="btn-primary mt-5" onClick={addProject}>
              <Plus className="mr-2 h-4 w-4" />
              新增一筆專案
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function EditableCell({
  field,
  draft,
  updateDraft
}: {
  field: FieldSetting;
  draft: Project;
  updateDraft: <K extends keyof Project>(key: K, value: Project[K]) => void;
}) {
  if (!field.editable) return <span className="text-slate-400">不可編輯</span>;

  if (field.key === "category") {
    return (
      <select className="input min-w-28" value={draft.category} onChange={(event) => updateDraft("category", event.target.value as ProjectCategory)}>
        <option>行銷</option>
        <option>內部</option>
        <option>合作</option>
        <option>商品</option>
        <option>實體</option>
        <option>官網</option>
      </select>
    );
  }

  if (field.key === "stage") {
    return (
      <select className="input min-w-28" value={draft.stage} onChange={(event) => updateDraft("stage", event.target.value as ProjectStage)}>
        <option>規劃</option>
        <option>提案</option>
        <option>執行</option>
        <option>檢討</option>
        <option>結案</option>
      </select>
    );
  }

  if (field.key === "completed") {
    return <input type="checkbox" checked={draft.completed} onChange={(event) => updateDraft("completed", event.target.checked)} />;
  }

  if (field.key === "startDate" || field.key === "endDate") {
    return <input className="input min-w-36" type="date" value={toInputDate(String(draft[field.key] || ""))} onChange={(event) => updateDraft(field.key, toDisplayDate(event.target.value) as any)} />;
  }

  if (field.key === "incomeExpense") {
    return <input className="input min-w-32 text-right" type="number" value={Number(draft.incomeExpense || 0)} onChange={(event) => updateDraft("incomeExpense", Number(event.target.value))} />;
  }

  if (field.key === "attachment") {
    return (
      <div className="min-w-56 space-y-2">
        <input
          className="input"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            updateDraft("attachment", file.name);
            updateDraft("attachmentUrl", url);
          }}
        />

        {draft.attachmentUrl ? (
          <a
            href={draft.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700 hover:underline"
          >
            點我預覽：{draft.attachment || "已選擇檔案"}
          </a>
        ) : null}

        <input
          className="input"
          value={draft.attachment || ""}
          placeholder="尚未選擇檔案"
          onChange={(event) => updateDraft("attachment", event.target.value)}
        />
      </div>
    );
  }

  return <input className="input min-w-36" value={String(draft[field.key] ?? "")} onChange={(event) => updateDraft(field.key, event.target.value as any)} />;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`rounded-xl px-4 py-2 text-sm font-medium ${active ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
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

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
