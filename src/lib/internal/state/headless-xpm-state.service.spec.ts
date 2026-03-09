import { TestBed } from "@angular/core/testing"
import { XpmStateService } from "./headless-xpm-state.service"
import { describe, it, expect, beforeEach } from 'vitest'


describe('Headless xpm state service', () => {
    let service: XpmStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [XpmStateService]
        })
        service = TestBed.inject(XpmStateService)
    })

    it('Should have default values to set to false', () => {
        expect(service.isXpmEnabled()).toBe(false)
        expect(service.isPageEnabled()).toBe(false)
    })

    it('Should toggle XPM Mode', () => {
        service.toggleXpmMode();
        expect(service.isXpmEnabled()).toBe(true)

        service.toggleXpmMode();
        expect(service.isXpmEnabled()).toBe(false)
    })

    it('Should toggle XPM Page Mode', () => {
        service.toggleXpmPageMode();
        expect(service.isPageEnabled()).toBe(true)

        service.toggleXpmPageMode();
        expect(service.isPageEnabled()).toBe(false)
    })

    it('Should keep XPM Mode and XPM Page mode toggle independent of each other', () => {
        service.toggleXpmMode();

        expect(service.isXpmEnabled()).toBe(true)
        expect(service.isPageEnabled()).toBe(false)

        service.toggleXpmPageMode()
        expect(service.isXpmEnabled()).toBe(true)
        expect(service.isPageEnabled()).toBe(true)
    })
})