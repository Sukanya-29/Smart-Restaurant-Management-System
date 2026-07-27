export interface MenuItem {
  id: number;
  name: string;
  category: "Starters" | "Main Course" | "Beverages" | "Desserts";
  price: number;
  is_available: boolean;
  prep_time_mins: number;
  dietary_type: "Veg" | "Non-Veg" | "Jain";
  rating: number;
  calories: number;
  bestseller: boolean;
  description: string;
  image_url: string;
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Paneer Tikka",
    category: "Starters",
    price: 299,
    is_available: true,
    prep_time_mins: 15,
    dietary_type: "Veg",
    rating: 4.8,
    calories: 320,
    bestseller: true,
    description:
      "Char-grilled paneer cubes marinated in authentic Indian spices.",
    image_url: "/paneer tikka.jpg",
  },

  {
    id: 2,
    name: "Chicken Tikka",
    category: "Starters",
    price: 349,
    is_available: true,
    prep_time_mins: 18,
    dietary_type: "Non-Veg",
    rating: 4.9,
    calories: 420,
    bestseller: true,
    description:
      "Tender chicken pieces grilled in a traditional tandoor.",
    image_url: "/burger.jpg",
  },

  {
    id: 3,
    name: "Veg Spring Rolls",
    category: "Starters",
    price: 229,
    is_available: true,
    prep_time_mins: 12,
    dietary_type: "Veg",
    rating: 4.6,
    calories: 250,
    bestseller: false,
    description:
      "Crispy spring rolls stuffed with fresh vegetables.",
    image_url: "/pizza.jpg",
  },

  {
    id: 4,
    name: "Butter Chicken",
    category: "Main Course",
    price: 499,
    is_available: true,
    prep_time_mins: 22,
    dietary_type: "Non-Veg",
    rating: 4.9,
    calories: 650,
    bestseller: true,
    description:
      "Creamy butter chicken cooked in rich tomato gravy.",
    image_url: "/burger.jpg",
  },

  {
    id: 5,
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 379,
    is_available: true,
    prep_time_mins: 20,
    dietary_type: "Veg",
    rating: 4.8,
    calories: 530,
    bestseller: true,
    description:
      "Soft paneer cubes cooked in creamy butter masala gravy.",
    image_url: "/paneer tikka.jpg",
  },
    {
    id: 6,
    name: "Dal Makhani",
    category: "Main Course",
    price: 289,
    is_available: true,
    prep_time_mins: 18,
    dietary_type: "Veg",
    rating: 4.7,
    calories: 430,
    bestseller: false,
    description:
      "Slow-cooked black lentils finished with cream and butter.",
    image_url: "/food-placeholder.png",
  },

  {
    id: 7,
    name: "Jain Veg Curry",
    category: "Main Course",
    price: 329,
    is_available: true,
    prep_time_mins: 18,
    dietary_type: "Jain",
    rating: 4.6,
    calories: 390,
    bestseller: false,
    description:
      "Fresh vegetables cooked without onion and garlic.",
    image_url: "/food-placeholder.png",
  },

  {
    id: 8,
    name: "Veg Biryani",
    category: "Main Course",
    price: 349,
    is_available: true,
    prep_time_mins: 20,
    dietary_type: "Veg",
    rating: 4.8,
    calories: 560,
    bestseller: true,
    description:
      "Aromatic basmati rice cooked with vegetables and Indian spices.",
    image_url: "/veg biryani.jpg",
  },

  {
    id: 9,
    name: "Chicken Biryani",
    category: "Main Course",
    price: 449,
    is_available: true,
    prep_time_mins: 25,
    dietary_type: "Non-Veg",
    rating: 4.9,
    calories: 720,
    bestseller: true,
    description:
      "Traditional dum biryani prepared with tender chicken.",
    image_url: "/non veg biryani.jpg",
  },

  {
    id: 10,
    name: "Masala Chai",
    category: "Beverages",
    price: 80,
    is_available: true,
    prep_time_mins: 5,
    dietary_type: "Veg",
    rating: 4.7,
    calories: 90,
    bestseller: false,
    description:
      "Authentic Indian tea infused with aromatic spices.",
    image_url: "/coffee.jpg",
  },
    {
    id: 11,
    name: "Cold Coffee",
    category: "Beverages",
    price: 180,
    is_available: true,
    prep_time_mins: 6,
    dietary_type: "Veg",
    rating: 4.8,
    calories: 240,
    bestseller: true,
    description:
      "Refreshing cold coffee topped with creamy foam.",
    image_url: "/coffee.jpg",
  },

  {
    id: 12,
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 120,
    is_available: true,
    prep_time_mins: 4,
    dietary_type: "Veg",
    rating: 4.5,
    calories: 80,
    bestseller: false,
    description:
      "Fresh lime mixed with sparkling soda and ice.",
    image_url: "/coffee.jpg",
  },

  {
    id: 13,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 140,
    is_available: true,
    prep_time_mins: 5,
    dietary_type: "Veg",
    rating: 4.8,
    calories: 210,
    bestseller: true,
    description:
      "Soft milk dumplings soaked in delicious sugar syrup.",
    image_url: "/dessert.jpg",
  },

  {
    id: 14,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 220,
    is_available: true,
    prep_time_mins: 8,
    dietary_type: "Veg",
    rating: 4.9,
    calories: 390,
    bestseller: true,
    description:
      "Warm chocolate brownie served with rich chocolate sauce.",
    image_url: "/dessert.jpg",
  },

  {
    id: 15,
    name: "Rasmalai",
    category: "Desserts",
    price: 180,
    is_available: true,
    prep_time_mins: 6,
    dietary_type: "Veg",
    rating: 4.8,
    calories: 260,
    bestseller: false,
    description:
      "Soft cottage cheese patties soaked in sweet saffron milk.",
    image_url: "/tiramissu.jpg",
  },
];