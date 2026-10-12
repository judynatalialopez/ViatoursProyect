import { places } from './places-obj'

const place = places.find(place => place.id === 1)

export const routes = [
  {
    id: 1,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Mina de sal',
    description: 'Descubre un mundo bajo tierra, donde la sal, la luz y la arquitectura crean una experiencia que sorprende a cada paso.',
    price: 120000,
    image_card: '/img/places/route/zipaquira/img-01.jpg',
    image: place?.image
  },
  {
    id: 2,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Desierto de Checua',
    description: 'Sal de la rutina y déjate sorprender por un paisaje de tierra y roca, ideal para explorar con calma y capturar recuerdos únicos.',
    price: 78000,
    image_card: '/img/places/route/zipaquira/img-02.jpg',
    image: place?.image
  },
  {
    id: 3,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Plaza de la independencia',
    description: 'Disfruta una pausa en tu recorrido y conecta con la vida local en un espacio para encontrarse, pasear y sentir el ritmo de Zipaquirá.',
    price: 7000,
    image_card: '/img/places/route/zipaquira/img-03.jpg',
    image: place?.image
  },
  {
    id: 4,
    placeId: place?.id,
    title: place?.title,
    title_card: 'Iglesia de Nuestra señora de los dolores',
    description: 'Haz una pausa para contemplar sus detalles y descubrir un lugar donde la tradición, la fe y la historia invitan a la calma.', price: 8000,
    image_card: '/img/places/route/zipaquira/img-04.jpg',
    image: place?.image
  }
]