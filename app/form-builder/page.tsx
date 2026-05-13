import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormBuilder } from "@/components/forms/FormBuilder";

export default function FormBuilderPage() {
  return (
    <AppLayout title="表單設計器">
      <PageHeader
        title="拖曳式自訂表單引擎"
        description="支援文字、數字、日期、GPS、手寫簽名、圖片附件、關聯資料與審核流程。"
      />
      <FormBuilder />
    </AppLayout>
  );
}
