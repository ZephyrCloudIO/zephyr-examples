import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { mountZephyrWelcome } from '../../_shared/zephyr-welcome';

const ANGULAR_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 128 128"><path fill="#dd0031" d="M64 0L0 22.9l9.8 84.8L64 128l54.2-20.3L128 22.9z"/><path fill="#c3002f" d="M64 0v14.2V128l54.2-20.3L128 22.9z"/><path fill="#fff" d="M64 24.5L30.1 97.2h12.6l6.8-17h28.7l6.8 17h12.6zm9.5 44.6H54.5L64 43.1z"/></svg>`;

const VITE_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 32 32"><g fill="none"><path fill="url(#a)" d="m29.884 6.146-13.142 23.5a.714.714 0 01-1.244.005L2.096 6.148a.714.714 0 01.746-1.057l13.156 2.352a.7.7 0 00.253 0l12.881-2.348a.714.714 0 01.752 1.05z"/><path fill="url(#b)" d="M22.264 2.007L12.54 3.912a.36.36 0 00-.288.33l-.598 10.104a.357.357 0 00.437.369l2.707-.625a.357.357 0 01.43.42l-.804 3.939a.357.357 0 00.454.413l1.672-.508a.357.357 0 01.454.414l-1.279 6.187c-.08.387.435.598.65.267l.143-.222 7.925-15.815a.357.357 0 00-.387-.51l-2.787.537a.357.357 0 01-.41-.45l1.818-6.306a.357.357 0 00-.412-.45"/><defs><linearGradient id="a" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#41d1ff"/><stop offset="1" stop-color="#bd34fe"/></linearGradient><linearGradient id="b" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffea83"/><stop offset=".083" stop-color="#ffdd35"/><stop offset="1" stop-color="#ffa800"/></linearGradient></defs></g></svg>`;

@Component({
	selector: 'app-root',
	standalone: true,
	template: `<div #welcome></div>`,
	imports: [],
})
export class AppComponent implements AfterViewInit {
	@ViewChild('welcome', { static: true }) welcomeRef!: ElementRef<HTMLDivElement>;

	ngAfterViewInit() {
		mountZephyrWelcome(this.welcomeRef.nativeElement, {
			title: 'Angular + Vite',
			slug: 'frameworks/angular-vite',
			bundlerName: 'Vite',
			frameworkLogo: `<a href="https://angular.dev" target="_blank">${ANGULAR_LOGO}</a>`,
			bundlerLogo: `<a href="https://vite.dev" target="_blank">${VITE_LOGO}</a>`,
			pills: ['Angular', 'Vite', 'TypeScript', 'Zephyr Cloud'],
		});
	}
}
