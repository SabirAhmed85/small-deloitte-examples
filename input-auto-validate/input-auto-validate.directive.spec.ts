import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { InputAutoValidateDirective } from './input-auto-validate.directive';

@Component({template: `<input value="" appInputAutoValidate="commonDecimalInput" />`})
class TestInputAutoValidateCommonDecimalComponent {}

@Component({template: `<input value="" appInputAutoValidate="dCode" />`})
class TestInputAutoValidateDCodeComponent {}

@Component({template: `<input value="" appInputAutoValidate="commonDigitInput" />`})
class TestInputAutoValidateCommonDigitComponent {}


describe('Directive: InputAutoValidateDirective', () => {

  describe('with commonDecimalInput regExp', () => {
    let fixture: ComponentFixture<TestInputAutoValidateCommonDecimalComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestInputAutoValidateCommonDecimalComponent, InputAutoValidateDirective]
      });
      fixture = TestBed.createComponent(TestInputAutoValidateCommonDecimalComponent);
      inputEl = fixture.debugElement.query(By.css('input'));
    });

    afterEach(() => {
      fixture.debugElement.nativeElement.remove();
    });

    it('does not accept special characters', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = '**';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('');

      inputEl.nativeElement.value = '55';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('55');
    });

    it('does not accept more than 5 digits before decimal', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = '55555';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('55555');

      inputEl.nativeElement.value = '5555555';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('55555');
    });
    
    it('does not accept more than 2 digits after decimal', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = '55555.55';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('55555.55');

      inputEl.nativeElement.value = '5555555.5555';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('55555.55');
    });
  });

  describe('with dCode regExp', () => {
    let fixture: ComponentFixture<TestInputAutoValidateDCodeComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestInputAutoValidateDCodeComponent, InputAutoValidateDirective]
      });
      fixture = TestBed.createComponent(TestInputAutoValidateDCodeComponent);
      inputEl = fixture.debugElement.query(By.css('input'));
    });

    afterEach(() => {
      fixture.debugElement.nativeElement.remove();
    });

    it('does not accept special characters', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = '**';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('');
    });

    it('does not accept invalid dCode', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = '55555';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('');

      inputEl.nativeElement.value = 'AAAA';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('');
    });
    
    it('does accept valid dCode', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = 'D2345';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('D2345');
    });
  });

  describe('with commonDigitInput regExp', () => {
    
    let fixture: ComponentFixture<TestInputAutoValidateCommonDigitComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestInputAutoValidateCommonDigitComponent, InputAutoValidateDirective]
      });
      fixture = TestBed.createComponent(TestInputAutoValidateCommonDigitComponent);
      inputEl = fixture.debugElement.query(By.css('input'));
    });

    afterEach(() => {
      fixture.debugElement.nativeElement.remove();
    });

    it('does not accept special characters', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = '**';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('');
    });

    it('does accept digits', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = '333';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('333');
    });
    
    it('does not accept more than 3 digits', () => {
      fixture.detectChanges();

      inputEl.nativeElement.value = '333';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('333');

      inputEl.nativeElement.value = '3333';
      inputEl.nativeElement.dispatchEvent(new Event('input'));
      expect(inputEl.nativeElement.value).toBe('333');
    });
  });
});