"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag, Truck, Package } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  // Функция создания ТТН для конкретного заказа
// Функция создания ТТН для конкретного заказа
async function handleCreateTTN(order: any) {
    try {
      const res = await fetch('/api/novaposhta/create-ttn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(`Помилка: ${data.error}`);
        return;
      }

      alert(`Успішно! ТТН: ${data.ttnNumber}`);

      // 📌 Сохраняем номер ТТН и обновляем статус в базе данных Supabase
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          ttn_number: data.ttnNumber 
        })
        .eq('id', order.id);

      if (error) {
        console.error("Ошибка сохранения ТТН в базу:", error);
      } else {
        // Обновляем локальный стейт заказов на странице без полной перезагрузки
        setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'processing', ttn_number: data.ttnNumber } : o));
      }

    } catch (err) {
      console.error("Помилка:", err);
      alert('Сталася помилка при створенні ТТН');
    }
  }

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (data) setOrders(data)
      if (error) console.error("Ошибка загрузки заказов:", error)
      setLoading(false)
    }
    fetchOrders()
  }, [supabase])

  async function handleDeleteOrder(id: string) {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (!error) {
      setOrders(orders.filter((order) => order.id !== id))
    } else {
      console.error("Ошибка при удалении заказа:", error)
    }
  }

  return (
    <div className="p-4 md:p-8 min-h-screen max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Управление заказами</h1>
          <p className="text-sm text-muted-foreground mt-1">Список всех оформленных заказов клиентов</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline" className="gap-2">
            <Package className="h-4 w-4" /> К товарам
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Загрузка заказов...</p>
      ) : orders.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Пока нет ни одного заказа.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b pb-4">
                <div>
                  <h3 className="font-bold text-lg">Заказ: {order.order_reference}</h3>
                  <p className="text-xs text-muted-foreground">
                    Дата: {order.created_at ? new Date(order.created_at).toLocaleString("uk-UA") : "Не указана"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 uppercase border border-amber-500/20">
                    {order.status || "pending"}
                  </span>
                  <span className="text-lg font-extrabold">{order.total} ₴</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-6">
                <div className="space-y-1 bg-muted/30 p-4 rounded-xl border">
                  <p className="font-semibold text-foreground mb-2">Клиент:</p>
                  <p><strong>Имя Фамилия:</strong> {order.first_name} {order.last_name}</p>
                  <p><strong>Телефон:</strong> {order.phone}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                </div>

                <div className="space-y-1 bg-muted/30 p-4 rounded-xl border">
                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Доставка (Нова Пошта):
                  </p>
                  {order.nova_poshta ? (
                    <>
                      <p><strong>Город:</strong> {order.nova_poshta.city}</p>
                      <p><strong>Отделение:</strong> {order.nova_poshta.warehouse}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Другой тип доставки</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="font-semibold text-sm mb-2">Товары:</p>
                <div className="border rounded-xl overflow-hidden bg-muted/20 divide-y">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 text-sm">
                      <div className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt={item.title} className="size-10 rounded-lg object-cover" />}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">Кол-во: {item.qty} шт.</p>
                        </div>
                      </div>
                      <span className="font-semibold">{item.price * item.qty} ₴</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t">
                {/* Блок вывода ТТН, если она уже создана */}
                {order.ttn_number && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">ТТН: <strong>{order.ttn_number}</strong></span>
                </div>
                )}

                {/* Кнопка */}
                <Button 
                variant="default" 
                className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleCreateTTN(order)}
                >
                <Truck className="h-4 w-4" /> {order.ttn_number ? 'Оновити / Переглянути ТТН' : 'Створити ТТН'}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" /> Удалить заказ
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить этот заказ?</AlertDialogTitle>
                      <AlertDialogDescription>Заказ будет удален из базы данных навсегда.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>Удалить</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}