import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval, map, takeWhile } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  private remainingSubject = new BehaviorSubject<number>(0);
  remaining$: Observable<number> = this.remainingSubject.asObservable();
  private sub?: Subscription;

  start(durationSeconds: number): void {
    this.stop();
    this.remainingSubject.next(durationSeconds);
    this.sub = interval(1000)
      .pipe(
        map(elapsed => durationSeconds - elapsed - 1),
        takeWhile(val => val >= 0)
      )
      .subscribe(val => this.remainingSubject.next(val));
  }

  stop(): void {
    this.sub?.unsubscribe();
    this.sub = undefined;
  }
}
