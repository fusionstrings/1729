import { createActor } from 'xstate';
import { signal, effect } from "@webreflection/signal";
import { machine } from '#web-server-machine';

const server = signal(undefined);

effect(() => {
    console.info('server: ', server.value)
});



if (import.meta?.main) {
    const actor = createActor(machine);
    actor.subscribe((snapshot) => {
        console.log('Value:', snapshot.value);
    });

    actor.start();
    actor.send({ type: 'start' });
}

