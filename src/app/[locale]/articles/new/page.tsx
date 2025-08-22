
// src/app/[locale]/articles/new/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { uploadImage, createArticle } from '@/app/actions';
import { useRouter } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import AppHeader from '@/components/keystroke-symphony/app-header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  image: z.instanceof(File).refine(file => file.size > 0, 'An image is required.'),
});

export default function NewArticlePage() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const t = useTranslations('ArticlePage');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      image: undefined,
    },
  });

  const fileRef = form.register('image');

  if (loadingAuth) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!user) {
    router.push('/articles');
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', values.image);
      const imageUrl = await uploadImage(formData);

      const articleData = {
        title: values.title,
        content: values.content,
        imageUrl,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhotoURL: user.photoURL || '',
      };

      const articleId = await createArticle(articleData);
      toast({ title: t('createSuccessTitle'), description: t('createSuccessDesc') });
      router.push(`/articles/${articleId}`);

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: t('createErrorTitle'), description: String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
        <AppHeader page="new-article" />
        <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 flex-1">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{t('newArticleTitle')}</CardTitle>
                    <CardDescription>{t('newArticleDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('formTitle')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('formTitlePlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('formImage')}</FormLabel>
                                        <FormControl>
                                             <Input type="file" accept="image/*" {...fileRef} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('formContent')}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={t('formContentPlaceholder')}
                                                    className="min-h-[400px] font-mono"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setContent(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <div>
                                    <FormLabel>{t('formPreview')}</FormLabel>
                                    <Card className="min-h-[400px] mt-2">
                                        <CardContent className="p-4 prose dark:prose-invert max-w-full">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                        </CardContent>
                                    </Card>
                                 </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('formCancel')}
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    {t('formSubmit')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
