import { createClient } from "@/lib/supabase";
import { RelatedProducts } from "@/components/related-products";
import { ProductDetailWrapper } from "@/components/product-detail-wrapper";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = createClient();
  
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
      {/* Теперь мы рендерим обертку, а она сама внутри себя использует "use client" */}
      <ProductDetailWrapper product={product} />
      <RelatedProducts />
    </main>
  );
}