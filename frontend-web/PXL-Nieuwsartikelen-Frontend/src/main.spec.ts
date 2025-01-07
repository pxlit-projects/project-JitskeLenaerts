import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

describe('Application Bootstrapping', () => {
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    consoleErrorSpy = spyOn(console, 'error');
  });

  it('should call bootstrapApplication with the AppComponent and appConfig', async () => {
    const bootstrapApplicationSpy = spyOn(globalThis, 'bootstrapApplication').and.callThrough();
    
    await bootstrapApplication(AppComponent, appConfig);

    expect(bootstrapApplicationSpy).toHaveBeenCalledWith(AppComponent, appConfig);
  });

  it('should handle errors during bootstrapping', async () => {
    const mockError = new Error('Bootstrap failed');

    spyOn(globalThis, 'bootstrapApplication').and.returnValue(Promise.reject(mockError));

    try {
      await bootstrapApplication(AppComponent, appConfig);
    } catch (err) {
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    }
  });
});
