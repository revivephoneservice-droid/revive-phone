"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase"
import { CATEGORY_MAP, CATEGORIES } from "@/lib/accessories"

const UUID_TO_NAME: Record<string, string> = CATEGORIES.reduce((acc, cat) => {
  const uuid = CATEGORY_MAP[cat.key];
  acc[uuid] = cat.label;
  return acc;
}, {} as Record<string, string>);

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState<any>(null)
  const [newData, setNewData] = useState<any>({ 
    name: '', 
    brand: '', 
    category_id: '', 
    price: 0, 
    stock_quantity: 0, 
    description: '', 
    image_url: '', 
    is_active: true 
  })
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*')
      if (data) {
        setProducts(data)
      }
      if (error) {
        console.error("Ошибка загрузки товаров:", error)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [supabase])

  async function handleDelete(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter((product) => product.id !== id))
    } else {
      console.error("Ошибка при удалении товара:", error)
    }
  }

  async function handleUpdate() {
    if (!editData) return
    const { error } = await supabase
      .from('products')
      .update({
        name: editData.name,
        brand: editData.brand,
        category_id: editData.category_id,
        price: Number(editData.price),
        stock_quantity: Number(editData.stock_quantity),
        description: editData.description,
        image_url: editData.image_url,
        is_active: editData.is_active
      })
      .eq('id', editData.id)

    if (!error) {
      setProducts(products.map((product) => (product.id === editData.id ? editData : product)))
      setEditData(null)
    } else {
      console.error("Ошибка при обновлении товара:", error)
    }
  }

  async function handleCreate() {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: newData.name,
        brand: newData.brand,
        category_id: newData.category_id,
        price: Number(newData.price),
        stock_quantity: Number(newData.stock_quantity),
        description: newData.description,
        image_url: newData.image_url,
        is_active: newData.is_active
      }])
      .select()

    if (data) {
      setProducts([...products, data[0]])
      setNewData({ name: '', brand: '', category_id: '', price: 0, stock_quantity: 0, description: '', image_url: '', is_active: true })
    } else {
      console.error("Ошибка при создании товара:", error)
    }
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Каталог товаров</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавление нового товара</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input placeholder="Название товара" onChange={(e) => setNewData({...newData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Бренд" onChange={(e) => setNewData({...newData, brand: e.target.value})} />
                <Select onValueChange={(value) => setNewData({...newData, category_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.key} value={CATEGORY_MAP[cat.key]}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Цена" onChange={(e) => setNewData({...newData, price: e.target.value})} />
                <Input type="number" placeholder="Кол-во на складе" onChange={(e) => setNewData({...newData, stock_quantity: e.target.value})} />
              </div>
              <Textarea placeholder="Описание товара" onChange={(e) => setNewData({...newData, description: e.target.value})} />
              <Input placeholder="URL изображения" onChange={(e) => setNewData({...newData, image_url: e.target.value})} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Отмена</Button>
              </DialogClose>
              <Button onClick={handleCreate}>Создать товар</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
  {products.map((product) => (
    <Card
      key={product.id}
      className="flex flex-col overflow-hidden"
    >
      <CardHeader className="p-5">

        {/* Фото товара */}
        <div className="h-[300px] w-full bg-zinc-900/40 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
          <img
            src={product.image_url || "/phone-pixel.png"}
            alt={product.name}
            className="w-full h-full object-contain p-3"
          />
        </div>

        <CardTitle className="text-xl leading-tight">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm space-y-2 flex-grow px-5">
        <p>
          <strong>Категория:</strong>{" "}
          {UUID_TO_NAME[product.category_id] || "Неизвестно"}
        </p>

        <p>
          <strong>Бренд:</strong> {product.brand}
        </p>

        <p className="text-base">
          <strong>Цена:</strong>{" "}
          {Number(product.price).toLocaleString("uk-UA")} ₴
        </p>
      </CardContent>

      <CardFooter className="flex justify-between gap-3 p-5 pt-5">

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setEditData(product)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Ред.
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Редактирование товара
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Input
                defaultValue={product.name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
              />

              <Input
                defaultValue={product.brand}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    brand: e.target.value,
                  })
                }
              />

              <Input
                defaultValue={product.price}
                type="number"
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    price: e.target.value,
                  })
                }
              />

              <Textarea
                defaultValue={product.description}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    description: e.target.value,
                  })
                }
              />

              <Input
                defaultValue={product.image_url}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    image_url: e.target.value,
                  })
                }
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  Отмена
                </Button>
              </DialogClose>

              <Button onClick={handleUpdate}>
                Сохранить изменения
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Вы уверены?
              </AlertDialogTitle>

              <AlertDialogDescription>
                Товар будет удален навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Отмена
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={() =>
                  handleDelete(product.id)
                }
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardFooter>
    </Card>
  ))}
</div>
    </div>
  )
}