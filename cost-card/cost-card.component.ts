import { KeyValue } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppFormDictionary } from '@shared/forms';
import { SearchModalService } from '../search-modal/search-modal.service';
import { AddRemoveSearchModalComponent } from '@simpleComponents/search-modal/add-remove/add-remove.component';

@Component({
  selector: 'app-cost-card',
  templateUrl: './cost-card.component.html',
  styleUrls: ['./cost-card.component.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: 0 })),
      state('false', style({ height: '*' })),
      transition('true <=> false', animate('300ms'))
    ])
  ]
})
export class CostCardComponent<T> implements OnChanges {
  @Input()
  public sectionTitle: string;

  @Input()
  public title: string;

  @Input()
  public canAddRemoveItems: boolean;

  @Input()
  public totalSum: number;

  @Input()
  public allItems: T[];

  @Input()
  public getItemKey: (item: T) => string;

  @Input()
  public getItemName: (item: T) => string;

  @Input()
  public getItemCode: (item: T) => string;

  @Input()
  public form: FormGroup | AppFormDictionary<any, any>;

  @Input()
  public disableFilter = false;

  @Input()
  public addCustomTemplate: TemplateRef<any>;

  @Input()
  public addCustomForm: FormGroup;

  @Input()
  public customAddedName: string;

  @Input()
  public preventModalOpening: boolean;

  @Input()
  public readonly = false;

  @Input()
  public isLoadingMoreItems = false;

  @Input()
  public sorter: (a: KeyValue<string, AbstractControl>, b: KeyValue<string, AbstractControl>) => number;

  @Input()
  public pagination = false;

  @Output()
  public itemAdded = new EventEmitter<T>();

  @Output()
  public modalOpened = new EventEmitter<void>();

  @Output()
  public modalClosed = new EventEmitter<void>();

  @Output()
  public customItemAdded = new EventEmitter<void>();

  @Output()
  public customModalClosed = new EventEmitter<void>();

  @Output()
  public requestMoreItems = new EventEmitter<void>();

  @Output()
  public cancelSearch = new EventEmitter<void>();

  @Output()
  public searchText = new EventEmitter<string>();

  @ContentChild('cardItemContent', { static: false })
  public itemContentTemplate: TemplateRef<any>;

  public isTotalCollapsed = true;
  public confirmRemoveAll = false;

  @Output()
  public customModalSubmit = new EventEmitter<boolean>();

  private modalInstance: NgbModalRef;

  constructor(
    private searchModalService: SearchModalService
  ) {}

  @Input()
  public clearAllLineitems = () => {
    Object.keys(this.form.controls).forEach(key => {
      this.form.removeControl(key);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.modalInstance && changes.allItems) {
      this.modalInstance.componentInstance.items = changes.allItems.currentValue;
    }
  }

  public hasItems(): boolean {
    return Object.keys(this.form.controls).length > 0;
  }

  public trackFormItemsBy(index: number, item: { key: string; value: FormControl }): string {
    return item.key;
  }

  public trackItemsBy(index: number, item: T): string | T {
    return this.getItemKey ? this.getItemKey(item) : item;
  }

  public removeItem(key: string): void {
    this.form.removeControl(key);
  }

  public removeAllItems(): void {
    if (this.confirmRemoveAll) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.removeControl(key);
      });

      this.confirmRemoveAll = false;
    } else {
      this.confirmRemoveAll = true;
    }
  }

  public openModal(): void {
    if (this.preventModalOpening) {
      this.modalOpened.next();
      return;
    }

    this.modalInstance = this.searchModalService.openAddRemove(
      this.title,
      this.allItems || [],
      this.getItemName || this.getItemKey,
      this.getItemCode,
      item => !!this.form.controls[this.getItemKey(item)],
      item => this.itemAdded.next(item),
      item => this.removeItem(this.getItemKey(item)),
      this.addCustomTemplate,
      this.addCustomForm,
      () => this.customAddedName,
      () => this.customItemAdded.next(),
      () => this.customModalClosed.next(),
      (submitted: boolean) => this.customModalSubmit.next(submitted),
      this.disableFilter,
      () => this.requestMoreItems.emit(),
      () => this.cancelSearch.emit(),
      (text: string) => this.searchText.emit(text),
      true
    );

    const instance = this.modalInstance.componentInstance as AddRemoveSearchModalComponent<T>;

    instance.modalOpened.subscribe(() => this.modalOpened.next());

    // the NgbModalRef is destroyed whenever the modal is closed, so we don't want to hang on to a reference to
    // a destroyed object
    this.modalInstance.result.finally(() => {
      this.modalClosed.emit();
      this.modalInstance = null;
    });
  }
}
