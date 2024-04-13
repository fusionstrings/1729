function delay(ms: number, errorProbability: number = 0): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < errorProbability) {
                reject({ type: 'ServiceNotAvailable' });
            } else {
                resolve();
            }
        }, ms);
    });
}

export { delay }