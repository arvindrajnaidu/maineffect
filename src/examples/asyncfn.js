async function foo ()  {
    const v = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(10)
        }, 0);
    });
    return v;
}