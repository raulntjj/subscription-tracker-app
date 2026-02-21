'use client';

import { useState } from 'react';

import { useTranslation } from '@/modules/shared/hooks/use-translation';
import { WebhookDialog } from '@/modules/webhook/components/dialogs/webhook-dialog';
import { useDeleteWebhook, useTestWebhook } from '@/modules/webhook/hooks/use-commands';
import { useWebhooks } from '@/modules/webhook/hooks/use-queries';
import type { WebhookConfig } from '@/modules/webhook/types/webhook-types';
import { CheckCircle2, Loader2, MoreHorizontal, XCircle } from 'lucide-react';

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

export function WebhooksDataTable() {
  const { t } = useTranslation();
  const { data: weebhooksResponse, isLoading, isError } = useWebhooks();
  const deleteMutation = useDeleteWebhook();
  const testMutation = useTestWebhook();

  const [deleteTarget, setDeleteTarget] = useState<WebhookConfig | null>(null);
  const [editTarget, setEditTarget] = useState<WebhookConfig | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  const handleEdit = (webhook: WebhookConfig) => {
    setEditTarget(webhook);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('thUrl')}</TableHead>
              <TableHead>{t('thStatus')}</TableHead>
              <TableHead>{t('thCreated')}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-64" />
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
        <p className="text-sm text-muted-foreground">{t('failedToLoadWebhooks')}</p>
      </div>
    );
  }

  const webhookList = weebhooksResponse?.webhooks ?? [];

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('thUrl')}</TableHead>
              <TableHead>{t('thStatus')}</TableHead>
              <TableHead>{t('thCreated')}</TableHead>
              <TableHead className="w-12">
                <span className="sr-only">{t('openMenu')}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhookList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <p className="text-sm text-muted-foreground">{t('noWebhooks')}</p>
                </TableCell>
              </TableRow>
            ) : (
              webhookList.map((webhook: WebhookConfig) => (
                <TableRow key={webhook.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-md">{webhook.url}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {webhook.is_active ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="size-3" />
                        {t('active')}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <XCircle className="size-3" />
                        {t('inactive')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {webhook.created_at ? new Date(webhook.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric'
                    }) : ''}
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
                        <DropdownMenuItem onClick={() => handleEdit(webhook)}>
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => testMutation.mutate(webhook.id)}
                          disabled={testMutation.isPending}
                        >
                          {testMutation.isPending ? (
                            <>
                              <Loader2 className="size-3 animate-spin mr-1" />
                              {t('testing')}
                            </>
                          ) : (
                            t('test')
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteTarget(webhook)}
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

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteWebhook')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteWebhookConfirm')}</AlertDialogDescription>
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
      <WebhookDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditTarget(null);
        }}
        initialData={editTarget}
      />
    </>
  );
}
