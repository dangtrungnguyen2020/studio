// src/app/[locale]/products/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, Product } from '@/app/actions';
import { Loader2, ArrowLeft, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { useLocale, useTranslations } from 'next-intl';
import AppHeader from '@/components/keystroke-symphony/app-header';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('ProductPage');
  const locale = useLocale();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProduct(id)
        .then(setProduct)
        .finally(() => setLoading(false));
    }
  }, [id, locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl mb-4">{t('notFound')}</p>
        <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToProducts')}
        </Button>
      </div>
    );
  }
  
  const currentLocale = locale as keyof typeof product.name;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
        <AppHeader page="view-product" />
        <main className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex-1">
             <Button variant="outline" onClick={() => router.push('/products')} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToProducts')}
            </Button>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                     <img src={product.imageUrl} alt={product.name[currentLocale]} className="w-full rounded-lg shadow-lg aspect-video object-cover" data-ai-hint="keyboard product detail"/>
                </div>
                <div className="space-y-4">
                    <Badge variant="secondary">{product.brand} / {product.generation}</Badge>
                    <h1 className="text-4xl font-bold text-primary">{product.name[currentLocale]}</h1>
                    <Badge variant="outline">{product.layout}</Badge>
                    <p className="text-muted-foreground text-lg">{product.description[currentLocale]}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-12">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('features')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                           {product.features[currentLocale]?.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('specs')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {Object.entries(product.specs[currentLocale] || {}).map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-semibold">{key}</TableCell>
                                        <TableCell>{value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="mt-12">
                <CardHeader>
                    <CardTitle>{t('reviews')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{t('noReviews')}</p>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}

