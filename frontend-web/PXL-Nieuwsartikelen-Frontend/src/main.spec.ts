/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

describe('Bootstrap Application', () => {
  beforeEach(() => {
    const appRoot = document.createElement('app-root');
    document.body.appendChild(appRoot);
  });

  afterEach(() => {
    document.body.querySelector('app-root')?.remove();
  });

  it('should bootstrap the application without errors', async () => {
    const consoleErrorSpy = spyOn(console, 'error');

    try {
      await bootstrapApplication(AppComponent, appConfig);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    } catch (err) {
      fail(`Application bootstrap failed with error: ${err}`);
    }
  });
});

