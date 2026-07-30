import Image from "next/image"
import { Star, Flame, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const dishes = [
  {
    name: "Black Truffle Risotto",
    description: "Creamy arborio rice, shaved black truffle, aged parmesan.",
    image: "/images/dish-truffle-risotto.png",
    rating: 4.9,
    calories: 480,
    price: 32,
  },
  {
    name: "Grilled Wagyu Steak",
    description: "A5 wagyu, roasted seasonal vegetables, rosemary jus.",
    image: "/images/dish-wagyu-steak.png",
    rating: 5.0,
    calories: 720,
    price: 58,
  },
  {
    name: "Molten Chocolate Fondant",
    description: "Warm dark chocolate, raspberry coulis, edible gold leaf.",
    image: "/images/dish-chocolate-dessert.png",
    rating: 4.8,
    calories: 390,
    price: 18,
  },
]

export default function Specials() {
  return (
    <section id="menu" className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Handpicked Today</span>
          <h2 className="mt-3 text-balance font-serif text-4xl font-semibold text-foreground sm:text-5xl">
            Today&apos;s Specials
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            A curated selection of our chef&apos;s finest creations, prepared fresh for an unforgettable dining
            experience.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {dishes.map((dish) => (
            <article
              key={dish.name}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={dish.image || "/placeholder.svg"}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
                  <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
                  {dish.rating}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-2xl font-semibold text-foreground">{dish.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{dish.description}</p>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Flame className="size-4 text-accent" aria-hidden="true" />
                  {dish.calories} kcal
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="font-serif text-3xl font-semibold text-primary">${dish.price}</span>
                  <Button
                    variant="outline"
                    className="rounded-full border-primary/30 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    View Dish
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
