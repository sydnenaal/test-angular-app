import * as XLSX from 'xlsx'

import { Injectable } from '@angular/core'

export interface XLSXRowData {
  [key: string]: string
}

interface ParseFileSettersCB {
  setData: (value: XLSXRowData[]) => void
  setColumns: (value: string[]) => void
}

const fileParseOptions: XLSX.Sheet2JSONOpts = { header: 'A', raw: true, range: 10 }

@Injectable({ providedIn: 'root' })
export class XSLXFileService {
  constructor() {}

  parseFile(file: File, { setData, setColumns }: ParseFileSettersCB) {
    const reader: FileReader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryString: Maybe<string | ArrayBuffer> = e.target?.result
      const workBook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' })

      const [SheetName] = workBook.SheetNames
      const workSheet: XLSX.WorkSheet = workBook.Sheets[SheetName]

      const tableData = XLSX.utils.sheet_to_json<XLSXRowData>(workSheet, fileParseOptions)

      setData(tableData)
      setColumns(this.findColumns(tableData))
    }

    reader.readAsBinaryString(file)
  }

  private findColumns(tableData: XLSXRowData[]): string[] {
    return tableData.reduce<string[]>((acc, item) => {
      const keys = Object.keys(item)

      return keys.length > acc.length ? keys : acc
    }, [])
  }
}
