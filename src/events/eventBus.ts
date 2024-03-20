// // eventBus.ts
// import { EventEmitter } from "events";
import { eventListeners } from "./Events";

// interface EventPayload {
//   [key: string]: any;
// }
// const emitter = new EventEmitter();
// export const initializeEvents = async (eventName: string) => {
//   const event = eventListeners[eventName];
//   event.forEach((listener: any) => {
//     emitter.on(eventName, (payload: EventPayload) => {
//       listener(payload);
//       console.log(`${eventName} is listening`);
//     });
//   });
// };

// export const dispatchEvent = (eventName: string, payload: EventPayload) => {
//   emitter.emit(eventName, payload);
// };

// const eventListeners = {
//   user_registered: [sendWelcomeEmail, sendCrm, checkReferral],
// }

// dispatchEventNew('zzz', {})

export const dispatchEvent = async <T>(eventName: string, payload: T) => {
  const listeners = eventListeners[eventName];

  // Check if listeners exist for the event and are an array
  if (Array.isArray(listeners)) {
    await Promise.all(
      listeners.map((listener) => {
        console.log(`${eventName} is dispatching`);
        listener(payload);
        console.log(`${eventName} is dispatched`);
      })
    );
  } else {
    console.warn(`No listeners found for the event: ${eventName}`);
  }
};
