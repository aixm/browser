import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent }                                                           from '@angular/material/paginator';
import { MtxGrid, MtxGridColumn }  from '@ng-matero/extensions/grid';
import { Subscription }     from 'rxjs';
import { ApiResponse } from '../../../models/api-response';
import { AuthService }                                                                       from '../../../services/auth.service';

@Component({
  selector: 'app-base-grid',
  template: '',
  styleUrls: []
})
export class BaseGridComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid!: MtxGrid;
  public authService!: AuthService;
  loading: boolean = false;
  gridName: string = 'GRID';
  columns: MtxGridColumn[] = [];
  defaultColumns: MtxGridColumn[] = [];
  pageEvent: PageEvent = new PageEvent();
  pageSizeOptions: number[] = [10, 25, 50, 100];
  searchText: string='';
  rowSelected: any[] = [];
  subscriptions: Subscription[] = [];
  columnMenuHeaderText: string = 'Grid columns tuning';

  constructor() {
    this.authService = inject(AuthService);
  }

  ngOnInit(): void {
    // TODO read previously saved columns for grid
    this.columns = this.defaultColumns;
    this.subscriptions.push(this.authService.currentUser?.subscribe((): void => {this.refresh()}));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void =>{
      subscription.unsubscribe();
    });
  }

  refresh(): void {
  }

  closeMenu(): void {
    this.grid.columnMenu.menuTrigger.closeMenu();
  }

  storePageState(data: ApiResponse): void {
    this.pageEvent.pageSize = data.meta.pagination.perPage;
    this.pageEvent.length = data.meta.pagination.total;
  }

  handlePageEvent(event: PageEvent): void {
    this.pageEvent = event;
    console.log(this.pageEvent);
    this.refresh();
  }

  getPageSearchUrl(): string {
    return `per_page=${this.pageEvent.pageSize ? this.pageEvent.pageSize : 10}&page=${
        this.pageEvent.pageIndex ? this.pageEvent.pageIndex + 1: 1}` + (this.searchText ? '&search=' + this.searchText : '');
  }

}
