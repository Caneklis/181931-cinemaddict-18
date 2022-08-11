import { getRandomInteger } from '../utils.js';

const generateDescription = () => {
  const descriptions = [
    'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateEmojy = () => {
  const emoji = ['smile', 'sleeping', 'puke', 'angry'];
  const randomIndex = getRandomInteger(0, emoji.length - 1);

  return emoji[randomIndex];
};

export const generateComment = () => ({
  id: getRandomInteger(1, 100).toString(),
  author: 'Ilya O`Reilly',
  comment: generateDescription(),
  date: '2019-05-11T16:12:32.554Z',
  emotion: generateEmojy(),
});
