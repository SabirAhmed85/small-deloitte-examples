import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CreateIdPipe } from '@app/shared/pipes/create-id.pipe';
import { CustomCurrencyPipe } from '@app/shared/pipes/custom-currency.pipe';
import { CostCardComponent } from './cost-card.component';
import { SearchModalService } from '../search-modal/search-modal.service';
import { Subject } from 'rxjs';

interface MockModel {
  foo: string;
}

describe('CostCardComponent', () => {
  let component: CostCardComponent<MockModel>;
  let fixture: ComponentFixture<CostCardComponent<MockModel>>;
  let mockModalService: SearchModalService;
  let mockItem: MockModel;
  let mockModelInstance: NgbModalRef;
  
  beforeEach(async(() => {
    mockItem = { foo: 'foo' };

    mockModelInstance = {
      componentInstance: {
        modalOpened: new Subject(),
        items: null
      },
      result: {
        finally: () => {}
      }
    } as any;

    mockModalService = {
      openAddRemove: jasmine.createSpy('openAddRemove').and.returnValue(mockModelInstance)
    } as any;

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: SearchModalService, useValue: mockModalService }
      ],
      declarations: [CostCardComponent, CustomCurrencyPipe, CreateIdPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent<CostCardComponent<MockModel>>(CostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.debugElement.nativeElement.remove();
  });

  it('should update items in modelInstance when allItems is updated', () => {
    const currentValue = new Array(3).fill(mockItem);
    const changes = { allItems: { currentValue } };
    component.openModal();
    component.ngOnChanges(changes as any);
    expect(mockModelInstance.componentInstance.items).toEqual(currentValue);
  });

  it('should NOT update items in modelInstance if model instance does not exist', () => {
    const currentValue = new Array(3).fill(mockItem);
    const changes = { allItems: { currentValue } };
    component.ngOnChanges(changes as any);
    expect(mockModelInstance.componentInstance.items).toBeNull();
  });

  it('should NOT update items in modelInstance if no change', () => {
    const changes = { foo: { currentValue: 'foo' } };
    component.ngOnChanges(changes as any);
    expect(mockModelInstance.componentInstance.items).toBeNull();
  });

  it('should return true if form object has keys', () => {
    component.form = new FormGroup({
      foo: new FormControl('')
    });
    const result = component.hasItems();
    const expected = true;
    expect(result).toEqual(expected);
  });

  it('should return false if form object has keys', () => {
    component.form = new FormGroup({});
    const result = component.hasItems();
    const expected = false;
    expect(result).toEqual(expected);
  });

  it('should return form item key', () => {
    const item = { key: 'foo', value: new FormControl('') };
    const result = component.trackFormItemsBy(0, item);
    const expected = 'foo';
    expect(result).toEqual(expected);
  });

  it('should return item', () => {
    const item = mockItem;
    const result = component.trackItemsBy(0, item);
    const expected = mockItem;
    expect(result).toEqual(expected);
  });

  it('should return item key with custom getter', () => {
    component.getItemKey = item => item.foo;
    const item = mockItem;
    const result = component.trackItemsBy(0, item);
    const expected = 'foo';
    expect(result).toEqual(expected);
  });

  it('should remove form control', () => {
    component.form = new FormGroup({
      foo: new FormControl('')
    });
    component.removeItem('foo');
    const result = component.form.contains('foo');
    const expected = false;
    expect(result).toEqual(expected);
  });

  it('should remove all form controls', () => {
    component.form = new FormGroup({
      foo: new FormControl(''),
      bar: new FormControl('')
    });
    component.confirmRemoveAll = true;
    component.removeAllItems();
    const result1 = component.form.contains('foo');
    const expected1 = false;
    expect(result1).toEqual(expected1);

    const result2 = component.form.contains('bar');
    const expected2 = false;
    expect(result2).toEqual(expected2);
  });

  it('should open modal', () => {
    const modalOpenedSpy = spyOn(component.modalOpened, 'next');
    component.preventModalOpening = false;

    component.openModal();

    mockModelInstance.componentInstance.modalOpened.next();
    expect(modalOpenedSpy).toHaveBeenCalled();
    expect(mockModalService.openAddRemove).toHaveBeenCalled();
  });

  it('should NOT open modal if preventModalOpening flag is true', () => {
    component.preventModalOpening = true;

    component.openModal();

    expect(mockModalService.openAddRemove).not.toHaveBeenCalled();
  });
});
