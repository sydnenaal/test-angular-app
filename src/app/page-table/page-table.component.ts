import { Component, OnInit } from '@angular/core'
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-page-table',
  templateUrl: './page-table.component.html',
  styleUrls: ['./page-table.component.scss'],
})
export class PageTableComponent implements OnInit {
  constructor() {}

  data: any

  error: string = ''
  inputAccept: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  incomingfile(event: any) {
    const target: DataTransfer = <DataTransfer>event.target
    const reader: FileReader = new FileReader()

    if (target.files.length > 1) {
      this.error = 'Выберите только один файл'
      return
    }

    if (!target.files[0].name.endsWith('.xlsx')) {
      this.error = 'Невалидный тип файла'
      return
    }

    reader.onload = (e: any) => {
      const bstr: string = e.target.result
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })

      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]

      this.data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, range: 10 })

      const ws2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]]

      this.readDataSheet(ws2, 10)
    }

    reader.readAsBinaryString(target.files[0])
  }

  private readDataSheet(ws: XLSX.WorkSheet, startRow: number) {
    let datas = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, range: startRow })
    datas = datas.slice(1)

    for (let i = 0; i < this.data.length; i++) {
      this.data[i][this.data[0].length] = datas.filter((x: any) => x[12] == this.data[i][0])
    }

    console.log(this.data)
  }

  ngOnInit(): void {}
}
