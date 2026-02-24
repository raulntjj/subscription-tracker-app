"use client";

import { useState } from "react";

import { AppHeader } from "@/modules/shared/components/layouts/app-header";
import { useTranslation } from "@/modules/shared/hooks/use-translation";
import { WebhookDialog } from "@/modules/webhook/components/dialogs/webhook-dialog";
import { WebhooksDataTable } from "@/modules/webhook/components/tables/webhooks-data-table";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WebhooksContainer() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <AppHeader title={t("pageTitle")} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Page Title & Action */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              {t("pageHeading")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("pageDescription")}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            {t("addWebhook")}
          </Button>
        </div>

        {/* Data Table */}
        <WebhooksDataTable />
      </div>

      <WebhookDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
