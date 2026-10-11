import { places } from './places-obj'

const place = places.find(place => place.id === 1)

export const routes = [
  {
    id: 1,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Umami',
    description: 'Lorem lorem lorem lorem lorem lorem lorem lorem',
    price: 18000,
    image_card: '/img/places/restaurant/zipaquira/img-01.jpg',
    image: place?.image
  }
]