import { NextResponse } from "next/server";
import { evaluateWorkflow, defaultWorkflowRules } from "@/lib/workflow";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const module = body.module;
    const record = body.record ?? {};

    const actions = defaultWorkflowRules
      .filter((rule) => rule.module === module)
      .flatMap((rule) => evaluateWorkflow(rule, record));

    return NextResponse.json({ ok: true, actions });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "流程判斷失敗", error: String(error) }, { status: 500 });
  }
}
