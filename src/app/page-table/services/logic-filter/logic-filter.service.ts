import { Injectable } from '@angular/core'

interface ConditionDataItem {
  id: 'AND' | 'OR'
  cond: string[]
}

@Injectable({ providedIn: 'root' })
export class LogicFilterService {
  parseInputCondition(cond: string): ConditionDataItem[] {
    const parsedCond = cond
      .trim()
      .replace(/(AND)|(OR)/g, '\\$&\\')
      .split('\\')
      .map((item) => item.trim())

    const resultCondData: ConditionDataItem[] = [{ id: 'AND', cond: [] }]

    return parsedCond.reduce((acc, item) => {
      if (!item) return acc

      if (item !== 'AND' && item !== 'OR') {
        const lastItem = acc[acc.length - 1]

        if (!/Column (.+) = (.+)/g.test(item)) throw new Error('Не валидная строка')

        const [, column, value] = /Column (.+) = (.+)/.exec(item) || []
        lastItem.cond = [column, value]
      } else acc.push({ id: item, cond: [] })

      return acc
    }, resultCondData)
  }

  isCondEqual<T extends { [key: string]: string }>(data: T, condData: ConditionDataItem[]): boolean {
    console.log(condData)

    const conditions = condData.reduce<string[][][]>(
      (acc, { id, cond }) => {
        if (id === 'AND') acc[acc.length - 1].push(cond)
        else if (id === 'OR') acc.push([cond])

        return acc
      },
      [[]]
    )

    for (let cond of conditions) {
      const isEqual = cond.every(([key, value]) => {
        const dataValue = data[key]?.toString().toLocaleLowerCase()
        const stringifyValue = value.toString().toLocaleLowerCase()

        return dataValue === stringifyValue
      })

      if (isEqual) return true
    }

    return false
  }
}
