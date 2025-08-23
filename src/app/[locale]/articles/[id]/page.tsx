
// src/app/[locale]/articles/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getArticle, Article } from '@/app/actions';
import { Loader2, ArrowLeft, Share2, Copy, Languages } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppHeader from '@/components/keystroke-symphony/app-header';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { languageNames } from '@/lib/language-names';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('ArticlePage');
  
  useEffect(() => {
    if (id) {
      getArticle(id)
        .then(setArticle)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }
  
  const handleShare = (platform: 'facebook' | 'copy') => {
    const url = window.location.href;
    if (platform === 'copy') {
        navigator.clipboard.writeText(url).then(() => {
            toast({ title: t('shareLinkCopied'), description: t('shareLinkCopiedDesc') });
        });
    } else if (platform === 'facebook') {
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl mb-4">{t('notFound')}</p>
        <Button onClick={() => router.push('/articles')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToArticles')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
        <AppHeader page="view-article" />
        <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex-1">
             <article>
                <header className="mb-8">
                     <Button variant="outline" onClick={() => router.push('/articles')} className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToArticles')}
                    </Button>
                    <div className="flex justify-between items-start">
                      <h1 className="text-4xl font-bold text-primary leading-tight mb-4">{article.title}</h1>
                      <Badge variant="outline" className="flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        {languageNames[article.language as keyof typeof languageNames] || article.language}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-muted-foreground">
                             <Avatar>
                                <AvatarImage src={article.authorPhotoURL} alt={article.authorName ?? undefined}/>
                                <AvatarFallback>{getInitials(article.authorName)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{article.authorName}</p>
                                <p className="text-sm">{format(new Date(article.createdAt), 'PPP')}</p>
                            </div>
                        </div>
                         <Card className="p-0">
                            <CardHeader className="p-2">
                                <h3 className="text-sm font-semibold flex items-center gap-2"><Share2 className="h-4 w-4"/>{t('shareTitle')}</h3>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
                                    <FaFacebook className="h-5 w-5 text-[#1877F2]" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleShare('copy')}>
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </header>

                <img src={article.imageUrl} alt={article.title} className="w-full rounded-lg mb-8" data-ai-hint="article hero image"/>
                
                <div className="prose dark:prose-invert max-w-full">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.content}
                    </ReactMarkdown>
                </div>
            </article>
        </main>
    </div>
  );
}
