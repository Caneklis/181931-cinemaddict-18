import { getRandomInteger } from '../utils/common.js';

const FILMS_COUNT = 20;

const generateDescription = () => {
  const descriptions = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generatePoster = () => {
  const descriptions = [
    '/images/posters/the-dance-of-life.jpg',
    '/images/posters/sagebrush-trail.jpg',
    '/images/posters/the-man-with-the-golden-arm.jpg',
    '/images/posters/santa-claus-conquers-the-martians.jpg',
    '/images/posters/popeye-meets-sinbad.png',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateCard = () => ({
  filmInfo: {
    title: generateDescription(),
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: getRandomInteger(1, 5),
    poster: generatePoster(),
    ageRating: 0,
    director: 'Tom Ford',
    writers: ['Takeshi Kitano'],
    actors: [
      'Morgan Freeman',
      'Erich von Stroheim',
      'Mary Beth Hughes',
      'Dan Duryea',
    ],
    release: {
      date: '2019-05-11T00:00:00.000Z',
      releaseCountry: 'Finland',
    },
    runtime: getRandomInteger(60, 180),
    genre: ['Comedy'],
    description:
      'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.',
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: Boolean(getRandomInteger(0, 1)),
  },
});

const generateCards = () => {
  const films = Array.from({ length: FILMS_COUNT }, generateCard);

  let totalCommentsCount = 0;

  return films.map((film, index) => {
    const hasComments = getRandomInteger(0,1);

    const filmsCommentsCount = (hasComments) ? getRandomInteger(1, 10) : 0;

    totalCommentsCount += filmsCommentsCount;

    return {
      id: String(index + 1),
      comments: (hasComments)
        ? Array.from({length: filmsCommentsCount},
          (_value, commentIndex) => String(totalCommentsCount - commentIndex)
        )
        : [],
      ...film

    };
  });

};

export {generateCards};
