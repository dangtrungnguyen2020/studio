
// src/app/profile/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getTestResults, TestResult } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';

const chartConfig = {
  wpm: {
    label: 'WPM',
    color: 'hsl(var(--primary))',
  },
  accuracy: {
    label: 'Accuracy',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');
  const [user, loadingAuth] = useAuthState(auth);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getTestResults(user.uid)
        .then(setResults)
        .finally(() => setLoadingData(false));
    } else if (!loadingAuth) {
      // Redirect to home if not logged in after auth state is resolved
      router.push('/');
    }
  }, [user, loadingAuth, router]);

  const chartData = useMemo(() => {
    return results
      .slice()
      .reverse() // Show oldest first in chart
      .map((r) => ({
        date: format(r.timestamp, 'MMM d'),
        wpm: r.wpm,
        accuracy: r.accuracy,
      }));
  }, [results]);

  const summaryStats = useMemo(() => {
    if (results.length === 0) {
      return { avgWpm: 0, avgAcc: 0, testsTaken: 0 };
    }
    const totalWpm = results.reduce((acc, r) => acc + r.wpm, 0);
    const totalAcc = results.reduce((acc, r) => acc + r.accuracy, 0);
    return {
      avgWpm: Math.round(totalWpm / results.length),
      avgAcc: Math.round(totalAcc / results.length),
      testsTaken: results.length,
    };
  }, [results]);
  
  if (loadingAuth || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">{t('title')}</h1>
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('goBack')}
            </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('summaryTitle')}</CardTitle>
            <CardDescription>{t('summaryDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">{t('averageWpm')}</p>
              <p className="text-3xl font-bold">{summaryStats.avgWpm}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">{t('averageAccuracy')}</p>
              <p className="text-3xl font-bold">{summaryStats.avgAcc}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">{t('testsTaken')}</p>
              <p className="text-3xl font-bold">{summaryStats.testsTaken}</p>
            </Card>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('progressChartTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 1 ? (
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis yAxisId="left" stroke="hsl(var(--primary))" />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="wpm" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                        <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="hsl(var(--accent))" strokeWidth={2} dot={true} />
                    </LineChart>
                </ChartContainer>
            ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                    {t('notEnoughData')}
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('historyTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('wpm')}</TableHead>
                  <TableHead>{t('accuracy')}</TableHead>
                  <TableHead>{t('difficulty')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{format(result.timestamp, 'PPpp')}</TableCell>
                    <TableCell>{result.wpm}</TableCell>
                    <TableCell>{result.accuracy}%</TableCell>
                    <TableCell className="capitalize">{result.difficulty}</TableCell>
                  </TableRow>
                ))}
                 {results.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                           {t('noHistory')}
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
