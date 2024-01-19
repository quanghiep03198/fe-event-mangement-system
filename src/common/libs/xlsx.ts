import _ from 'lodash'
import * as XLSX from 'xlsx'

export class Excel<T> {
   /**
    *  @description Object to define names of columns for each property of object in array data
    */
   public columnDef

   constructor(columnDef: Record<keyof T, string>) {
      this.columnDef = columnDef
   }

   /** @description Convert to excel data  */
   public mapExcelData = (data: any[][]) => {
      const columnNames = data[0]
      const mappedExcelData = data.slice(1).map((array) =>
         array.reduce((object, value, i) => {
            const key = _.findKey(this.columnDef, (val) => val === columnNames[i])!
            object[key] = value
            return object
         }, {})
      )
      return mappedExcelData
   }

   /**
    *  @description Convert to array object data
    */
   public convertToExcelData = (data: Array<T>) => {
      const columnNames = Object.values(this.columnDef)
      const filteredData = data.map((item) => {
         const filteredItem: Record<string, unknown> = {}
         columnNames.forEach((columnName) => {
            const matchedKey = Object.keys(this.columnDef).find((k) => this.columnDef[k as keyof typeof this.columnDef] === columnName)
            filteredItem[columnName as string] = item[matchedKey as keyof T]
         })
         return filteredItem
      })
      return filteredData
   }

   /**
    * @description Handling import from xlsx file
    */
   public importFile = (file: File, callback?: (arg: Array<Record<string, unknown>>) => unknown) => {
      const reader = new FileReader()
      reader.onload = (e) => {
         /* Mapping data */
         const workbook = XLSX.read(e.target?.result, { type: 'binary' })
         const worksheet = workbook.Sheets[workbook.SheetNames[0]]
         const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]
         const mappedSheetData = this.mapExcelData(data.filter((row) => row.length > 0))
         /* Excute callback after importing file */
         if (callback && typeof callback === 'function') {
            callback(mappedSheetData)
         }
      }
      reader.readAsBinaryString(file)
   }

   /**
    * @description Handling export array data to xlsx file
    */
   public exportData = ({ fileName, data }: { fileName: string; data: Record<string, unknown>[] }) => {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'SheetJS')
      /* Generate XLSX file and send to client */
      return XLSX.writeFile(workbook, fileName + '.xlsx', {
         cellStyles: true
      })
   }
}
