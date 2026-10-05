import { places } from './places-obj'

const place = places.find(place => place.id === 1)

export const routes = [
  {
    id: 1,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Mina de sal',
    description: 'Lorem lorem lorem lorem lorem lorem lorem lorem',
    price: 120000,
    image_card: '/img/places/route/zipaquira/img-01.jpg',
    image: place?.image
  },
  {
    id: 2,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Desierto de Checua',
    description: 'Lorem lorem lorem lorem lorem lorem lorem lorem',
    price: 78000,
    image_card: '/img/places/route/zipaquira/img-02.jpg',
    image: place?.image
  },
  {
    id: 3,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Plaza de la independencia',
    description: 'Lorem lorem lorem lorem lorem lorem lorem lorem',
    price: 7000,
    image_card: '/img/places/route/zipaquira/img-03.jpg',
    image: place?.image
  },
  {
    id: 4,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Iglesia de Nuestra señora de los dolores',
    description: 'Lorem lorem lorem lorem lorem lorem lorem lorem',
    price: 8000,
    image_card: '/img/places/route/zipaquira/img-04.jpg',
    image: place?.image
  }
]