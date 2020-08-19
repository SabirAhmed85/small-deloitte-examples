import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BreadcrumbBarComponent } from './breadcrumb-bar.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StudyConfigureFormService } from '@app/study/study-configure/study-configure-form.service';
import { BehaviorSubject, of } from 'rxjs';
import { TitleCasePipe } from '@angular/common';
import { NavigationChangeService } from '@app/common/navigation-change.service';

@Component({ template: '' })
class NullComponent {}

const mockRoutes = [
  { path: 'parent/study', component: NullComponent },
  { path: 'parent/create', component: NullComponent },
  { path: 'parent/configure/estimate', component: NullComponent },
  { path: 'parent/configure/reference-studies', component: NullComponent },
  { path: 'parent/configure/ivrs', component: NullComponent },
  { path: 'parent/configure/ecoa', component: NullComponent }
];

const testingMod = {
  imports: [
    NoopAnimationsModule,
    RouterTestingModule.withRoutes(mockRoutes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  declarations: [BreadcrumbBarComponent, NullComponent]
};

let component: BreadcrumbBarComponent;
let fixture: ComponentFixture<BreadcrumbBarComponent>;
let mockStudyConfigureFormService: StudyConfigureFormService;
let mockNavChangeService: NavigationChangeService;

describe('BreadcrumbBarComponent', () => {

  describe('without innerNavChanges', () => {

    beforeEach(async(() => {
      mockStudyConfigureFormService = {
        model: new BehaviorSubject({
          studyName: 'Configure Test Study'
        })
      } as any;

      TestBed.configureTestingModule({
        imports: testingMod.imports,
        schemas: testingMod.schemas,
        providers: [
          { provide: StudyConfigureFormService, useValue: mockStudyConfigureFormService },
          TitleCasePipe
        ],
        declarations: testingMod.declarations
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent<BreadcrumbBarComponent>(BreadcrumbBarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    afterEach(() => {
      fixture.debugElement.nativeElement.remove();
    });

    it('should create breadcrumbs correctly on Init on Search page', fakeAsync(() => {
      const router = TestBed.get(Router) as Router;
      fixture.ngZone.run(async() => {
        await router.navigate(['parent/study']);
      });

      tick(100);
      
      expect(component.breadcrumbElements.length).toEqual(1);
      expect(component.breadcrumbElements[0].title).toEqual('My Study Designs');
      expect(component.breadcrumbElements[0].isLink).toEqual(false);
      expect(component.breadcrumbElements[0].isActive).toEqual(true);
    }));

    it('should create breadcrumbs correctly on Init on Create page', fakeAsync(() => {
      const router = TestBed.get(Router) as Router;
      fixture.ngZone.run(async() => {
        await router.navigate(['parent/create']);
      });

      tick(100);
      
      expect(component.breadcrumbElements.length).toEqual(2);
      expect(component.breadcrumbElements[0].title).toEqual('Create Study');
      expect(component.breadcrumbElements[0].isLink).toEqual(false);
      expect(component.breadcrumbElements[0].isActive).toEqual(true);

      expect(component.breadcrumbElements[1].title).toEqual('Purpose & Delivery Model');
      expect(component.breadcrumbElements[1].isLink).toEqual(false);
      expect(component.breadcrumbElements[1].isActive).toEqual(true);
    }));

    it('should create breadcrumbs correctly on Init on Configure page', fakeAsync(() => {
      const router = TestBed.get(Router) as Router;
      fixture.ngZone.run(async() => {
        await router.navigate(['parent/configure/estimate']);
      });

      tick(100);
      
      expect(component.breadcrumbElements.length).toEqual(2);
      expect(component.breadcrumbElements[0].title).toEqual('Configure Test Study');
      expect(component.breadcrumbElements[0].isLink).toEqual(true);
      expect(component.breadcrumbElements[0].isActive).not.toBeDefined();

      expect(component.breadcrumbElements[1].title).toEqual('Estimate');
      expect(component.breadcrumbElements[1].isLink).toEqual(false);
      expect(component.breadcrumbElements[1].isActive).toBeDefined();
      expect(component.breadcrumbElements[1].isActive).toEqual(true);
    }));

    it('should format route labels correctly for display', fakeAsync(() => {
      const router = TestBed.get(Router) as Router;
      fixture.ngZone.run(async() => {
        await router.navigate(['parent/configure/reference-studies']);
      });
      tick(100);

      expect(component.breadcrumbElements[1].title).toEqual('Reference Studies');

      fixture.ngZone.run(async() => {
        await router.navigate(['parent/configure/ivrs']);
      });
      tick(100);
      
      expect(component.breadcrumbElements[1].title).toEqual('Interactive Voice Reponse System (IVRS)');

      fixture.ngZone.run(async() => {
        await router.navigate(['parent/configure/ecoa']);
      });
      tick(100);

      expect(component.breadcrumbElements[1].title).toEqual('Electronic Clinical Outcome Assessments (eCOA)');
    }));

    it('should perform navigate function correctly when in edit mode', fakeAsync(() => {
      const routerSpy = spyOn(component['router'], 'navigate').and.returnValue(new Promise((_ => {})));
      component.navigate('parent/configure/estimate');
      
      expect(routerSpy).toHaveBeenCalledWith(['parent/configure/estimate'], {});
    }));
  });

  describe('with innerNavChanges', () => {
  
    beforeEach(async(() => {
      mockNavChangeService = {
        getInnerNavChanges: (bool: boolean) => of('treatment-duration')
      } as any;
  
      TestBed.configureTestingModule({
        imports: testingMod.imports,
        providers: [
          { provide: NavigationChangeService, useValue: mockNavChangeService },
          TitleCasePipe
        ],
        schemas: testingMod.schemas,
        declarations: testingMod.declarations
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent<BreadcrumbBarComponent>(BreadcrumbBarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    afterEach(() => {
      fixture.debugElement.nativeElement.remove();
    });
  
    it('should pick up & process innerNavChanges correctly on create page', fakeAsync(() => {
      const router = TestBed.get(Router) as Router;
      fixture.ngZone.run(async() => {
        await router.navigate(['parent/create']);
      });
      tick(100);
  
      expect(component.breadcrumbElements[1].title).toEqual('Treatment Duration');
    }));
  
    it('should pick up innerNavChanges correctly on search page', fakeAsync(() => {
      const router = TestBed.get(Router) as Router;
      fixture.ngZone.run(async() => {
        await router.navigate(['parent/study']);
      });
      tick(100);
  
      expect(component.breadcrumbElements[0].title).toEqual('treatment-duration');
    }));
  });
});
