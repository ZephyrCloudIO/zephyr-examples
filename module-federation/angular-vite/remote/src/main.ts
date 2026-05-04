import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';

import { PromoCardComponent } from './promo-card.component';

bootstrapApplication(PromoCardComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((error) => console.error(error));
