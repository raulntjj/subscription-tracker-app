'use client';

import { useState } from 'react';

import { AppHeader } from '@/modules/shared/components/layouts/app-header';
import { useTranslation } from '@/modules/shared/hooks/use-translation';
import { SubscriptionDialog } from '@/modules/subscription/components/dialogs/subscription-dialog';
import { SubscriptionsDataTable } from '@/modules/subscription/components/tables/subscriptions-data-table';
import { BudgetCards } from '@/modules/subscription/components/ui/budget-cards';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SubscriptionsContainer() {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <AppHeader title={t('pageTitle')} />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Page Title & Action */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">{t('pageTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('pageDescription')}</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            {t('addSubscription')}
          </Button>
        </div>

        {/* Budget Summary Cards */}
        <BudgetCards />

        {/* Data Table */}
        <SubscriptionsDataTable />
      </div>

      <SubscriptionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
