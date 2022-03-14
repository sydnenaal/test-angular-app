import { Component, ViewChild, AfterViewInit } from '@angular/core'

import { MatSort } from '@angular/material/sort'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'

import { XSLXFileService, LogicFilterService } from './services'

import type { XLSXRowData } from './services/xlsx-file'

@Component({
  selector: 'app-page-table',
  templateUrl: './page-table.component.html',
  styleUrls: ['./page-table.component.scss'],
  providers: [XSLXFileService],
})
export class PageTableComponent implements AfterViewInit {
  constructor(private XLSXfileService: XSLXFileService, private LogicFilterService: LogicFilterService) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  error: string = ''
  inputAccept: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  // TODO: Find better solution
  cache: any = []

  displayedColumns: string[] = []
  dataSource = new MatTableDataSource<XLSXRowData>([])

  setTableData = (data: XLSXRowData[]) => {
    this.dataSource = new MatTableDataSource<XLSXRowData>(data)

    // TODO: find better solution
    // Set pagination by next macro task
    this.cache = data
    setTimeout(() => (this.dataSource.paginator = this.paginator), 0)
  }

  setTableColumns = (columns: string[]) => (this.displayedColumns = columns)

  announceSortChange() {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value

    if (!filterValue) {
      this.dataSource = new MatTableDataSource<XLSXRowData>(this.cache)
      return
    }

    const cond = this.LogicFilterService.parseInputCondition(filterValue)
    const newData = this.cache.filter((item: any) => this.LogicFilterService.isCondEqual(item, cond))

    this.dataSource = new MatTableDataSource<XLSXRowData>(newData)

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  incomingfile(event: any) {
    const target: DataTransfer = <DataTransfer>event.target

    if (target.files.length > 1) this.error = 'Выберите только один файл'
    if (!target.files[0].name.endsWith('.xlsx')) this.error = 'Невалидный тип файла'

    if (this.error) return

    this.XLSXfileService.parseFile(target.files[0], {
      setData: this.setTableData,
      setColumns: this.setTableColumns,
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }
}
