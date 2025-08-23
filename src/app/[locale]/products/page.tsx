
// src/app/[locale]/products/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { getProducts, Product } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import AppHeader from '@/components/keystroke-symphony/app-header';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const t = useTranslations('ProductPage');
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedGens, setSelectedGens] = useState<Set<string>>(new Set());
  const [selectedLayouts, setSelectedLayouts] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const { availableBrands, availableGens, availableLayouts } = useMemo(() => {
    const brands = new Set<string>();
    const gens = new Set<string>();
    const layouts = new Set<string>();
    products.forEach(p => {
      brands.add(p.brand);
      gens.add(p.generation);
      layouts.add(p.layout);
    });
    return {
      availableBrands: Array.from(brands).sort(),
      availableGens: Array.from(gens).sort(),
      availableLayouts: Array.from(layouts).sort(),
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const brandMatch = selectedBrands.size === 0 || selectedBrands.has(p.brand);
      const genMatch = selectedGens.size === 0 || selectedGens.has(p.generation);
      const layoutMatch = selectedLayouts.size === 0 || selectedLayouts.has(p.layout);
      return brandMatch && genMatch && layoutMatch;
    });
  }, [products, selectedBrands, selectedGens, selectedLayouts]);

  const toggleFilter = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    setter(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <AppHeader page="products" />
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">{t('browseProducts')}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                {t('filter')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{t('filterByBrand')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableBrands.map(brand => (
                <DropdownMenuCheckboxItem
                  key={brand}
                  checked={selectedBrands.has(brand)}
                  onCheckedChange={() => toggleFilter(setSelectedBrands, brand)}
                >
                  {brand}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
               <DropdownMenuLabel>{t('filterByGen')}</DropdownMenuLabel>
               <DropdownMenuSeparator />
              {availableGens.map(gen => (
                <DropdownMenuCheckboxItem
                  key={gen}
                  checked={selectedGens.has(gen)}
                  onCheckedChange={() => toggleFilter(setSelectedGens, gen)}
                >
                  {gen}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
               <DropdownMenuLabel>{t('filterByLayout')}</DropdownMenuLabel>
               <DropdownMenuSeparator />
              {availableLayouts.map(layout => (
                <DropdownMenuCheckboxItem
                  key={layout}
                  checked={selectedLayouts.has(layout)}
                  onCheckedChange={() => toggleFilter(setSelectedLayouts, layout)}
                >
                  {layout}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="block">
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video overflow-hidden">
                    <img src={product.imageUrl} alt={product.name[locale] || product.name.en} className="w-full h-full object-cover" data-ai-hint="keyboard product image" />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{product.name[locale] || product.name.en}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Additional short info can go here */}
                </CardContent>
                <CardFooter>
                  <Badge variant="outline">{product.layout}</Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>{t('noProducts')}</p>
          </div>
        )}
      </main>
    </div>
  );
}
