import { logger } from './logger';

export const two = () => {
    logger('this').file('is').debug('awesome');
    return 2;
};