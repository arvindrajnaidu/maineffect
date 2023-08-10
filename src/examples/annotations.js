async function foo ()  {
    const v = await routes({
        method: 'GET',
        handler: /*name:vHandler*/() => {
            return 1;
        }
    });
    return v;
}