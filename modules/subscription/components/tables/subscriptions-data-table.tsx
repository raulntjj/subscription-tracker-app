'use client';

import { useState } from 'react';

import { useTranslation } from '@/modules/shared/hooks/use-translation';
import type { PaginationParams } from '@/modules/shared/types/api-types';
import { SubscriptionDialog } from '@/modules/subscription/components/dialogs/subscription-dialog';
import { useDeleteSubscription } from '@/modules/subscription/hooks/use-commands';
import { useSubscriptions } from '@/modules/subscription/hooks/use-queries';
import type { Subscription } from '@/modules/subscription/types/subscription-types';
import { format } from 'date-fns';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  paused: 'secondary',
  cancelled: 'destructive',
};

export function SubscriptionsDataTable() {
  const { t } = useTranslation();

  const statusLabels: Record<string, string> = {
    active: t('active'),
    paused: t('paused'),
    cancelled: t('cancelled'),
  };

  const cycleLabels: Record<string, string> = {
    monthly: t('monthly'),
    yearly: t('yearly'),
  };

  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    per_page: 10,
    sort_by: 'name',
    sort_direction: 'asc',
  });

  const { data, isLoading, isError } = useSubscriptions(params);
  const deleteMutation = useDeleteSubscription();

  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const [editTarget, setEditTarget] = useState<Subscription | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const toggleSort = (column: string) => {
    setParams((prev) => ({
      ...prev,
      sort_by: column,
      sort_direction: prev.sort_by === column && prev.sort_direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  const handleEdit = (subscription: Subscription) => {
    setEditTarget(subscription);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('thName')}</TableHead>
              <TableHead>{t('thPrice')}</TableHead>
              <TableHead>{t('thCycle')}</TableHead>
              <TableHead>{t('thStatus')}</TableHead>
              <TableHead>{t('thNextBilling')}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="size-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">{t('failedToLoadSubscriptions')}</p>
      </div>
    );
  }

  const subscriptions = data?.subscriptions ?? [];
  const totalPages = data?.last_page ?? 1;
  const currentPage = data?.current_page ?? 1;
  const total = data?.total ?? 0;

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => toggleSort('name')}
                >
                  {t('thName')}
                  <ArrowUpDown className="ml-1 size-3.5" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => toggleSort('price')}
                >
                  {t('thPrice')}
                  <ArrowUpDown className="ml-1 size-3.5" />
                </Button>
              </TableHead>
              <TableHead>{t('thCycle')}</TableHead>
              <TableHead>{t('thStatus')}</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => toggleSort('next_billing_date')}
                >
                  {t('thNextBilling')}
                  <ArrowUpDown className="ml-1 size-3.5" />
                </Button>
              </TableHead>
              <TableHead className="w-12">
                <span className="sr-only">{t('openMenu')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <p className="text-sm text-muted-foreground">{t('noSubscriptions')}</p>
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{sub.name}</span>
                      {sub.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {sub.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">
                    {sub.price_formatted}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {cycleLabels[sub.billing_cycle] ?? sub.billing_cycle}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[sub.status] ?? 'outline'}>
                      {statusLabels[sub.status] ?? sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {sub.next_billing_date
                      ? format(new Date(sub.next_billing_date), 'MMM dd, yyyy')
                      : '--'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">{t('openMenu')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(sub)}>
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTarget(sub)}
                        >
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-4">
          <p className="text-sm text-muted-foreground">
            {t('pageOf', { current: currentPage, total: totalPages, count: total })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
            >
              {t('previous')}
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
            >
              {t('next')}
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteSubscription')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteSubscriptionConfirm')}{' '}
              <span className="font-medium text-foreground">{deleteTarget?.name}</span>
              {t('deleteSubscriptionWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? t('deleting') : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <SubscriptionDialog
        open={isEditDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsEditDialogOpen(open);
          if (!open) setEditTarget(null);
        }}
        initialData={editTarget}
      />
    </>
  );
}
