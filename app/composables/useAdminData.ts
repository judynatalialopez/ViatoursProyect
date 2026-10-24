export type Destination = {
  id: number
  name: string
  image: string
  link: string
  active: boolean
}

export type CatalogPlace = {
  id: number
  name: string
  category: 'restaurantes' | 'joyeria' | 'experiencia'
  categoryName: 'RESTAURANTE' | 'JOYERIA' | 'EXPERIENCIA'
  description: string
  phone: string
  image: string
  url: string
  date_create: string
  active: boolean
}

const destinationSeed: Destination[] = [
  { id: 1, name: 'Bogotá', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS51uAlE5twImZjwY6QBzENZjXl32tGXNqUODtOh9CQDY0iLlY6HFAGe9M2&s=10', link: 'catalog', active: true },
  { id: 2, name: 'Zipaquirá', image: 'https://viajala.com.co/news/wp-content/uploads/2026/01/renovacion-del-centro-historico-de-Zipaquira.jpg', link: 'catalog', active: true },
  { id: 3, name: 'Villa de Leyva', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRinLkumlrp5gcToxdJImpZ1tTZ3-hpRPBA38k72gc7CGJxYBSDMia4DQc&s=10', link: 'catalog', active: true },
  { id: 4, name: 'Boyacá', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHdu-61HuAvmIFyEqXSQ1f5vVQmmYfZVpliOHTqjPOvNJ8pQ0QQxZc6uIw&s=10', link: 'catalog', active: true },
  { id: 5, name: 'Villavicencio', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZzPW32Rk8t4FpNc8Yk5qV0Zxfc3FRXbMkg0fNlBMSqoRCd7Uz0B0NJN-J&s=10', link: 'catalog', active: true },
  { id: 6, name: 'Eje cafetero', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPq_HDumpedSesXhY-jEOXobxu9o7NLwuSMc069LZipmQOf97W8X7EVMc&s=10', link: 'catalog', active: true }
]

const placeSeed: CatalogPlace[] = [
  { id: 1, name: 'El cielo restaurant', category: 'restaurantes', categoryName: 'RESTAURANTE', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '3143386499', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/fa/ef/01/elcielo-restaurant-bogota.jpg?w=900&h=-1&s=1', url: 'internal-site', date_create: '2026-10-20', active: true },
  { id: 2, name: 'Sombras', category: 'restaurantes', categoryName: 'RESTAURANTE', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '3143386499', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/33/ce/4d/59/sombras-es-la-primera.jpg?w=900&h=500&s=1', url: 'internal-site', date_create: '2026-10-22', active: true },
  { id: 3, name: 'Monserrate', category: 'experiencia', categoryName: 'EXPERIENCIA', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '3143386499', image: 'https://monserrate.co/uploads/site/home/day-view-2x.jpg', url: 'internal-site', date_create: '2026-10-18', active: true },
  { id: 4, name: "Piazza Italia By Storia D'Amore Calle 93", category: 'restaurantes', categoryName: 'RESTAURANTE', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '3143386499', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/a2/be/db/giardino.jpg?w=900&h=500&s=1', url: 'internal-site', date_create: '2026-10-19', active: true },
  { id: 5, name: 'Jardín botánico', category: 'experiencia', categoryName: 'EXPERIENCIA', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '3143386499', image: 'https://jbb.gov.co/wp-content/uploads/2024/06/00-1318-1024x682.jpg', url: 'internal-site', date_create: '2026-10-17', active: true },
  { id: 6, name: 'Joyería Esterlina', category: 'joyeria', categoryName: 'JOYERIA', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '3143386499', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbvMG1tjvkXNI8pCtfjSeZBoKo2ZZzwefcL710-4LY-0nkT0ZprqjZUU8&s=10', url: 'internal-site', date_create: '2026-10-21', active: true },
  { id: 7, name: "Storia D'Amore - Zona T", category: 'restaurantes', categoryName: 'RESTAURANTE', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '3143386499', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/c2/6b/71/al-parmigiano-reggiano.jpg?w=900&h=500&s=1', url: 'internal-site', date_create: '2026-10-23', active: true },
  { id: 8, name: 'GOLDEN EMERALD JOYERIA', category: 'joyeria', categoryName: 'JOYERIA', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '', image: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Qpy-qr4BILUXJ4Ai98Uv3EVhK49zg-CwglYdlb8RdPd9yfsBNg_mlhFAdWrHZvvGiEzwwcY7mm3skDJGU4aV5ZJ9UnzkVmVhYu9Kwek2pZI3g10zmcTWc1d256dvMeSa1ThtCdBvjdLZY6=s680-w680-h510-rw', url: 'internal-site', date_create: '2026-10-16', active: true },
  { id: 9, name: 'Planetario', category: 'experiencia', categoryName: 'EXPERIENCIA', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque eveniet voluptatibus placeat, consequuntur ratione eius possimus id iure quasi sunt temporibus.', phone: '3143386499', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBF4j68R7gddafWKP_pYfKRvBScQ6KiZgNasB_VaFO0W_YrRLlHyPoitw_&s=10', url: 'internal-site', date_create: '2026-10-15', active: true }
]

export const useAdminData = () => {
  const destinations = useState<Destination[]>('admin-destinations', () => destinationSeed.map(item => ({ ...item })))
  const places = useState<CatalogPlace[]>('admin-places', () => placeSeed.map(item => ({ ...item })))

  return { destinations, places }
}
