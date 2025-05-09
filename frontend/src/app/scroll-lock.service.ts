import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScrollLockService {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  lockScroll() {
    this.renderer.addClass(this.document.body, 'overflow-h');
  }

  unlockScroll() {
    this.renderer.removeClass(this.document.body, 'overflow-h');
  }
}
