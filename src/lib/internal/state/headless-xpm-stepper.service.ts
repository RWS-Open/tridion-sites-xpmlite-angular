import { Injectable, signal } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()

export class StepperService {
    readonly canNext = signal(false)
    readonly canPrev = signal(true)
    readonly isLoading = signal(false)

    private readonly _stepError = signal<string | null>(null)
    private readonly _nextLabel = signal('Next');
    private readonly _prevLabel = signal('Previous');

    readonly stepError = this._stepError.asReadonly()
    readonly nextLabel = this._nextLabel.asReadonly()
    readonly prevLabel = this._prevLabel.asReadonly()

    private nextRequest = new Subject<void>();
    nextRequest$ = this.nextRequest.asObservable()

    private prevRequest = new Subject<void>();
    prevRequest$ = this.prevRequest.asObservable()

    moveForward = new Subject<void>()
    moveBackward = new Subject<void>()

    requestNext() {
        this.nextRequest.next()
    }

    requestPrev() {
        this.prevRequest.next()
    }

    complete() {
        this.moveForward.next()
    }
    goback() {
        this.moveBackward.next()
    }

    setNextLabel(label: string) {
        this._nextLabel.set(label)
    }

    setPrevLabel(label: string) {
        this._prevLabel.set(label)
    }

    setStepError(error:string | null){
        this._stepError.set(error)
    }
}