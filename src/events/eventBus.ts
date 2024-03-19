// eventBus.ts
import { EventEmitter } from "events";
import { eventListeners } from "./Events";
import { eventNames } from "process";

interface EventPayload {
  [key: string]: any;
}
const emitter = new EventEmitter();

export const initializeEvents = (eventName: string) => () => {
  const event = eventListeners[eventName];

  event.forEach((listener: any) => {
    emitter.on(eventName, (payload) => listener(payload));
  });
};

export const dispatchEvent = (eventName: string, payload: any) => {
  emitter.emit(eventName, payload);
};
