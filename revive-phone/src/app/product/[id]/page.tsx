import { createClient } from "@/lib/supabase";
import { ProductDetail } from "@/components/product-details";
import { RelatedProducts } from "@/components/related-products";

// Обновляем тип: params теперь Promise
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Добавляем await перед доступом к id
  const { id } = await params;
  
  const supabase = createClient();
  
  // Запрос товара с использованием полученного ID
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    return <div>Товар не знайдено</div>;
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <ProductDetail product={product} />
      <RelatedProducts />
    </main>
  );
}