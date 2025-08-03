// main.ts
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Assuming appConfig looks something like this:
// const appConfig = { providers: [/* some providers */] };

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    ...appConfig.providers, // Spread the providers from appConfig here
  ],
})
  .catch((err) => console.error(err));
