"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  AlertTriangle,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Cloud,
  ExternalLink,
  FileText,
  Mail,
  RefreshCcw,
  Settings2,
  ShieldCheck,
  Smartphone,
  TimerReset,
  UsersRound
} from "lucide-react";
import { useMemo, useState } from "react";

type SyncStatus = "已同步" | "待同步" | "同步中" | "同步異常";
type CalendarSource = "Google" | "Outlook";

type CalendarEvent = {
  id: string;
  title: string;
  type: string;
  sourceForm: string;
  owner: string;
  date: string;
  time: string;
  calendar: CalendarSource;
  status: SyncStatus;
  lastSync: string;
  note: string;
};

const defaultEvents: CalendarEvent[] = [
  {
    id: "SO-20210729-055",
    title: "訂單交期提醒",
    type: "訂單交期",
    sourceForm: "訂單管理",
    owner: "業務部",
    date: "2026/06/07",
    time: "10:00",
    calendar: "Google",
    status: "已同步",
    lastSync: "2026/06/04 10:30",
    note: "已出現在 Google 行事曆。"
  },
  {
    id: "REQ-001",
    title: "門市用品請購待簽核",
    type: "簽核提醒",
    sourceForm: "請購單",
    owner: "主管",
    date: "2026/06/04",
    time: "14:00",
    calendar: "Google",
    status: "待同步",
    lastSync: "尚未同步",
    note: "外部行事曆尚未更新，可手動同步。"
  },
  {
    id: "LEAVE-008",
    title: "王小明特休",
    type: "請假",
    sourceForm: "請假單",
    owner: "人資",
    date: "2026/06/10",
    time: "全天",
    calendar: "Outlook",
    status: "已同步",
    lastSync: "2026/06/04 09:20",
    note: "已同步到 Outlook 行事曆。"
  },
  {
    id: "TASK-032",
    title: "外勤派工：客戶設備檢查",
    type: "派工",
    sourceForm: "派工任務",
    owner: "外勤部",
    date: "2026/06/05",
    time: "15:30",
    calendar: "Google",
    status: "同步異常",
    lastSync: "2026/06/04 08:10",
    note: "權限或網路異常，請重新授權或手動同步。"
  },
  {
    id: "MEET-012",
    title: "內部週會",
    type: "會議",
    sourceForm: "會議室管理",
    owner: "行政部",
    date: "2026/06/06",
    time: "11:00",
    calendar: "Outlook",
    status: "待同步",
    lastSync: "尚未同步",
    note: "等待下一次自動同步。"
  }
];

const syncLogs = [
  { time: "2026/06/04 10:30", action: "Google 行事曆同步完成", result: "成功", count: "3 筆" },
  { time: "2026/06/04 09:20", action: "Outlook 行事曆同步完成", result: "成功", count: "1 筆" },
  { time: "2026/06/04 08:10", action: "Google 行事曆同步失敗", result: "異常", count: "1 筆" },
  { time: "2026/06/03 18:00", action: "自動同步排程執行", result: "成功", count: "6 筆" }
];

function statusClass(status: SyncStatus) {
  if (status === "已同步") return "bg-emerald-50 text-emerald-700";
  if (status === "同步異常") return "bg-red-50 text-red-700";
  if (status === "同步中") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

function calendarClass(calendar: CalendarSource) {
  return calendar === "Google" ? "bg-brand-50 text-brand-700" : "bg-violet-50 text-violet-700";
}

export default function CalendarSyncPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  const [selectedId, setSelectedId] = useState(defaultEvents[0].id);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState("每 30 分鐘");

  const selected = events.find((event) => event.id === selectedId) ?? events[0];

  const summary = useMemo(() => {
    return {
      synced: events.filter((event) => event.status === "已同步").length,
      pending: events.filter((event) => event.status === "待同步").length,
      error: events.filter((event) => event.status === "同步異常").length,
      google: events.filter((event) => event.calendar === "Google").length,
      outlook: events.filter((event) => event.calendar === "Outlook").length
    };
  }, [events]);

  function manualSync(id?: string) {
    setEvents((prev) =>
      prev.map((event) => {
        if (id && event.id !== id) return event;
        return {
          ...event,
          status: "已同步",
          lastSync: new Date().toLocaleString("zh-TW"),
          note: `已手動同步到 ${event.calendar} 行事曆。`
        };
      })
    );
  }

  function markError(id: string) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              status: "同步異常",
              note: "同步失敗，可能是外部帳號授權過期或網路延遲。"
            }
          : event
      )
    );
  }

  return (
    <AppLayout title="整合行事曆">
      <PageHeader
        title="整合行事曆"
        description="整合 Google 與 Outlook 行事曆，將請假、排班、派工、會議與訂單交期同步成行事曆事件。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => manualSync()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              全部手動同步
            </button>
            <button className="btn-primary" onClick={() => alert("Demo：已開啟 Google / Outlook 授權設定。")}>
              <Settings2 className="mr-2 h-4 w-4" />
              整合設定
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-5">
        <Stat label="已同步" value={`${summary.synced} 筆`} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Stat label="待同步" value={`${summary.pending} 筆`} icon={<Clock3 className="h-5 w-5" />} />
        <Stat label="同步異常" value={`${summary.error} 筆`} icon={<AlertTriangle className="h-5 w-5" />} />
        <Stat label="Google" value={`${summary.google} 筆`} icon={<CalendarCheck className="h-5 w-5" />} />
        <Stat label="Outlook" value={`${summary.outlook} 筆`} icon={<Mail className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
        <div className="space-y-5">
          <div className="card">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">行事曆同步設定</h2>
                <p className="mt-1 text-sm text-slate-500">
                  外部行事曆供應商更新時間不同，因此提供自動同步與手動同步。
                </p>
              </div>

              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => alert("Demo：已連結 Google Calendar。")}>
                  連結 Google
                </button>
                <button className="btn-secondary" onClick={() => alert("Demo：已連結 Outlook Calendar。")}>
                  連結 Outlook
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold">自動同步</span>
                  <input type="checkbox" checked={autoSync} onChange={(event) => setAutoSync(event.target.checked)} />
                </div>
                <p className="mt-2 text-sm text-slate-500">定時把系統行程同步到外部行事曆。</p>
              </label>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-2 font-bold">同步頻率</p>
                <select className="input" value={syncInterval} onChange={(event) => setSyncInterval(event.target.value)}>
                  <option>每 15 分鐘</option>
                  <option>每 30 分鐘</option>
                  <option>每 1 小時</option>
                  <option>每天 09:00</option>
                  <option>僅手動同步</option>
                </select>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4 text-amber-800">
                <div className="flex items-center gap-2 font-bold">
                  <TimerReset className="h-4 w-4" />
                  同步延遲提醒
                </div>
                <p className="mt-2 text-sm leading-6">
                  Google / Outlook 更新時間可能不同，若主管需要立刻看到，請按手動同步。
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">同步行程清單</h2>
                <p className="mt-1 text-sm text-slate-500">表單資料可轉成 Google / Outlook 行事曆事件。</p>
              </div>
              <CalendarClock className="h-6 w-6 text-brand-600" />
            </div>

            <div className="space-y-3">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedId(event.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedId === event.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs ${calendarClass(event.calendar)}`}>{event.calendar}</span>
                        <span className={`rounded-full px-2 py-1 text-xs ${statusClass(event.status)}`}>{event.status}</span>
                        <span className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-500">{event.type}</span>
                      </div>
                      <h3 className="font-bold">{event.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {event.date}｜{event.time}｜來源：{event.sourceForm}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          manualSync(event.id);
                        }}
                        className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white"
                      >
                        手動同步
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">可同步的表單來源</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <SourceCard title="請假單" text="核准後同步為員工請假行程。" icon={<UsersRound className="h-5 w-5" />} />
              <SourceCard title="智慧排班" text="排班班別同步到主管或員工行事曆。" icon={<CalendarCheck className="h-5 w-5" />} />
              <SourceCard title="派工任務" text="外勤任務同步為行程提醒。" icon={<Smartphone className="h-5 w-5" />} />
              <SourceCard title="會議室管理" text="會議預約同步到參與者行事曆。" icon={<CalendarClock className="h-5 w-5" />} />
              <SourceCard title="訂單交期" text="訂單交貨日同步為提醒事件。" icon={<FileText className="h-5 w-5" />} />
              <SourceCard title="電子簽核" text="待簽核事項同步提醒主管。" icon={<ShieldCheck className="h-5 w-5" />} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h2 className="text-xl font-bold">行程明細</h2>
            <p className="mt-1 text-sm text-slate-500">查看目前選取行程的同步狀態。</p>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs text-brand-600">DOCLICK.TW Calendar</p>
                    <h3 className="mt-1 text-lg font-bold">{selected.title}</h3>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${statusClass(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <Info label="事件編號" value={selected.id} />
                  <Info label="行程日期" value={`${selected.date} ${selected.time}`} />
                  <Info label="來源表單" value={selected.sourceForm} />
                  <Info label="負責單位" value={selected.owner} />
                  <Info label="外部行事曆" value={selected.calendar} />
                  <Info label="最後同步" value={selected.lastSync} />
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-bold">說明</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{selected.note}</p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button className="btn-secondary justify-center" onClick={() => markError(selected.id)}>
                    標記異常
                  </button>
                  <button className="btn-primary justify-center" onClick={() => manualSync(selected.id)}>
                    手動同步
                  </button>
                </div>

                <button className="mt-3 flex w-full items-center justify-center rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:bg-brand-50">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  開啟外部行事曆
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">同步紀錄</h2>
            <div className="mt-4 space-y-3">
              {syncLogs.map((log) => (
                <div key={`${log.time}-${log.action}`} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold">{log.action}</h3>
                    <span className={log.result === "成功" ? "text-sm text-emerald-600" : "text-sm text-red-600"}>
                      {log.result}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{log.time}｜{log.count}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">為什麼沒有即時更新？</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Google 與 Outlook 的行事曆更新速度會受到外部服務、授權狀態、網路與同步頻率影響。
              所以系統提供「手動同步」，讓主管需要立刻看到時可以立即更新。
            </p>
            <div className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm leading-6 text-brand-800">
              建議說法：外部行事曆不是每秒即時更新，若要馬上出現在 Google / Outlook，請按「手動同步」。
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
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

function SourceCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}
