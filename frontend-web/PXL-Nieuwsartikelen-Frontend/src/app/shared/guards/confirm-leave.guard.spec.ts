import { TestBed } from '@angular/core/testing';
import { ConfirmLeaveGuard } from './confirm-leave.guard';
import { CanComponentDeactivate } from './confirm-leave.guard';
import { Observable, of } from 'rxjs';

describe('ConfirmLeaveGuard', () => {
  let guard: ConfirmLeaveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmLeaveGuard],
    });
    guard = TestBed.inject(ConfirmLeaveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true if canDeactivate is not defined on the component', () => {
      const component = {} as CanComponentDeactivate;  
      const result = guard.canDeactivate(component);
      expect(result).toBe(true);
    });

    it('should return true if canDeactivate returns true', () => {
      const component = {
        canDeactivate: () => true 
      } as CanComponentDeactivate;

      const result = guard.canDeactivate(component);
      expect(result).toBe(true);
    });

    it('should return false if canDeactivate returns false', () => {
      const component = {
        canDeactivate: () => false  
      } as CanComponentDeactivate;

      const result = guard.canDeactivate(component);
      expect(result).toBe(false);
    });

    it('should return true if canDeactivate returns true in an observable', (done) => {
      const component = {
        canDeactivate: () => of(true)  
      } as CanComponentDeactivate;

      const result = guard.canDeactivate(component);

      if (result instanceof Observable) {
        result.subscribe(val => {
          expect(val).toBe(true);
          done();
        });
      } else {
        expect(result).toBe(true);
      }
    });

    it('should return false if canDeactivate returns false in an observable', (done) => {
      const component = {
        canDeactivate: () => of(false) 
      } as CanComponentDeactivate;

      const result = guard.canDeactivate(component);

      if (result instanceof Observable) {
        result.subscribe(val => {
          expect(val).toBe(false);
          done();
        });
      } else {
        expect(result).toBe(false);
      }
    });

    it('should return true if canDeactivate returns true in a promise', async () => {
      const component = {
        canDeactivate: () => Promise.resolve(true) 
      } as CanComponentDeactivate;

      const result = await guard.canDeactivate(component);
      expect(result).toBe(true);
    });

    it('should return false if canDeactivate returns false in a promise', async () => {
      const component = {
        canDeactivate: () => Promise.resolve(false) 
      } as CanComponentDeactivate;

      const result = await guard.canDeactivate(component);
      expect(result).toBe(false);
    });
  });
});
