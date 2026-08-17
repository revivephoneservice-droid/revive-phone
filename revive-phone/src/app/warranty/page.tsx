export default function WarrantyPage() {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Гарантійні зобов'язання</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          У FixPhon ми впевнені в якості наших послуг та комплектуючих. 
          Наша гарантійна політика розроблена для того, щоб ви почувалися захищеними 
          після кожного візиту до нашого сервісу.
        </p>
  
        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold">Терміни гарантії</h2>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Ремонтні роботи:</strong> На виконані роботи ми надаємо гарантію терміном до 6 місяців.</li>
              <li><strong>Заміна дисплеїв та акумуляторів:</strong> Гарантія складає 3 місяці з моменту видачі пристрою.</li>
              <li><strong>Нові пристрої:</strong> На всю техніку, придбану у нас, діє офіційна гарантія виробника терміном від 12 місяців.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold">Що не покриває гарантія?</h2>
            <p className="mt-4 text-muted-foreground">
              Гарантійні зобов'язання не поширюються на випадки, коли пошкодження виникли через:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Механічні пошкодження (падіння, удари, сколи).</li>
              <li>Потрапляння рідини всередину пристрою (якщо це не було задокументовано як частина ремонту).</li>
              <li>Несанкціоноване втручання в конструкцію пристрою або спроби самостійного ремонту.</li>
              <li>Використання неоригінальних зарядних пристроїв, що призвело до виходу з ладу контролера живлення.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold">Як скористатися гарантією?</h2>
            <p className="mt-4 text-muted-foreground">
              Для звернення за гарантійним випадком, будь ласка, майте при собі 
              <strong>акт виконаних робіт</strong> або <strong>чек про покупку</strong>. 
              Ми проведемо діагностику пристрою, щоб підтвердити, що несправність 
              виникла в межах гарантійних умов.
            </p>
          </section>
        </div>
      </div>
    )
  }