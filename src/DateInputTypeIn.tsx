import * as React from 'react'
import { Icon } from '@truework/ui'
import { Input } from './Input'

function maskVal (val: string, placeholder: string, length: number) {
  const parseVal = val ? val.replace(/\D/g, '') : ''
  let output = parseVal

  for (let i = output.length; i < length; i++) {
    output += placeholder
  }

  return output
}

export function DateInputTypeIn ({ name }: { name: string }) {
  const [inputVal, setInputVal] = React.useState<string>('mm/dd/yyyy')

  return (
    <>
      <Input
        name={name}
        onChange={e => {
          const val = e.target.value

          const prevMonth = inputVal.split('/')[0]
          const prevDate = inputVal.split('/')[1]
          const prevYear = inputVal.split('/')[2]

          const currMonth = val.split('/')[0]
          const currDate = val.split('/')[1]
          const currYear = val.split('/')[2]

          const newMonth =
            prevMonth === currMonth ? currMonth : maskVal(currMonth, 'm', 2)
          const newDate =
            prevDate === currDate ? currDate : maskVal(currDate, 'd', 2)
          const newYear =
            prevYear === currYear ? currYear : maskVal(currYear, 'y', 4)

          setInputVal(newMonth + '/' + newDate + '/' + newYear)
          e.target.value = inputVal
          console.log(inputVal)
        }}
        placeholder='mm/dd/yyyy'
        preTab={<Icon name='Calendar' />}
      />
    </>
  )
}

export function DateInputTypeInField () {}

export function DateInputTypeInFieldWithLabel () {}
