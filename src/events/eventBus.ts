// eventBus.ts
import { EventEmitter } from "events";

interface EventPayload {
  [key: string]: any;
}

class EventBus {
  private emitter = new EventEmitter();

  emit(event: string, payload: EventPayload): void {
    console.log(`Emitting event: ${event}`);
    this.emitter.emit(event, payload);
  }

  on(event: string, listener: (payload: EventPayload) => void): void {
    this.emitter.on(event, listener);
  }
}

export const eventBus = new EventBus();
