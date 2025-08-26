// src/app/profile/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getTestResults } from '@/app/actions/user';
import type { TestResult } from '@/app/actions/user';
import { getUserArticles, Article } from '@/app/actions/article';
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const chartConfig = {
  wpm: {
    label: 'WPM',
    color: 'hsl(var(--primary))',
  },
  accuracy: {
    label: 'Accuracy',
    color: 'hsl(var(--accent))',
  },
};

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');
  const [user, loadingAuth] = useAuthState(auth);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      Promise.all([
        getTestResults(user.uid),
        getUserArticles(user.uid),
      ]).then(([tests, userArticles]) => {
        setTestResults(tests);
        setArticles(userArticles);
      }).finally(() => setLoadingData(false));
    } else if (!loadingAuth) {
      router.push('/');
    }
  }, [user, loadingAuth, router]);

  const chartData = useMemo(() => {
    return testResults
      .slice()
      .reverse() // Show oldest first in chart
      .map((r) => ({
        date: format(r.timestamp, 'MMM d'),
        wpm: r.wpm,
        accuracy: r.accuracy,
      }));
  }, [testResults]);

  const summaryStats = useMemo(() => {
    if (testResults.length === 0) {
      return { avgWpm: 0, avgAcc: 0, testsTaken: 0 };
    }
    const totalWpm = testResults.reduce((acc, r) => acc + r.wpm, 0);
    const totalAcc = testResults.reduce((acc, r) => acc + r.accuracy, 0);
    return {
      avgWpm: Math.round(totalWpm / testResults.length),
      avgAcc: Math.round(totalAcc / testResults.length),
      testsTaken: testResults.length,
    };
  }, [testResults]);

  const getStatusIcon = (status: Article['status']) => {
    switch (status) {
        case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
        case 'pending':
        default:
             return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  }
  
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
            {testResults.length > 1 ? (
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
            <CardTitle>{t('myArticlesTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('articleTitle')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('articleStatus')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                        <Link href={`/articles/${article.id}`} className="hover:underline text-primary">
                            {article.title[article.originalLanguage]}
                        </Link>
                    </TableCell>
                    <TableCell>{format(article.createdAt, 'PP')}</TableCell>
                    <TableCell>
                        <Tooltip>
                             <TooltipTrigger>
                                <Badge variant={
                                    article.status === 'approved' ? 'default' : 
                                    article.status === 'rejected' ? 'destructive' : 'secondary'
                                } className="capitalize flex items-center gap-1">
                                    {getStatusIcon(article.status)}
                                    {article.status}
                                </Badge>
                            </TooltipTrigger>
                             {article.status === 'rejected' && article.rejectionReason && (
                                <TooltipContent className="max-w-xs">
                                    <p className="font-bold mb-1">{t('rejectionReason')}</p>
                                    <p>{article.rejectionReason}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                 {articles.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">
                           {t('noArticles')}
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
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
                {testResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{format(result.timestamp, 'PPpp')}</TableCell>
                    <TableCell>{result.wpm}</TableCell>
                    <TableCell>{result.accuracy}%</TableCell>
                    <TableCell className="capitalize">{result.difficulty}</TableCell>
                  </TableRow>
                ))}
                 {testResults.length === 0 && (
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
