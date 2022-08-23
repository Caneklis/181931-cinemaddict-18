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

const generateComment = () => ({
  author: 'Ilya O`Reilly',
  comment: generateDescription(),
  date: '2019-05-11T16:12:32.554Z',
  emotion: generateEmojy(),
});

const getCommentCount = (films) => {
  films.reduce((count, film)=>count + film.comments.length, 0);
};

const generateComments = (films) => {
  const commentCount = getCommentCount(films);

  return Array.from({length: commentCount}, (_value, index)=>{
    const commentItem = generateComment();

    return {
      id: String(index + 1),
      ...commentItem
    };
  });
};

export {generateComments};
