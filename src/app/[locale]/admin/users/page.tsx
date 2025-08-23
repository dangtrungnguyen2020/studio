// src/app/[locale]/admin/users/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getUsersAndAdminStatus, setAdminStatus, UserWithAdminStatus } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/keystroke-symphony/app-header';

export default function AdminUsersPage() {
  const t = useTranslations('AdminPage');
  const [user, loadingAuth] = useAuthState(auth);
  const [users, setUsers] = useState<UserWithAdminStatus[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchUsers = () => {
    if (user) {
      getUsersAndAdminStatus(user.uid)
        .then(setUsers)
        .catch(err => {
            toast({ variant: 'destructive', title: t('usersError'), description: String(err) });
        })
        .finally(() => setLoadingData(false));
    }
  }

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/');
    } else if (user) {
      fetchUsers();
    }
  }, [user, loadingAuth, router]);

  const handleAdminToggle = async (targetUserId: string, isAdmin: boolean) => {
    if (!user) return;

    try {
        await setAdminStatus(user.uid, targetUserId, isAdmin);
        setUsers(users.map(u => u.uid === targetUserId ? { ...u, isAdmin } : u));
        toast({ title: t('statusUpdateSuccess'), description: t('statusUpdateSuccessDesc') });
    } catch (error) {
        toast({ variant: 'destructive', title: t('statusUpdateError'), description: String(error) });
        // Revert UI on failure
        setUsers(users.map(u => u.uid === targetUserId ? { ...u, isAdmin: !isAdmin } : u));
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }


  if (loadingAuth || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
        <AppHeader page="admin-users" />
        <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            <Card>
                <CardHeader>
                    <CardTitle>{t('usersTitle')}</CardTitle>
                    <CardDescription>{t('usersDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('tableUser')}</TableHead>
                                <TableHead>{t('tableEmail')}</TableHead>
                                <TableHead className="text-right">{t('tableAdmin')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.uid}>
                                    <TableCell className="flex items-center gap-2">
                                         <Avatar className="h-8 w-8">
                                            <AvatarImage src={u.photoURL ?? undefined} />
                                            <AvatarFallback>{getInitials(u.displayName)}</AvatarFallback>
                                        </Avatar>
                                        <span>{u.displayName || t('anonymous')}</span>
                                    </TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell className="text-right">
                                        <Switch
                                            checked={u.isAdmin}
                                            onCheckedChange={(checked) => handleAdminToggle(u.uid, checked)}
                                            disabled={u.uid === user?.uid}
                                         />
                                    </TableCell>
                                </TableRow>
                            ))}
                             {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">
                                    {t('noUsers')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
