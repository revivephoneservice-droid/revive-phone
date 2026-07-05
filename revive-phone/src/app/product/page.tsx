import { createClient } from "@/lib/supabase";
import { ProductDetail } from "@/components/product-details";
import { RelatedProducts } from "@/components/related-products";

// Указываем тип для пропсов страницы
export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  // Загружаем данные товара по ID из URL
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !product) {
    return <div>Товар не знайдено або сталася помилка</div>;
  }

  return (
      <main className="dark min-h-screen bg-background text-foreground">
        {/* Передаем загруженный товар в компонент */}
        <ProductDetail product={product} />
        <RelatedProducts />
      </main>
  )
}