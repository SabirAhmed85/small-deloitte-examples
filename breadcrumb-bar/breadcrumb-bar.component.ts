import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntil, filter, distinctUntilChanged } from 'rxjs/operators';
import { NavigationChangeService } from '@app/common/navigation-change.service';
import { StudyConfigureFormService } from '@app/study/study-configure/study-configure-form.service';
import { TitleCasePipe } from '@angular/common';

export interface IBreadcrumbElement {
  title: string;
  isLink: boolean;
  linkUrl?: string;
  isActive?: boolean;
}

const createPageSectionMapping = {
  'purpose': 'Purpose & Delivery Model',
  'drugs': 'Drug(s)',
  'allocation': 'Site & Subject Allocation',
  'target-dates': 'Study Target Dates',
  'treatment-duration': 'Treatment Duration'
};

const configurePageSectionMapping = {
  'target-dates': 'Study Target Dates',
  'site-subject-allocations': 'Site and Subject Allocations',
  'ivrs': 'Interactive Voice Reponse System (IVRS)',
  'ecoa': 'Electronic Clinical Outcome Assessments (eCOA)',
  'analysis-reporting': 'Analysis & Reporting Costs',
  'imaging': 'Imaging and Central Reading Costs'
};

@Component({
  selector: 'app-breadcrumb-bar',
  templateUrl: './breadcrumb-bar.component.html',
  styleUrls: ['./breadcrumb-bar.component.scss']
})
export class BreadcrumbBarComponent implements OnInit, OnDestroy {
  public breadcrumbElements: IBreadcrumbElement[] = [];
  public currentUrl: string;

  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private navigationChangeService: NavigationChangeService,
    private studyConfigureFormService: StudyConfigureFormService,
    private titleCasePipe: TitleCasePipe) {}

  ngOnInit() {
    this.createBreadcrumbElements();
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.router.url === this.currentUrl) {
          return;
        }

        this.currentUrl = this.router.url;
        this.createBreadcrumbElements();

        this.navigationChangeService.getInnerNavChanges(true)
          .pipe(takeUntil(this.destroy$))
          .subscribe((section) => {
            const page = this.router.url.indexOf('create') > -1 ?
              'create' :
              this.router.url.indexOf('configure') > -1 ?
                'configure' :
                'search';

            if (page !== 'configure') {
              this.updateBreadcrumbFromInnerNav(section, page);
            }
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigate(url: string) {
    const navParams = this.router.url.includes('?readonly=true') ? {queryParams: {readonly: true}} : {};
    this.router.navigate([url], navParams);
  }

  private createBreadcrumbElements() {
    this.breadcrumbElements = [];

    if (this.router.url.indexOf('configure') > -1) {
      this.studyConfigureFormService.model.pipe(takeUntil(this.destroy$)).subscribe(model => {
        const sectionName = this.router.url.split('#')[0].split('/')[this.router.url.split('/').length - 1].replace('?readonly=true', '');
        const studyName = model.studyName;
        const sectionDisplayName = configurePageSectionMapping[sectionName] ?
          configurePageSectionMapping[sectionName] :
          this.titleCasePipe.transform(sectionName.replace(/-/g, ' '));
        this.breadcrumbElements = [];

        this.breadcrumbElements.push({
          title: studyName,
          isLink: true,
          linkUrl: `study/configure/${this.studyConfigureFormService.model.value.studyId}/estimate`,
        }, {
          title: sectionDisplayName,
          isLink: false,
          isActive: true
        });
      });
    } else if (this.router.url.indexOf('create') > -1) {
      this.breadcrumbElements.push({
        title: 'Create Study',
        isLink: false,
        isActive: true
      }, {
        title: 'Purpose & Delivery Model',
        isLink: false,
        isActive: true
      });
    } else {
      this.breadcrumbElements.push({
        title: 'My Study Designs',
        isLink: false,
        isActive: true
      });
    }
  }

  private updateBreadcrumbFromInnerNav(section: string, page: string) {
    if (page === 'create') {
      this.breadcrumbElements[1].title = createPageSectionMapping[section];
    } else {
      this.breadcrumbElements[0].title = section;
    }
  }
}
