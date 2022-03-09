import { Component, ViewChild, AfterViewInit } from '@angular/core'

import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'

import { XSLXFileService } from '../services'

import type { XLSXRowData } from '../services/xlsx-file'

@Component({
  selector: 'app-page-table',
  templateUrl: './page-table.component.html',
  styleUrls: ['./page-table.component.scss'],
  providers: [XSLXFileService],
})
export class PageTableComponent implements AfterViewInit {
  constructor(private XLSXfileService: XSLXFileService) {}

  @ViewChild(MatSort, { static: false })
  sort!: MatSort

  error: string = ''
  inputAccept: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  displayedColumns: string[] = []
  dataSource = new MatTableDataSource<XLSXRowData>([])

  setTableData = (data: XLSXRowData[]) => (this.dataSource = new MatTableDataSource<XLSXRowData>(data))

  setTableColumns = (columns: string[]) => (this.displayedColumns = columns)

  announceSortChange() {
    this.dataSource.sort = this.sort
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
    this.dataSource.sort = this.sort
  }
}
