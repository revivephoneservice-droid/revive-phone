const STATS = [
    { value: "30 хв", label: "Середній час обслуговування" },
    { value: "12 тис.+", label: "Оновлених девайсів" },
    { value: "4.9★", label: "Рейтинг клієнтів" },
    { value: "Довічна", label: "Гарантія включена" },
  ]
  
  export function StatsBar() {
    return (
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  