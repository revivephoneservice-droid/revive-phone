"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/server/AdminActions";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await loginAction(email, password);
      router.push("/admin/dashboard"); // Перенаправляем на вашу админку
      router.refresh(); // Обновляем состояние сессии
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center ">
      <div className="w-full max-w-md space-y-8 rounded-xl  p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Вход в панель управления</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full rounded-lg border p-3" 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            className="w-full rounded-lg border p-3" 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            type="submit" 
            className="w-full rounded-lg  p-3  font-bold"
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}