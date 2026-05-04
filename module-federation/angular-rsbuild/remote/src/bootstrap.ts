import '@angular/compiler';
import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { PromoCardComponent } from './promo-card.component';

bootstrapApplication(PromoCardComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((error) => console.error(error));
