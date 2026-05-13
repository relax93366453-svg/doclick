import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { TemplatesClient } from "@/components/templates/TemplatesClient";
export default function TemplatesPage() { return <AppLayout title="產業範本庫"><PageHeader title="產業範本庫" description="一鍵套用電商、寵物店、美容、製造、行政、外勤等管理流程。" action={<button className="btn-primary">新增範本</button>} /><TemplatesClient /></AppLayout>; }
