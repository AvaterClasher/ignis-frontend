'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Copy,
  Key,
  Loader2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Trash2,
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
  type APIKey,
  type APIKeyCreateRequest,
  type APIKeyCreateResponse,
  createAPIKey,
  deleteAPIKey,
  getAPIKeys,
  updateAPIKey,
} from '@/services/apiKeyService';

// Helper functions
const useAPIKeyOperations = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const fetchAPIKeys = async () => {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token');
    }
    return getAPIKeys(token);
  };

  const createAPIKeyMutation = useMutation({
    mutationFn: async (data: APIKeyCreateRequest) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      return createAPIKey(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const updateAPIKeyMutation = useMutation({
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
      return updateAPIKey(id, { is_active }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  const deleteAPIKeyMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      return deleteAPIKey(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    },
  });

  return {
    fetchAPIKeys,
    createAPIKeyMutation,
    updateAPIKeyMutation,
    deleteAPIKeyMutation,
  };
};

export default function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] =
    useState<APIKeyCreateResponse | null>(null);
  const [deleteConfirmingId, setDeleteConfirmingId] = useState<number | null>(
    null
  );

  const [newAPIKey, setNewAPIKey] = useState<APIKeyCreateRequest>({
    name: '',
  });

  const {
    fetchAPIKeys,
    createAPIKeyMutation,
    updateAPIKeyMutation,
    deleteAPIKeyMutation,
  } = useAPIKeyOperations();

  // Fetch API keys
  const {
    data: apiKeysData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['api-keys'],
    queryFn: fetchAPIKeys,
  });

  const apiKeys = apiKeysData || [];

  // Reset delete confirmation after 3 seconds
  useEffect(() => {
    if (deleteConfirmingId) {
      const timer = setTimeout(() => {
        setDeleteConfirmingId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteConfirmingId]);

  const handleCreateAPIKey = () => {
    createAPIKeyMutation.mutate(newAPIKey, {
      onSuccess: (data: APIKeyCreateResponse) => {
        setIsCreateDialogOpen(false);
        setNewAPIKey({ name: '' });
        setNewlyCreatedKey(data);
        setIsKeyDialogOpen(true);
      },
    });
  };

  const handleToggleActive = (apiKey: APIKey) => {
    updateAPIKeyMutation.mutate({
      id: apiKey.id,
      is_active: !apiKey.is_active,
    });
  };

  const handleDeleteAPIKey = (id: number) => {
    deleteAPIKeyMutation.mutate(id, {
      onSuccess: () => {
        setDeleteConfirmingId(null);
      },
    });
  };

  const handleDeleteClick = (id: number, event?: React.MouseEvent) => {
    if (deleteConfirmingId === id) {
      handleDeleteAPIKey(id);
    } else {
      // Prevent dropdown from closing on first click
      event?.preventDefault();
      event?.stopPropagation();
      setDeleteConfirmingId(id);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
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
            Failed to load API keys
          </p>
          <Button
            className="mt-2"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['api-keys'] })
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
          <h1 className="font-semibold text-2xl">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Dialog onOpenChange={setIsCreateDialogOpen} open={isCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key for programmatic access to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  onChange={(e) =>
                    setNewAPIKey({ ...newAPIKey, name: e.target.value })
                  }
                  placeholder="My API Key"
                  value={newAPIKey.name}
                />
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
                  !newAPIKey.name.trim() || createAPIKeyMutation.isPending
                }
                onClick={handleCreateAPIKey}
              >
                {createAPIKeyMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create API Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="flex-1">
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Key className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold text-lg">No API Keys</h3>
              <p className="text-muted-foreground text-sm">
                Create your first API key to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        {apiKey.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="rounded px-2 py-1 font-mono text-sm">
                          {apiKey.key_prefix}...
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{apiKey.rate_limit}/min</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={apiKey.is_active ? 'default' : 'secondary'}
                      >
                        {apiKey.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">
                        {new Date(apiKey.created_at).toLocaleDateString()}
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
                            disabled={updateAPIKeyMutation.isPending}
                            onClick={() => handleToggleActive(apiKey)}
                          >
                            {apiKey.is_active ? (
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
                            disabled={deleteAPIKeyMutation.isPending}
                            onClick={(e) => handleDeleteClick(apiKey.id, e)}
                            onSelect={(e) => {
                              if (deleteConfirmingId !== apiKey.id) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deleteConfirmingId === apiKey.id
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

      {/* API Key Display Dialog */}
      <Dialog onOpenChange={setIsKeyDialogOpen} open={isKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Created Successfully</DialogTitle>
            <DialogDescription>
              Your API key has been created.{' '}
              <strong>Copy it now as you won't be able to see it again.</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API Key Name</Label>
              <div className="rounded bg-muted p-3">
                <p className="font-medium">{newlyCreatedKey?.name}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex items-center gap-2 rounded bg-muted p-3">
                <code className="flex-1 break-all font-mono text-sm">
                  {newlyCreatedKey?.raw_key}
                </code>
                <Button
                  onClick={() =>
                    copyToClipboard(newlyCreatedKey?.raw_key || '')
                  }
                  size="sm"
                  title="Copy API key"
                  variant="ghost"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="rounded border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Store this API key securely. You
                won't be able to see the full key again after closing this
                dialog.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsKeyDialogOpen(false);
                setNewlyCreatedKey(null);
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
