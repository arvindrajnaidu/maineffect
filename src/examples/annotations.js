async function foo ()  {
    const v = await routes({
        method: 'GET',
        handler: /*name:vHandler*/() => {
            return 1;
        }
    });
    return v;
}

async function bar ()  {
    const v = await routes({
        method: 'GET',
        handler: /*name:barHandler*/() => new Promise((resolve, reject) => {
            setTimeout(() => {
                return resolve(2);
            }, 0);
        })
    });
    return v;
}