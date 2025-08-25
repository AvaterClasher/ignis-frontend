'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Globe,
  Loader2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  createWebhook,
  deleteWebhook,
  getWebhooks,
  updateWebhook,
  WEBHOOK_EVENT_TYPES,
  type Webhook,
  type WebhookCreateRequest,
  type WebhookEventType,
} from '@/services/webhookService';

export default function WebhooksPage() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteConfirmingId, setDeleteConfirmingId] = useState<number | null>(
    null
  );
  const [newWebhook, setNewWebhook] = useState<WebhookCreateRequest>({
    url: '',
    events: [],
  });

  // Fetch webhooks
  const {
    data: webhooksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      return getWebhooks(token);
    },
  });

  const webhooks = webhooksData || [];

  // Reset delete confirmation after 3 seconds
  useEffect(() => {
    if (deleteConfirmingId) {
      const timer = setTimeout(() => {
        setDeleteConfirmingId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteConfirmingId]);

  // Create webhook mutation
  const createMutation = useMutation({
    mutationFn: async (data: WebhookCreateRequest) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      return createWebhook(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setIsCreateDialogOpen(false);
      setNewWebhook({ url: '', events: [] });
    },
  });

  // Update webhook mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: number;
      is_active: boolean;
    }) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      return updateWebhook(id, { is_active }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  // Delete webhook mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      return deleteWebhook(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      setDeleteConfirmingId(null);
    },
  });

  const handleCreateWebhook = () => {
    createMutation.mutate(newWebhook);
  };

  const handleToggleActive = (webhook: Webhook) => {
    updateMutation.mutate({ id: webhook.id, is_active: !webhook.is_active });
  };

  const handleDeleteWebhook = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleDeleteClick = (id: number, event?: React.MouseEvent) => {
    if (deleteConfirmingId === id) {
      handleDeleteWebhook(id);
    } else {
      // Prevent dropdown from closing on first click
      event?.preventDefault();
      event?.stopPropagation();
      setDeleteConfirmingId(id);
    }
  };

  const handleEventToggle = (event: WebhookEventType) => {
    const currentEvents = newWebhook.events;
    const updatedEvents = currentEvents.includes(event)
      ? currentEvents.filter((e) => e !== event)
      : [...currentEvents, event];

    setNewWebhook({ ...newWebhook, events: updatedEvents });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load webhooks
          </p>
          <Button
            className="mt-2"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['webhooks'] })
            }
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Webhooks</h1>
          <p className="text-muted-foreground">
            Configure webhook endpoints to receive real-time notifications
          </p>
        </div>
        <Dialog onOpenChange={setIsCreateDialogOpen} open={isCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Create a webhook to receive real-time notifications about job
                events.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="url">Webhook URL</Label>
                <Input
                  id="url"
                  onChange={(e) =>
                    setNewWebhook({ ...newWebhook, url: e.target.value })
                  }
                  placeholder="https://your-domain.com/webhook"
                  type="url"
                  value={newWebhook.url}
                />
              </div>

              <div className="space-y-3">
                <Label>Events to Subscribe</Label>
                <div className="mt-2 grid grid-cols-2">
                  {WEBHOOK_EVENT_TYPES.map((eventType) => (
                    <div
                      className="flex items-center space-x-2"
                      key={eventType}
                    >
                      <input
                        checked={newWebhook.events.includes(eventType)}
                        className="rounded"
                        id={eventType}
                        onChange={() => handleEventToggle(eventType)}
                        type="checkbox"
                      />
                      <Label className="text-sm" htmlFor={eventType}>
                        {eventType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsCreateDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !newWebhook.url.trim() ||
                  newWebhook.events.length === 0 ||
                  createMutation.isPending
                }
                onClick={handleCreateWebhook}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Webhooks List */}
      <div className="flex-1">
        {webhooks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Zap className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-lg">No Webhooks</h3>
              <p className="text-muted-foreground text-sm">
                Create your first webhook to receive real-time notifications
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="max-w-[300px] truncate">
                          {webhook.url}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <Badge
                            className="text-xs"
                            key={event}
                            variant="secondary"
                          >
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={webhook.is_active ? 'default' : 'secondary'}
                      >
                        {webhook.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">
                        {new Date(webhook.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={updateMutation.isPending}
                            onClick={() => handleToggleActive(webhook)}
                          >
                            {webhook.is_active ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            disabled={deleteMutation.isPending}
                            onClick={(e) => handleDeleteClick(webhook.id, e)}
                            onSelect={(e) => {
                              if (deleteConfirmingId !== webhook.id) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deleteConfirmingId === webhook.id
                              ? 'Really?'
                              : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
