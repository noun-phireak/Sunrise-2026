import { vi } from 'vitest';

class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

window.ResizeObserver = ResizeObserver;

// Mock global pointer capture methods if needed
window.Element.prototype.setPointerCapture = vi.fn();
window.Element.prototype.releasePointerCapture = vi.fn();
window.Element.prototype.hasPointerCapture = vi.fn();
