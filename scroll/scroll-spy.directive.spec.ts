import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { ScrollSpyDirective } from './scroll-spy.directive';
import { SideMenuRouteModel } from '@app/shared/simple-components/side-menu/side-menu-route.model';
import { NavigationChangeService } from '@app/common/navigation-change.service';

@Component({
  template: `
    <nav style="height: 30px;" [appScrollSpy]="idsToSpy">
      <div *ngFor="let route of routeModels">
        <a [class.active]="(page === 'configure' && route.isActive) || (page === 'create' && currentSection === route.fragment)"
          [class.sub-active]="route.isActive"
          [class.parent-active]="route.subRoutes.length > 0 && route.isActive">
          {{ route.title }}
        </a>
      </div>
    </nav>
    <div>
      <div style="height: 70px;" id="nav-1"></div>
      <div style="height: 70px;" id="nav-2"></div>
    </div>
    <div>
      <div style="height: 70px;" id="nav-3"></div>
      <div style="height: 70px;" id="nav-4"></div>
    </div>`
})
class TestScrollSpyComponent {
  page: string = 'create';
  currentSection: string = '';
  idsToSpy: string[] = ['nav-1', 'nav-2'];
  routeModels: SideMenuRouteModel[] = [
    {
      title: 'Nav 1',
      isActive: false,
      hideAssumptions: false,
      subRoutes: [],
      fragment: 'nav-1'
    },
    {
      title: 'Nav 2',
      isActive: false,
      hideAssumptions: false,
      subRoutes: [],
      fragment: 'nav-2'
    },
    {
      title: 'Nav 3',
      isActive: false,
      hideAssumptions: false,
      subRoutes: [],
      fragment: 'nav-3'
    },
    {
      title: 'Nav 4',
      isActive: false,
      hideAssumptions: false,
      subRoutes: [],
      fragment: 'nav-4'
    }
  ];
}

describe('Directive: AppScrollSpy', () => {
    let component: TestScrollSpyComponent;
    let fixture: ComponentFixture<TestScrollSpyComponent>;
    let navEl: DebugElement;
    let mockNavigationChangeService: NavigationChangeService;

    beforeEach(() => {
      mockNavigationChangeService = {
        innerNavChange: (section: string) => {
          component.currentSection = section;
        }
      } as any;

      TestBed.configureTestingModule({
        declarations: [TestScrollSpyComponent, ScrollSpyDirective],
        providers: [
          { provide: NavigationChangeService, useValue: mockNavigationChangeService }
        ]
      });
      fixture = TestBed.createComponent(TestScrollSpyComponent);
      component = fixture.componentInstance;
      navEl = fixture.debugElement.query(By.css('nav'));
    });

    afterEach(() => {
      fixture.debugElement.nativeElement.remove();
    });

    it('checks for Current Section on Init and applies active class on create page', () => {
      fixture.detectChanges();

      expect(navEl.children[0].children[0].nativeNode).toHaveClass('active');
      expect(navEl.children[1].children[0].nativeNode).not.toHaveClass('active');
    });

    it('handles changes correctly on create page', () => {
      component.idsToSpy = ['nav-3', 'nav-4'];
      fixture.detectChanges();

      expect(navEl.children[0].children[0].nativeNode).not.toHaveClass('active');
      expect(navEl.children[1].children[0].nativeNode).not.toHaveClass('active');
      expect(navEl.children[2].children[0].nativeNode).toHaveClass('active');
      expect(navEl.children[3].children[0].nativeNode).not.toHaveClass('active');
    });

    it('checks for Current Section on Init and applies active class on configure page', () => {
      component.page = 'configure';
      component.routeModels = [
        {
          title: 'Nav 1',
          isActive: false,
          hideAssumptions: false,
          subRoutes: [],
          fragment: 'nav-1'
        },
        {
          title: 'Nav 2',
          isActive: true,
          hideAssumptions: false,
          subRoutes: [],
          fragment: 'nav-2'
        }
      ];
      fixture.detectChanges();

      expect(navEl.children[0].children[0].nativeNode).not.toHaveClass('active');
      expect(navEl.children[1].children[0].nativeNode).toHaveClass('active');
      expect(navEl.children[1].children[0].nativeNode).toHaveClass('sub-active');
      expect(navEl.children[1].children[0].nativeNode).not.toHaveClass('parent-active');
    });

    it('checks for Current Section on Init and applies parent-active class on configure page', () => {
      component.page = 'configure';
      component.routeModels = [
        {
          title: 'Nav 1',
          isActive: false,
          hideAssumptions: false,
          subRoutes: [],
          fragment: 'nav-1'
        },
        {
          title: 'Nav 2',
          isActive: true,
          hideAssumptions: false,
          subRoutes: [1 as any, 2 as any],
          fragment: 'nav-2'
        }
      ];
      fixture.detectChanges();

      expect(navEl.children[0].children[0].nativeNode).not.toHaveClass('parent-active');
      expect(navEl.children[1].children[0].nativeNode).toHaveClass('parent-active');
    });
});