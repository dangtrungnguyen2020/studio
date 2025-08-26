// src/app/[locale]/articles/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { getArticles, Article } from '@/app/actions/article';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from '@/navigation';
import AppHeader from '@/components/keystroke-symphony/app-header';
import { useLocale, useTranslations } from 'next-intl';
import AdBanner from '@/components/keystroke-symphony/ad-banner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { languageNames } from '@/lib/language-names';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const t = useTranslations('ArticlePage');
  const locale = useLocale();

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <AppHeader page="articles" />
      <main className="w-full mx-auto flex flex-row gap-8 justify-between flex-1 pb-4" style={{ minHeight: "1px" }}>
        <AdBanner className="w-64 min-w-1 max-w-2xs overflow-hidden" />
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">{t('browseArticles')}</h1>
                {user && (
                <Button onClick={() => router.push('/articles/new')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('createArticle')}
                </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <Link href={`/articles/${article.id}`} key={article.id} className="block">
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <img src={article.imageUrl} alt={article.title[locale] || article.title.en} className="w-full h-40 object-cover" data-ai-hint="article cover" />
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="line-clamp-2">{article.title[locale] || article.title.en}</CardTitle>
                                <Badge variant="outline">{languageNames[article.originalLanguage as keyof typeof languageNames] || article.originalLanguage}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           {/* Potentially a short description here */}
                        </CardContent>
                         <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={article.authorPhotoURL} />
                                <AvatarFallback>{getInitials(article.authorName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span>{article.authorName}</span>
                                <time dateTime={new Date(article.createdAt).toISOString()}>
                                    {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                                </time>
                            </div>
                        </CardFooter>
                    </Card>
                    </Link>
                ))}
            </div>
             {articles.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>{t('noArticles')}</p>
                </div>
            )}
        </div>
        <AdBanner className="w-64 min-w-1 max-w-2xs overflow-hidden" />
      </main>
    </div>
  );
}
