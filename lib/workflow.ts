export type WorkflowOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "empty"
  | "not_empty";

export type WorkflowCondition = {
  field: string;
  operator: WorkflowOperator;
  value?: unknown;
};

export type WorkflowAction =
  | { type: "notify"; message: string; targetRole?: string }
  | { type: "createTask"; title: string; assigneeField?: string }
  | { type: "updateStatus"; status: string }
  | { type: "assignApprover"; role: string }
  | { type: "webhook"; url: string };

export type WorkflowRule = {
  id: string;
  name: string;
  module: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
};

function compare(actual: unknown, condition: WorkflowCondition) {
  const expected = condition.value;

  switch (condition.operator) {
    case "eq":
      return actual === expected;
    case "neq":
      return actual !== expected;
    case "gt":
      return Number(actual) > Number(expected);
    case "gte":
      return Number(actual) >= Number(expected);
    case "lt":
      return Number(actual) < Number(expected);
    case "lte":
      return Number(actual) <= Number(expected);
    case "contains":
      return String(actual ?? "").includes(String(expected ?? ""));
    case "empty":
      return actual === undefined || actual === null || actual === "";
    case "not_empty":
      return actual !== undefined && actual !== null && actual !== "";
    default:
      return false;
  }
}

export function evaluateWorkflow(rule: WorkflowRule, record: Record<string, unknown>) {
  const matched = rule.conditions.every((condition) => compare(record[condition.field], condition));
  if (!matched) return [];

  return rule.actions.map((action) => {
    if (action.type === "notify") {
      return { ...action, createdAt: new Date().toISOString(), status: "pending" };
    }

    if (action.type === "createTask") {
      return {
        ...action,
        createdAt: new Date().toISOString(),
        status: "todo",
        assignee: action.assigneeField ? record[action.assigneeField] : undefined
      };
    }

    return { ...action, createdAt: new Date().toISOString() };
  });
}

export const defaultWorkflowRules: WorkflowRule[] = [
  {
    id: "expense-over-5000",
    name: "報銷超過 5,000 自動送財務審核",
    module: "finance",
    conditions: [{ field: "amount", operator: "gt", value: 5000 }],
    actions: [
      { type: "assignApprover", role: "finance" },
      { type: "updateStatus", status: "待財務審核" },
      { type: "notify", targetRole: "finance", message: "有一筆高金額報銷需要審核" }
    ]
  },
  {
    id: "low-stock",
    name: "庫存低於安全庫存通知採購",
    module: "inventory",
    conditions: [{ field: "isLowStock", operator: "eq", value: true }],
    actions: [
      { type: "createTask", title: "請建立採購單補貨" },
      { type: "notify", targetRole: "admin", message: "有商品低於安全庫存" }
    ]
  },
  {
    id: "equipment-error",
    name: "設備異常自動建立維修任務",
    module: "equipment",
    conditions: [{ field: "status", operator: "eq", value: "異常" }],
    actions: [{ type: "createTask", title: "設備異常維修任務", assigneeField: "ownerId" }]
  }
];
