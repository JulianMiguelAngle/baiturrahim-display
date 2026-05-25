import { EventEmitter } from 'events';

export const sseHub = new EventEmitter();

sseHub.setMaxListeners(20);