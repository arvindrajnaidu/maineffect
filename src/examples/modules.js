import util from 'util';
import fs from 'fs';
import log from './logger';

const foo = () => {
    return 'foo';
}

export const show = (obj) => {
    util.inspect(obj);
    return foo();
}