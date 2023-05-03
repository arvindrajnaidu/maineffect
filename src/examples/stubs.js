import logger from 'logger'

const one = () => {
  logger.stream.foo.bar.info('adding');
  return 1;
};

const two = () => {
  logger('this').info('is').debug('awesome');
  return 2;
};

const three = () => {
  const a = logger.info('is').severe.armageddon('explosive');
  return 3;
};