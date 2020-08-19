import { Directive, Input, HostListener, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { NavigationChangeService } from '@app/common/navigation-change.service';

@Directive({
    selector: '[appScrollSpy]'
})
export class ScrollSpyDirective implements OnInit, OnChanges {
    @Input('appScrollSpy')
    spiedIds: string[] = [];

    @Input()
    sectionClickScrollLock = false;

    private currentSection: string;
    private currentVisiblyActiveSection: string;

    constructor(private navigationChangeService: NavigationChangeService) {}

    ngOnInit() {
        this.checkForCurrentSection();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.sectionClickScrollLock = changes.sectionClickScrollLock ?
            changes.sectionClickScrollLock.currentValue : this.sectionClickScrollLock;
        this.spiedIds = changes.spiedIds ? changes.spiedIds.currentValue : this.spiedIds;

        if (changes.spiedIds) {
            this.checkForCurrentSection();
        }
    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll() {
        this.checkForCurrentSection();
    }

    private checkForCurrentSection() {
        let currentSection: string;
        const scrollTop = 100;
        if (this.spiedIds) {
            this.spiedIds.forEach((id) => {
                const element = document.getElementById(id);
                if ((element.offsetTop - document.documentElement.scrollTop) <= scrollTop) {
                    currentSection = element.id;
                }
            });
            if (currentSection !== this.currentSection || currentSection !== this.currentVisiblyActiveSection || !currentSection) {
                this.currentSection = currentSection ? currentSection : this.spiedIds[0];
                if (!this.sectionClickScrollLock) {
                    this.currentVisiblyActiveSection = currentSection ? currentSection : this.spiedIds[0];
                    this.navigationChangeService.innerNavChange(this.currentSection);
                }
            }
        }
    }
}
