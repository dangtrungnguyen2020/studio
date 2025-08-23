// src/app/[locale]/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getAdminDashboardStats, AdminDashboardStats } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AppHeader from '@/components/keystroke-symphony/app-header';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AdminDashboardPage() {
  const t = useTranslations('AdminPage');
  const [user, loadingAuth] = useAuthState(auth);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth) {
      if (!user) {
        router.push('/');
      } else {
        getAdminDashboardStats(user.uid)
          .then(setStats)
          .catch((err) => {
            console.error(err);
            router.push('/'); // Redirect if user is not an admin
          })
          .finally(() => setLoadingData(false));
      }
    }
  }, [user, loadingAuth, router]);

  if (loadingAuth || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
     return <div className="flex items-center justify-center min-h-screen">{t('statsError')}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
        <AppHeader page="admin-dashboard" />
        <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('totalTestsTitle')}</CardTitle>
                        <CardDescription>{t('totalTestsDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.totalTests.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('avgWpmTitle')}</CardTitle>
                        <CardDescription>{t('avgWpmDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.averageWpm}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('avgAccuracyTitle')}</CardTitle>
                        <CardDescription>{t('avgAccuracyDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.averageAccuracy}%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('testsOverTimeTitle')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.testsByDate}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="hsl(var(--primary))" name={t('testsTaken')} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('difficultyDistTitle')}</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                             <PieChart>
                                <Pie
                                    data={stats.testsByDifficulty}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="difficulty"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.testsByDifficulty.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
