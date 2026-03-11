import { Injectable, signal } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image: string;
  rating: number;
  unit: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Manzanas Fuji',
      price: 45,
      description:
        'Manzanas frescas importadas, dulces y crujientes. Ideales para comer o hacer pays.',
      category: 'Frutas',
      stock: 80,
      image: '🍎',
      rating: 4.8,
      unit: 'kg',
    },
    {
      id: 2,
      name: 'Plátanos Tabasco',
      price: 22,
      description: 'Plátanos maduros nacionales, llenos de energía y sabor natural.',
      category: 'Frutas',
      stock: 60,
      image: '🍌',
      rating: 4.6,
      unit: 'kg',
    },
    {
      id: 3,
      name: 'Fresas Irapuato',
      price: 55,
      description: 'Fresas de temporada del Bajío, extra grandes y muy dulces.',
      category: 'Frutas',
      stock: 30,
      image: '🍓',
      rating: 4.9,
      unit: 'charola 500g',
    },
    {
      id: 4,
      name: 'Aguacate Hass',
      price: 38,
      description: 'Aguacate Hass listo para comer, cremoso y perfecto para guacamole.',
      category: 'Frutas',
      stock: 50,
      image: '🥑',
      rating: 4.7,
      unit: 'pieza',
    },
    {
      id: 5,
      name: 'Jitomate Bola',
      price: 28,
      description: 'Jitomate fresco de invernadero, ideal para salsas y ensaladas.',
      category: 'Verduras',
      stock: 90,
      image: '🍅',
      rating: 4.5,
      unit: 'kg',
    },
    {
      id: 6,
      name: 'Brócoli Orgánico',
      price: 35,
      description: 'Brócoli orgánico certificado, grande y fresco, lleno de vitaminas.',
      category: 'Verduras',
      stock: 40,
      image: '🥦',
      rating: 4.6,
      unit: 'pieza',
    },
    {
      id: 7,
      name: 'Zanahoria Baby',
      price: 32,
      description: 'Zanahorias baby listas para botanear o cocinar, ya lavadas y empacadas.',
      category: 'Verduras',
      stock: 55,
      image: '🥕',
      rating: 4.4,
      unit: 'bolsa 400g',
    },
    {
      id: 8,
      name: 'Lechuga Orejona',
      price: 18,
      description: 'Lechuga fresca hidropónica, crujiente y sin pesticidas.',
      category: 'Verduras',
      stock: 35,
      image: '🥬',
      rating: 4.5,
      unit: 'pieza',
    },
    {
      id: 9,
      name: 'Leche Entera LALA',
      price: 26,
      description: 'Leche entera ultrapasteurizada, rica en calcio y proteínas.',
      category: 'Lácteos',
      stock: 120,
      image: '🥛',
      rating: 4.7,
      unit: 'litro',
    },
    {
      id: 10,
      name: 'Queso Oaxaca',
      price: 95,
      description: 'Queso Oaxaca artesanal, excelente para quesadillas y gratinar.',
      category: 'Lácteos',
      stock: 25,
      image: '🧀',
      rating: 4.8,
      unit: '500g',
    },
    {
      id: 11,
      name: 'Yogurt Griego Fage',
      price: 58,
      description: 'Yogurt griego natural 0% grasa, alto en proteína, sin azúcar añadida.',
      category: 'Lácteos',
      stock: 45,
      image: '🍦',
      rating: 4.6,
      unit: '500g',
    },
    {
      id: 12,
      name: 'Pan Integral Bimbo',
      price: 42,
      description: 'Pan de caja integral con semillas, alto en fibra, 24 rebanadas.',
      category: 'Panadería',
      stock: 60,
      image: '🍞',
      rating: 4.4,
      unit: 'paquete',
    },
    {
      id: 13,
      name: 'Croissant de Mantequilla',
      price: 18,
      description: 'Croissant artesanal horneado al momento, hojaldrado y suave.',
      category: 'Panadería',
      stock: 20,
      image: '🥐',
      rating: 4.9,
      unit: 'pieza',
    },
    {
      id: 14,
      name: 'Tortillas de Maíz',
      price: 15,
      description: 'Tortillas de maíz nixtamalizado, hechas a mano, paquete de 30 piezas.',
      category: 'Panadería',
      stock: 100,
      image: '🫓',
      rating: 4.8,
      unit: 'kg',
    },
    {
      id: 15,
      name: 'Pechuga de Pollo',
      price: 110,
      description: 'Pechuga de pollo fresca sin hueso y sin piel, de granja libre.',
      category: 'Carnes',
      stock: 30,
      image: '🍗',
      rating: 4.6,
      unit: 'kg',
    },
    {
      id: 16,
      name: 'Huevo San Juan',
      price: 68,
      description: 'Huevo blanco fresco, carton de 30 piezas. Producción local.',
      category: 'Carnes',
      stock: 70,
      image: '🥚',
      rating: 4.7,
      unit: 'cartón 30 pzas',
    },
    {
      id: 17,
      name: 'Café Veracruz Grano',
      price: 145,
      description: 'Café de altura de Veracruz, tostado medio, notas a chocolate y caramelo.',
      category: 'Bebidas',
      stock: 40,
      image: '☕',
      rating: 4.9,
      unit: '250g',
    },
    {
      id: 18,
      name: 'Jugo de Naranja Natural',
      price: 48,
      description: 'Jugo de naranja 100% natural sin conservadores, recién exprimido.',
      category: 'Bebidas',
      stock: 50,
      image: '🍊',
      rating: 4.8,
      unit: '1 litro',
    },
  ]);

  addProduct(product: Omit<Product, 'id'>): void {
    const newId = Math.max(...this.products().map((p) => p.id)) + 1;
    this.products.update((list) => [...list, { ...product, id: newId }]);
  }
  updateProduct(updated: Product): void {
    this.products.update((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  }
  deleteProduct(id: number): void {
    this.products.update((list) => list.filter((p) => p.id !== id));
  }
  getById(id: number): Product | undefined {
    return this.products().find((p) => p.id === id);
  }
  getCategories(): string[] {
    return [...new Set(this.products().map((p) => p.category))];
  }
}
