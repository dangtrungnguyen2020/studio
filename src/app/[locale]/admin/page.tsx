// src/app/[locale]/admin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getPendingArticles, approveArticle, rejectArticle, Article } from '@/app/actions';
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
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, MessageSquare, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';
import AppHeader from '@/components/keystroke-symphony/app-header';
import Link from 'next/link';

export default function AdminPage() {
  const t = useTranslations('AdminPage');
  const [user, loadingAuth] = useAuthState(auth);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const locale = useLocale();
  
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [articleToReject, setArticleToReject] = useState<Article | null>(null);

  const fetchPending = () => {
    if (user) {
      getPendingArticles(user.uid)
        .then(setArticles)
        .catch((err) => {
          console.error(err);
          router.push('/'); // Redirect if user is not an admin
        })
        .finally(() => setLoadingData(false));
    }
  }

  useEffect(() => {
    if (!loadingAuth) {
      if (!user) {
        router.push('/');
      } else {
        fetchPending();
      }
    }
  }, [user, loadingAuth, router]);

  const handleApprove = async (articleId: string) => {
    if (!user) return;
    try {
      await approveArticle(user.uid, articleId);
      toast({ title: t('approveSuccess'), description: t('approveSuccessDesc') });
      fetchPending(); // Refresh list
    } catch (error) {
      toast({ variant: 'destructive', title: t('approveError'), description: String(error) });
    }
  };
  
  const openRejectDialog = (article: Article) => {
    setArticleToReject(article);
    setRejectionReason("");
    setIsRejecting(true);
  };
  
  const handleReject = async () => {
    if (!user || !articleToReject || !rejectionReason) return;
    try {
      await rejectArticle(user.uid, articleToReject.id, rejectionReason);
      toast({ title: t('rejectSuccess'), description: t('rejectSuccessDesc') });
      fetchPending();
    } catch (error) {
       toast({ variant: 'destructive', title: t('rejectError'), description: String(error) });
    } finally {
        setIsRejecting(false);
        setArticleToReject(null);
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
        <AppHeader page="admin" />
        <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex-1">
            <Card>
                <CardHeader>
                    <CardTitle>{t('pendingTitle')}</CardTitle>
                    <CardDescription>{t('pendingDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('tableTitle')}</TableHead>
                                <TableHead>{t('tableAuthor')}</TableHead>
                                <TableHead>{t('tableDate')}</TableHead>
                                <TableHead className="text-right">{t('tableActions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell>
                                         <Link href={`/articles/${article.id}`} className="hover:underline text-primary" target="_blank">
                                            {article.title[article.originalLanguage] || article.title.en}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{article.authorName}</TableCell>
                                    <TableCell>{format(article.createdAt, 'PP')}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="icon" variant="outline" onClick={() => handleApprove(article.id)}>
                                            <Check className="h-4 w-4 text-green-500" />
                                        </Button>
                                        <Button size="icon" variant="outline" onClick={() => openRejectDialog(article)}>
                                            <X className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {articles.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                    {t('noPending')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
        
        <AlertDialog open={isRejecting} onOpenChange={setIsRejecting}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{t('rejectModalTitle')}</AlertDialogTitle>
                <AlertDialogDescription>{t('rejectModalDesc')}</AlertDialogDescription>
                </AlertDialogHeader>
                <Textarea 
                    placeholder={t('rejectReasonPlaceholder')} 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                />
                <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleReject} disabled={!rejectionReason.trim()}>{t('rejectButton')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
