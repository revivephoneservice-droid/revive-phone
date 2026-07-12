"use client"
import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, UploadCloud } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { CATEGORY_MAP, CATEGORIES } from "@/lib/accessories"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const UUID_TO_NAME: Record<string, string> = CATEGORIES.reduce((acc, cat) => {
  const uuid = CATEGORY_MAP[cat.key];
  acc[uuid] = cat.label;
  return acc;
}, {} as Record<string, string>);

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState<any>(null)
  const [newData, setNewData] = useState<any>({ name: '', brand: '', category_id: '', price: 0, stock_quantity: 0, description: '', image_url: '', is_active: true })
  
  const supabase = createClient()

  // Dropzone логика
  const onDrop = (acceptedFiles: File[]) => {
    // Здесь будет логика загрузки файла в Supabase Storage
    console.log("Файлы для загрузки:", acceptedFiles);
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {'image/*': []} })

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*')
      if (data) setProducts(data)
      if (error) console.error("Ошибка загрузки:", error)
      setLoading(false)
    }
    fetchProducts()
  }, [supabase])

  async function handleDelete(id: string) {
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  async function handleUpdate() {
    if (!editData) return
    const { error } = await supabase.from('products').update(editData).eq('id', editData.id)
    if (!error) {
      setProducts(products.map(p => p.id === editData.id ? editData : p))
      setEditData(null)
    }
  }

  async function handleCreate() {
    const { data, error } = await supabase.from('products').insert([newData]).select()
    if (data) {
      setProducts([...products, data[0]])
      setNewData({ name: '', brand: '', category_id: '', price: 0, stock_quantity: 0, description: '', image_url: '', is_active: true })
    }
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Каталог товаров</h1>
        
        {/* Кнопка создания */}
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Добавить товар</Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Добавление нового товара</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <Input placeholder="Название" onChange={(e) => setNewData({...newData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Бренд" onChange={(e) => setNewData({...newData, brand: e.target.value})} />
                <div className="grid gap-2">
  <Label>Категория</Label>
  <Select 
    onValueChange={(value) => setNewData({...newData, category_id: value})}
  >
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Цена" onChange={(e) => setNewData({...newData, price: parseInt(e.target.value)})} />
                <Input type="number" placeholder="Склад" onChange={(e) => setNewData({...newData, stock_quantity: parseInt(e.target.value)})} />
              </div>
              <Textarea placeholder="Описание" onChange={(e) => setNewData({...newData, description: e.target.value})} />
              
              <div className="grid gap-2">
                <Label>URL изображения</Label>
                <Input 
                  placeholder="Вставьте ссылку на фото..." 
                  value={newData.image_url} // или editData.image_url для редактирования
                  onChange={(e) => setNewData({...newData, image_url: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
              <Button onClick={handleCreate}>Создать товар</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <div className="h-40 bg-gray-100 rounded-md mb-2 overflow-hidden flex items-center justify-center">
                 {/* Можно добавить отображение нескольких фото, если они есть в массиве */}
                <img width={160} height={160} src={product.image_url || "/phone-pixel.png"} alt={product.name} />
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1 flex-grow">
              <p><strong>Категория:</strong> {UUID_TO_NAME[product.category_id] || "Неизвестно"}</p>
              <p><strong>Бренд:</strong> {product.brand}</p>
              <p><strong>Цена:</strong> {product.price} ₴</p>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 pt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditData(product)}>
                    <Pencil className="h-4 w-4 mr-1" /> Ред.
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Редактирование {product.name}</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input defaultValue={product.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                    <Input defaultValue={product.brand} onChange={(e) => setEditData({...editData, brand: e.target.value})} />
                    <Input defaultValue={product.price} type="number" onChange={(e) => setEditData({...editData, price: parseInt(e.target.value)})} />
                    <Textarea defaultValue={product.description} onChange={(e) => setEditData({...editData, description: e.target.value})} />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
                    <Button onClick={handleUpdate}>Сохранить</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="flex-1"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Вы уверены?</AlertDialogTitle></AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(product.id)}>Удалить</AlertDialogAction>
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