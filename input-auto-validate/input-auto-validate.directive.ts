import {
  Directive,
  HostListener,
  Input,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
  OnChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appInputAutoValidate]'
})
export class InputAutoValidateDirective implements AfterViewInit, OnChanges {
  @Input('appInputAutoValidate')
  regExp: 'commonDecimalInput' | 'currencyDecimalInput' | 'dCode' | 'commonDigitInput';

  @Input()
  commonDigitInputMax = 3;

  public regExps = {
    'commonDecimalInput': /^\$?(\d{0,5})?(\.\d{0,2})?$/,
    'currencyDecimalInput': /^\$?(\d{0,8})?(\.\d{0,2})?$/,
    'additionalCostsCurrency': /^-?\$?(\d{0,8})?$/,
    'dCode': /^[Dd][A-z0-9]{0,5}[0-9]{0,5}$/,
    'commonDigitInput': /^[0-9]{0,3}$/
  };

  public prevVal: string;

  constructor(private elem: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    // must store initial input value in case the very first input
    // they do is invalid and it has to revert value
    this.prevVal = this.elem.nativeElement.value;
  }

  ngOnChanges(_: SimpleChanges) {
    if (this.regExp === 'commonDigitInput') {
      this.commonDigitInputMax = this.commonDigitInputMax ? this.commonDigitInputMax : 3;
      this.regExps.commonDigitInput = new RegExp(`^[0-9]{0,${this.commonDigitInputMax}}$`);
    }
  }

  @HostListener('input', ['$event'])
  oninput(e: KeyboardEvent) {
    const htmlEl = e.target as HTMLInputElement;
    const val = htmlEl.value;
    const isValid = htmlEl.validity.valid || this.elem.nativeElement.value === '';
    if (this.regExp === 'commonDecimalInput' && val === '') {
      return;
    }

    if (isValid && (val === '' || this.regExps[this.regExp].test(val))) {
      this.prevVal = val;
    } else {
      this.renderer.setProperty(htmlEl, 'value', this.prevVal);
      htmlEl.dispatchEvent(new Event('input'));
    }
  }

  @HostListener('blur', ['$event'])
  onblur(e: any) {
    e.target.value = (this.regExp === 'dCode') ? e.target.value.toUpperCase() : e.target.value;
  }
}
