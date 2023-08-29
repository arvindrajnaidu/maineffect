import routes from 'routes';

const get = routes({
    method: 'GET',
    handler: /*name:vHandler*/() => {
        return 1;
    }
});

const post = routes({
    method: 'GET',
    handler: /*name:barHandler*/() => new Promise((resolve) => {
        setTimeout(() => {
            return resolve(2);
        }, 0);
    })
});
