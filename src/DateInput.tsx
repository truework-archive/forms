import * as React from 'react'
import { Field, FieldProps, FieldConfig } from 'formik'
import { get, times } from 'lodash'
import styled, { css } from 'styled-components'
import { Box, Icon } from '@truework/ui'

import { getLastDayOfMonth, zeroPadDate } from './utils/date'
import { Label } from './Label'
import MaskedInput from 'react-text-mask'
import { Input, InputProps } from './Input'

export type DateValidationOptions = {
  initialMonth?: number
  initialDay?: number
  initialYear?: number
  minMonth?: number
  minDay?: number
  minYear?: number
  maxMonth?: number
  maxDay?: number
  maxYear?: number
}

export type DateInputSelectProps = {
  hasValue?: boolean
  hasError?: boolean
}

export type DateInputProps = {
  name: string
  label: string // required for a11y
  hasError?: boolean
  onUpdate(date: string): void
} & DateValidationOptions &
  React.InputHTMLAttributes<HTMLSelectElement>

export type DateInputFieldProps = Omit<DateInputProps, 'onUpdate'> &
  Pick<FieldConfig, 'validate'>

const DateInputSelect = styled.select<DateInputSelectProps>(
  ({ theme, hasValue, hasError }) => css`
    appearance: none;
    border: none;
    display: block;
    position: relative;
    font-family: ${theme.fonts.roboto};
    color: ${theme.colors.body};
    font-size: ${theme.fontSizes[1]};
    font-family: ${theme.fonts.mono};
    line-height: ${theme.lineHeights[0]};
    letter-spacing: 0.6px;
    margin: 0;
    min-height: 48px;
    padding: ${theme.space.sm} 8px ${theme.space.sm} 10px;
    text-align: center;
    max-width: 33.333333%;
    background: transparent;
    color: ${hasValue ? theme.colors.body : theme.colors.secondary};
    cursor: pointer;
    z-index: 2;
    transition-property: border-color, color;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;

    &::-ms-expand {
      display: none;
    }
    &:disabled {
      background: transparent;
      color: ${props => props.theme.colors.placeholder};
      cursor: not-allowed;
      & ~ .__border {
        background: ${theme.colors.background};
        cursor: not-allowed;
      }
    }
    &:not(:disabled):active,
    &:not(:disabled):focus,
    &:not(:disabled):hover {
      outline: 0;
      color: ${theme.colors.body};

      & ~ .__bg {
        opacity: 1;
      }
      & ~ .__border {
        border-color: ${hasError ? theme.colors.error : theme.colors.primary};

        div {
          border-color: ${hasError ? theme.colors.error : theme.colors.primary};
          color: ${hasError ? theme.colors.error : theme.colors.primary};
        }
      }
    }
  `
)

const Clear = styled.button(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 12px;
    z-index: 1;
    height: 16px;
    width: 16px;
    margin: auto 0;
    border: 1px solid currentColor;
    border-radius: 16px;
    color: ${theme.colors.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    transition: opacity ${theme.transitionDurations.fast}
      ${theme.transitionTimingFunctions.ease};

    &:hover {
      opacity: 1;
    }
  `
)

/**
 * IMPORTANT
 *
 * this component assumes all values are 1-indexed, even though months are
 * 0-indexed when using a Date constructor
 *
 * keep that in mind when adjusting the external API, and when adjusting the
 * internal date calculation logic: you may need to convert between the two
 */
export function DateInput ({
  name,
  label = 'Date',
  disabled,
  initialMonth = 0,
  initialDay = 0,
  initialYear = 0,
  minMonth = 1,
  minDay = 1,
  minYear = 1980,
  maxMonth = 12,
  maxDay = 31,
  maxYear = 2030,
  hasError,
  onUpdate
}: DateInputProps) {
  const [month, setMonth] = React.useState(initialMonth)
  const [day, setDay] = React.useState(initialDay)
  const [year, setYear] = React.useState(initialYear)

  const maxDaysInMonth = getLastDayOfMonth({
    year: year || 2020,
    month
  })

  React.useEffect(() => {
    if (year && month && day) {
      onUpdate(`${year}-${zeroPadDate(month)}-${zeroPadDate(day)}`)
    } else {
      onUpdate('')
    }
  }, [month, day, year])

  const clear = React.useCallback(() => {
    setMonth(0)
    setDay(0)
    setYear(0)
  }, [setMonth, setDay, setYear])

  return (
    <Box ml='-2px' mr='-2px' p='2px'>
      <Box display='flex' alignItems='center' height='48px' pl='56px'>
        <DateInputSelect
          name={`${name}-month`}
          value={month}
          disabled={disabled}
          onChange={e => {
            setMonth(parseInt(e.target.value, 10))
          }}
          aria-label={`${label}: Month`}
          hasValue={Boolean(month)}
          hasError={hasError}
        >
          <option value='0' disabled>
            mm
          </option>
          {times(maxMonth - minMonth + 1, () => '').map((_, i) => {
            const value = minMonth + i
            return (
              <option key={value} value={value}>
                {zeroPadDate(value)}
              </option>
            )
          })}
        </DateInputSelect>
        <Box
          height='50%'
          width='1px'
          bg={hasError ? 'error' : 'outline'}
          zIndex={2}
          transform='rotate(10deg)'
        />
        <DateInputSelect
          name={`${name}-day`}
          value={day}
          disabled={disabled}
          onChange={e => {
            setDay(parseInt(e.target.value, 10))
          }}
          aria-label={`${label}: Day`}
          hasValue={Boolean(day)}
          hasError={hasError}
        >
          <option value='0' disabled>
            dd
          </option>
          {times(Math.min(maxDay, maxDaysInMonth) - minDay + 1, () => '').map(
            (_, i) => {
              const value = minDay + i
              return (
                <option key={value} value={value}>
                  {zeroPadDate(value)}
                </option>
              )
            }
          )}
        </DateInputSelect>
        <Box
          height='50%'
          width='1px'
          bg={hasError ? 'error' : 'outline'}
          zIndex={2}
          transform='rotate(10deg)'
        />
        <DateInputSelect
          name={`${name}-year`}
          value={year}
          disabled={disabled}
          onChange={e => {
            setYear(parseInt(e.target.value, 10))
          }}
          aria-label={`${label}: Year`}
          hasValue={Boolean(year)}
          hasError={hasError}
        >
          <option value='0' disabled>
            yyyy
          </option>
          {times(maxYear - minYear + 1, n => minYear + n).map(i => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </DateInputSelect>

        {(month || day || year) && (
          <Clear title='Clear' onClick={clear}>
            <Icon name='X' width='12px' height='12px' />
          </Clear>
        )}

        <Box
          className='__bg'
          bg={hasError ? 'error-alpha01' : 'primary-alpha01'}
          position='absolute'
          top='-2px'
          bottom='-2px'
          left='-2px'
          right='-2px'
          zIndex={0}
          borderRadius='6px'
          opacity={0}
          transitionProperty='opacity'
          transitionDuration='fast'
          transitionTimingFunction='ease'
        />
        <Box
          className='__border'
          bg='white'
          border={['1px solid', hasError ? 'error' : 'outline']}
          position='absolute'
          top='0'
          bottom='0'
          left='0'
          right='0'
          zIndex={0}
          borderRadius='4px'
          transitionProperty='border-color'
          transitionDuration='fast'
          transitionTimingFunction='ease'
        >
          <Box
            aria-hidden='true'
            position='absolute'
            top='0'
            left='0'
            display='flex'
            alignItems='center'
            justifyContent='center'
            px='sm'
            height='100%'
            zIndex={0}
            color={hasError ? 'error' : 'secondary'}
            bg={hasError ? '#FDEBF0' : 'background'}
            borderTopLeftRadius='4px'
            borderBottomLeftRadius='4px'
            borderRight={['1px solid', hasError ? 'error' : 'outline']}
            transitionProperty='border-color, color'
            transitionDuration='fast'
            transitionTimingFunction='ease'
          >
            <Icon name='Calendar' />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export function DateInputField ({
  name,
  validate,
  ...rest
}: DateInputFieldProps) {
  return (
    <Field name={name} validate={validate}>
      {({ field, form }: FieldProps) => {
        const hasError = Boolean(get(form, ['errors', name]))
        const [year = '', month = '', day = '']: string[] = (
          field.value || ''
        ).split('-')

        return (
          <DateInput
            name={name}
            {...rest}
            initialMonth={month ? parseInt(month, 10) : undefined}
            initialDay={day ? parseInt(day, 10) : undefined}
            initialYear={year ? parseInt(year, 10) : undefined}
            hasError={hasError}
            onUpdate={date => {
              form.setFieldValue(name, date)
            }}
          />
        )
      }}
    </Field>
  )
}

export function DateInputFieldWithLabel (
  props: { label: string } & DateInputFieldProps
) {
  return (
    <>
      <Label htmlFor={props.name}>{props.label}</Label>
      <DateInputField {...props} />
    </>
  )
}

// Type-in Date Input

const dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]

export function DateInputTypeIn ({
  name,
  hasError,
  onChange,
  onBlur,
  value,
  ...rest
}: InputProps) {
  return (
    <MaskedInput
      name={name}
      mask={dateMask}
      id='date'
      placeholder='mm/dd/yyyy'
      type='text'
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      render={(inputRef, props) => (
        <Input
          name={name}
          ref={inputRef}
          hasError={hasError}
          {...props}
          {...rest}
        />
      )}
    />
  )
}

export function DateInputTypeInField ({ name, ...rest }: InputProps) {
  const validate = React.useCallback((value: string) => {
    if (!value) {
      return 'Required'
    }

    const moment = require('moment')
    const [month, day, year] = value.split('/').map(v => parseInt(v))

    if (year < 1900) {
      return 'The date you entered is not a valid date.'
    }

    const dateIsValid = moment([year, month - 1, day]).isValid()
    if (!dateIsValid) {
      return 'The date you entered is not a valid date.'
    }

    return
  }, [])

  return (
    <Field name={name} validate={validate}>
      {({ field, form }: FieldProps) => {
        const hasError = Boolean(get(form, ['errors', name]))

        return (
          <DateInputTypeIn
            {...field}
            {...rest}
            name={name}
            hasError={hasError}
          />
        )
      }}
    </Field>
  )
}
