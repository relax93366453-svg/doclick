"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Download,
  Edit3,
  Plus,
  RefreshCcw,
  Settings2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ShiftCell = {
  shift: string;
  start: string;
  end: string;
};

type EmployeeSchedule = {
  id: string;
  name: string;
  role: string;
  monthly: Record<string, ShiftCell>;
};

type EditingCell = {
  rowId: string;
  day: number;
  employeeName: string;
  value: ShiftCell;
} | null;

const shiftPresets = [
  { key: "休", label: "休假", start: "", end: "", hours: 0, className: "bg-red-50 text-red-600 border-red-200" },
  { key: "早", label: "早班", start: "09:00", end: "18:00", hours: 8, className: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "午", label: "午班", start: "12:00", end: "21:00", hours: 8, className: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "晚", label: "晚班", start: "15:00", end: "00:00", hours: 8, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "內", label: "內場", start: "10:00", end: "19:00", hours: 8, className: "bg-slate-50 text-slate-700 border-slate-200" },
  { key: "自", label: "自訂", start: "10:00", end: "18:00", hours: 8, className: "bg-purple-50 text-purple-700 border-purple-200" },
];

const defaultEmployees = [
  { id: "sch-1", name: "王小明", role: "正職" },
  { id: "sch-2", name: "林可欣", role: "PT" },
  { id: "sch-3", name: "曾思穎", role: "正職" },
];

const checkItems = [
  "檢查排休數量",
  "檢查國定假日數量",
  "檢查總工時",
  "單日上班時數",
  "休息間隔檢核",
  "連續上班天數"
];

function getPreset(key: string) {
  return shiftPresets.find((item) => item.key === key) ?? shiftPresets[1];
}

function makeCell(key: string): ShiftCell {
  const preset = getPreset(key);
  return { shift: preset.key, start: preset.start, end: preset.end };
}

function normalizeCell(value: unknown): ShiftCell {
  if (typeof value === "string") return makeCell(value);
  if (value && typeof value === "object") {
    const cell = value as Partial<ShiftCell>;
    const preset = getPreset(cell.shift ?? "早");
    return {
      shift: cell.shift ?? preset.key,
      start: cell.start ?? preset.start,
      end: cell.end ?? preset.end
    };
  }
  return makeCell("早");
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getWeekday(year: number, month: number, day: number) {
  const week = ["日", "一", "二", "三", "四", "五", "六"];
  return week[new Date(year, month - 1, day).getDay()];
}

function calcHours(start: string, end: string) {
  if (!start || !end) return 0;

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  let startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;

  if (endTotal <= startTotal) endTotal += 24 * 60;

  return Math.round(((endTotal - startTotal) / 60) * 10) / 10;
}

function makeDefaultMonthly(year: number, month: number, employeeIndex: number) {
  const totalDays = daysInMonth(year, month);
  const monthly: Record<string, ShiftCell> = {};

  for (let day = 1; day <= totalDays; day++) {
    const weekday = new Date(year, month - 1, day).getDay();

    if (weekday === 0) monthly[String(day)] = makeCell("休");
    else if ((day + employeeIndex) % 6 === 0) monthly[String(day)] = makeCell("休");
    else if ((day + employeeIndex) % 5 === 0) monthly[String(day)] = makeCell("晚");
    else if ((day + employeeIndex) % 3 === 0) monthly[String(day)] = makeCell("午");
    else monthly[String(day)] = makeCell("早");
  }

  return monthly;
}

function createInitialSchedules(year: number, month: number): EmployeeSchedule[] {
  return defaultEmployees.map((employee, index) => ({
    ...employee,
    monthly: makeDefaultMonthly(year, month, index)
  }));
}

export default function HrMonthlySchedulePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [schedules, setSchedules] = useState<EmployeeSchedule[]>(() =>
    createInitialSchedules(today.getFullYear(), today.getMonth() + 1)
  );
  const [maxMonthlyHours, setMaxMonthlyHours] = useState(184);
  const [minRestDays, setMinRestDays] = useState(8);
  const [selectedChecks, setSelectedChecks] = useState<string[]>(checkItems);
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  const storageKey = `bizflow-hr-monthly-schedule-${year}-${month}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved) as EmployeeSchedule[];
      const migrated = parsed.map((row) => {
        const monthly: Record<string, ShiftCell> = {};
        Object.entries(row.monthly ?? {}).forEach(([day, value]) => {
          monthly[day] = normalizeCell(value);
        });
        return { ...row, monthly };
      });
      setSchedules(migrated);
    } else {
      setSchedules(createInitialSchedules(year, month));
    }
  }, [storageKey, year, month]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(schedules));
  }, [storageKey, schedules]);

  useEffect(() => {
    const savedChecks = localStorage.getItem("bizflow-hr-schedule-checks");
    const savedMax = localStorage.getItem("bizflow-hr-max-monthly-hours");
    const savedMinRest = localStorage.getItem("bizflow-hr-min-rest-days");

    if (savedChecks) setSelectedChecks(JSON.parse(savedChecks));
    if (savedMax) setMaxMonthlyHours(Number(savedMax));
    if (savedMinRest) setMinRestDays(Number(savedMinRest));
  }, []);

  useEffect(() => localStorage.setItem("bizflow-hr-schedule-checks", JSON.stringify(selectedChecks)), [selectedChecks]);
  useEffect(() => localStorage.setItem("bizflow-hr-max-monthly-hours", String(maxMonthlyHours)), [maxMonthlyHours]);
  useEffect(() => localStorage.setItem("bizflow-hr-min-rest-days", String(minRestDays)), [minRestDays]);

  const totalDays = daysInMonth(year, month);
  const monthDays = Array.from({ length: totalDays }, (_, index) => index + 1);

  const summary = useMemo(() => {
    const employeeStats = schedules.map((row) => {
      const hours = monthDays.reduce((sum, day) => {
        const cell = normalizeCell(row.monthly[String(day)]);
        return sum + calcHours(cell.start, cell.end);
      }, 0);

      const rests = monthDays.filter((day) => normalizeCell(schedules.find((r) => r.id === row.id)?.monthly[String(day)]).shift === "休").length;
      const violation = hours > maxMonthlyHours || rests < minRestDays;

      return { id: row.id, hours, rests, violation };
    });

    return {
      employees: schedules.length,
      totalHours: employeeStats.reduce((sum, item) => sum + item.hours, 0),
      totalRests: employeeStats.reduce((sum, item) => sum + item.rests, 0),
      violations: employeeStats.filter((item) => item.violation).length,
      employeeStats
    };
  }, [schedules, monthDays, maxMonthlyHours, minRestDays]);

  function openCell(rowId: string, day: number) {
    const row = schedules.find((item) => item.id === rowId);
    if (!row) return;

    setEditingCell({
      rowId,
      day,
      employeeName: row.name,
      value: normalizeCell(row.monthly[String(day)])
    });
  }

  function saveCell() {
    if (!editingCell) return;

    setSchedules((prev) =>
      prev.map((row) => {
        if (row.id !== editingCell.rowId) return row;

        return {
          ...row,
          monthly: {
            ...row.monthly,
            [String(editingCell.day)]: editingCell.value
          }
        };
      })
    );

    setEditingCell(null);
  }

  function applyPresetToEditingCell(shift: string) {
    const preset = getPreset(shift);
    setEditingCell((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        value: {
          shift: preset.key,
          start: preset.start,
          end: preset.end
        }
      };
    });
  }

  function applySameShiftToEmployeeMonth() {
    if (!editingCell) return;
    if (!confirm(`確定要把 ${editingCell.employeeName} 整個 ${month} 月都套用這個班別與時間嗎？`)) return;

    const nextMonthly: Record<string, ShiftCell> = {};
    monthDays.forEach((day) => {
      nextMonthly[String(day)] = editingCell.value;
    });

    setSchedules((prev) =>
      prev.map((row) => row.id === editingCell.rowId ? { ...row, monthly: nextMonthly } : row)
    );

    setEditingCell(null);
  }

  function updateName(rowId: string, name: string) {
    setSchedules((prev) => prev.map((row) => row.id === rowId ? { ...row, name } : row));
  }

  function updateRole(rowId: string, role: string) {
    setSchedules((prev) => prev.map((row) => row.id === rowId ? { ...row, role } : row));
  }

  function addEmployee() {
    const index = schedules.length;
    setSchedules([
      ...schedules,
      {
        id: crypto.randomUUID(),
        name: "新增人員",
        role: "PT",
        monthly: makeDefaultMonthly(year, month, index)
      }
    ]);
  }

  function resetSchedule() {
    if (!confirm(`${year} 年 ${month} 月排班會恢復預設，確定嗎？`)) return;
    setSchedules(createInitialSchedules(year, month));
  }

  function toggleCheck(item: string) {
    setSelectedChecks((prev) => prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]);
  }

  function exportSchedule() {
    alert(`Demo：已產生 ${year} 年 ${month} 月排班表。\n正式版會匯出 Excel / PDF，並可寫入 PostgreSQL。`);
  }

  const years = Array.from({ length: 7 }, (_, index) => today.getFullYear() - 2 + index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <AppLayout title="智慧排班">
      <PageHeader
        title="智慧排班"
        description="支援不同人員、不同日期、不同上下班時間；每格都能單獨編輯班別與時間。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={resetSchedule}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              重設本月
            </button>
            <button className="btn-secondary" onClick={exportSchedule}>
              <Download className="mr-2 h-4 w-4" />
              匯出月排班
            </button>
            <button className="btn-primary" onClick={addEmployee}>
              <Plus className="mr-2 h-4 w-4" />
              新增人員
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="排班人數" value={`${summary.employees} 人`} />
        <Stat label="本月總工時" value={`${summary.totalHours} 小時`} />
        <Stat label="本月休假" value={`${summary.totalRests} 格`} />
        <Stat label="違規提醒" value={`${summary.violations} 筆`} danger={summary.violations > 0} />
      </div>

      <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="font-bold">年月篩選</h3>
            <p className="mt-1 text-sm text-slate-500">選擇年份與月份後，下方會顯示該月份完整排班。</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select className="input w-40" value={year} onChange={(event) => setYear(Number(event.target.value))}>
              {years.map((item) => <option key={item} value={item}>{item} 年</option>)}
            </select>

            <select className="input w-32" value={month} onChange={(event) => setMonth(Number(event.target.value))}>
              {months.map((item) => <option key={item} value={item}>{item} 月</option>)}
            </select>

            <button className="btn-secondary" onClick={() => {
              setYear(today.getFullYear());
              setMonth(today.getMonth() + 1);
            }}>
              回到本月
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[1fr_340px]">
        <div className="card overflow-x-auto">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold">{year} 年 {month} 月排班表</h3>
              <p className="mt-1 text-sm text-slate-500">
                每格顯示「班別＋時間」。點擊格子可編輯該員工當天上下班時間。
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {shiftPresets.map((shift) => (
                <span key={shift.key} className={`rounded-lg border px-3 py-1 text-xs font-medium ${shift.className}`}>
                  {shift.label} {shift.start && `${shift.start}-${shift.end}`}
                </span>
              ))}
            </div>
          </div>

          <table className="w-full min-w-[1900px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 w-52 rounded-tl-2xl border border-slate-200 bg-slate-50 p-3 text-left text-slate-500">
                  員工
                </th>
                {monthDays.map((day) => {
                  const weekday = getWeekday(year, month, day);
                  const isWeekend = weekday === "日" || weekday === "六";
                  return (
                    <th
                      key={day}
                      className={`w-20 border-y border-r border-slate-200 p-2 text-center text-xs ${isWeekend ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-500"}`}
                    >
                      <div>{day}</div>
                      <div>{weekday}</div>
                    </th>
                  );
                })}
                <th className="sticky right-0 z-20 rounded-tr-2xl border-y border-r border-slate-200 bg-slate-50 p-3 text-center text-slate-500">
                  月統計
                </th>
              </tr>
            </thead>

            <tbody>
              {schedules.map((row) => {
                const employeeStat = summary.employeeStats.find((item) => item.id === row.id);
                const hours = employeeStat?.hours ?? 0;
                const rests = employeeStat?.rests ?? 0;
                const violation = employeeStat?.violation ?? false;

                return (
                  <tr key={row.id}>
                    <td className="sticky left-0 z-10 border-b border-l border-r border-slate-200 bg-white p-3">
                      <input
                        className="w-full rounded-lg border border-transparent bg-transparent font-medium outline-none focus:border-brand-200 focus:bg-brand-50 focus:px-2"
                        value={row.name}
                        onChange={(event) => updateName(row.id, event.target.value)}
                      />
                      <input
                        className="mt-1 w-full rounded-lg border border-transparent bg-transparent text-xs text-slate-400 outline-none focus:border-brand-200 focus:bg-brand-50 focus:px-2"
                        value={row.role}
                        onChange={(event) => updateRole(row.id, event.target.value)}
                      />
                    </td>

                    {monthDays.map((day) => {
                      const cell = normalizeCell(row.monthly[String(day)]);
                      const preset = getPreset(cell.shift);
                      const cellHours = calcHours(cell.start, cell.end);

                      return (
                        <td key={`${row.id}-${day}`} className="border-b border-r border-slate-200 p-1 text-center">
                          <button
                            className={`min-h-[54px] w-[70px] rounded-lg border px-1 text-xs font-bold transition hover:scale-105 ${preset.className}`}
                            onClick={() => openCell(row.id, day)}
                            title={`${row.name}｜${month}月${day}日｜${preset.label}｜${cell.start || "休"}-${cell.end || "休"}`}
                          >
                            <div>{cell.shift}</div>
                            {cell.shift === "休" ? (
                              <div className="mt-1 text-[10px] font-medium opacity-70">休假</div>
                            ) : (
                              <>
                                <div className="mt-1 text-[10px] font-medium leading-tight">{cell.start}</div>
                                <div className="text-[10px] font-medium leading-tight">{cell.end}</div>
                                <div className="mt-0.5 text-[10px] opacity-70">{cellHours}h</div>
                              </>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    <td className="sticky right-0 z-10 border-b border-r border-slate-200 bg-white p-3 text-center">
                      <div className={`rounded-2xl px-3 py-2 text-xs ${violation ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                        <div className="font-bold">{hours} 小時</div>
                        <div>{rests} 天休</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {summary.violations > 0 && (
            <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white">
              <AlertTriangle className="h-4 w-4" />
              有員工超過 {maxMonthlyHours} 小時或休假少於 {minRestDays} 天
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="card">
            <h3 className="font-bold text-brand-700">檢核設定</h3>
            <p className="mt-1 text-sm text-slate-500">設定排班法規與內部規則檢查。</p>

            <div className="mt-4 space-y-2">
              {checkItems.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleCheck(item)}
                  className={`flex w-full items-center gap-2 rounded-xl p-3 text-left text-sm transition ${selectedChecks.includes(item) ? "bg-brand-50 text-brand-700" : "bg-slate-50 text-slate-500"}`}
                >
                  {selectedChecks.includes(item) ? <CheckCircle2 className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold">工時與休假規則</h3>

            <label className="mt-4 block text-sm font-medium">單月最高工時</label>
            <input className="input mt-1" type="number" value={maxMonthlyHours} onChange={(event) => setMaxMonthlyHours(Number(event.target.value))} />

            <label className="mt-4 block text-sm font-medium">單月最低休假天數</label>
            <input className="input mt-1" type="number" value={minRestDays} onChange={(event) => setMinRestDays(Number(event.target.value))} />

            <p className="mt-3 text-sm leading-6 text-slate-500">
              系統會用每格的實際上下班時間計算工時，跨日班也會計算，例如 15:00 到 00:00。
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold">不同時間怎麼顯示</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                "每一格會顯示班別、上班時間、下班時間、當日工時",
                "點擊格子可以單獨修改該員工當天時間",
                "同樣是早班，也可以有人 09:00-18:00、有人 10:00-19:00",
                "選自訂班可輸入任意時間",
                "月統計會依照實際時間自動計算"
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editingCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  編輯班別時間
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {editingCell.employeeName}｜{year} 年 {month} 月 {editingCell.day} 日
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setEditingCell(null)}>
                關閉
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {shiftPresets.map((preset) => (
                <button
                  key={preset.key}
                  className={`rounded-2xl border p-3 text-left text-sm ${preset.className}`}
                  onClick={() => applyPresetToEditingCell(preset.key)}
                >
                  <div className="font-bold">{preset.label}</div>
                  <div className="mt-1 text-xs opacity-80">
                    {preset.start ? `${preset.start}-${preset.end}` : "休假"}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">班別</label>
                <input
                  className="input"
                  value={editingCell.value.shift}
                  onChange={(event) =>
                    setEditingCell({ ...editingCell, value: { ...editingCell.value, shift: event.target.value } })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">上班時間</label>
                <input
                  className="input"
                  type="time"
                  value={editingCell.value.start}
                  onChange={(event) =>
                    setEditingCell({ ...editingCell, value: { ...editingCell.value, start: event.target.value } })
                  }
                  disabled={editingCell.value.shift === "休"}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">下班時間</label>
                <input
                  className="input"
                  type="time"
                  value={editingCell.value.end}
                  onChange={(event) =>
                    setEditingCell({ ...editingCell, value: { ...editingCell.value, end: event.target.value } })
                  }
                  disabled={editingCell.value.shift === "休"}
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
              當日工時：
              <span className="ml-2 font-bold">
                {calcHours(editingCell.value.start, editingCell.value.end)} 小時
              </span>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button className="btn-secondary" onClick={applySameShiftToEmployeeMonth}>
                套用到此員工整月
              </button>
              <button className="btn-secondary" onClick={() => setEditingCell(null)}>
                取消
              </button>
              <button className="btn-primary" onClick={saveCell}>
                <Edit3 className="mr-2 h-4 w-4" />
                儲存此格
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function Stat({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="card">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${danger ? "bg-red-50 text-red-700" : "bg-brand-50 text-brand-700"}`}>
        <CalendarDays className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
