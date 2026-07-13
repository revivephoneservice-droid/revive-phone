export default function FaqPage() {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Часті питання (FAQ)</h1>
        <p className="mt-6 text-muted-foreground">
          Ми зібрали відповіді на питання, які нам ставлять найчастіше. 
          Якщо ви не знайшли потрібної інформації, зателефонуйте нам або напишіть у соцмережі.
        </p>
  
        <div className="mt-12 space-y-6">
          {[
            {
              q: "Як довго триває діагностика пристрою?",
              a: "Стандартна діагностика займає від 30 хвилин до 2 годин. У складних випадках (наприклад, після потрапляння води) діагностика може тривати до 24 годин."
            },
            {
              q: "Чи надаєте ви підмінний телефон на час ремонту?",
              a: "Так, за наявності вільних пристроїв ми надаємо підмінний телефон, щоб ви завжди залишалися на зв'язку."
            },
            {
              q: "Чи можна оплатити послуги частинами?",
              a: "Ми працюємо з послугами 'Оплата частинами' від основних банків України. Деталі можна уточнити у нашого менеджера."
            },
            {
              q: "Чи зберігаються мої дані на телефоні під час ремонту?",
              a: "Ми завжди намагаємося зберегти ваші дані, але перед будь-яким серйозним ремонтом ми наполегливо рекомендуємо зробити резервну копію (iCloud/Google Drive)."
            },
            {
              q: "Які запчастини ви використовуєте?",
              a: "Ми використовуємо як сертифіковані оригінальні запчастини, так і високоякісні аналоги (A-copy), на які надаємо окрему гарантію. Ви завжди самі обираєте варіант перед початком ремонту."
            }
          ].map((item, index) => (
            <details key={index} className="group border rounded-lg p-6 hover:border-foreground/20 transition-colors">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                {item.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    )
  }