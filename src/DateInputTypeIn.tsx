import * as React from 'react'
import { Label } from './Label'
import styled, { css } from 'styled-components'
import { Box, Icon } from '@truework/ui'
import { Field, FieldProps } from 'formik'

const Input = styled.input(
  ({ theme }) => css`
    font-family: ${theme.fonts.roboto};
    color: ${theme.colors.body};
    font-size: ${theme.fontSizes[1]};
    font-family: ${theme.fonts.mono};
    line-height: ${theme.lineHeights[0]};
    letter-spacing: 0.6px;
    border: none;
    border-width: 0;
    outline: none;

    ::-webkit-calendar-picker-indicator {
      display: none;
    }
  `
)

export function DateInputTypeIn ({
  name,
  hasError = false
}: {
  name: string
  hasError?: boolean
}) {
  return (
    <Box display='flex' alignItems='center' minHeight='48px'>
      <Box zIndex={2} ml='56px' my='auto'>
        <Input
          type='date'
          name={name}
          min='1900-01-01'
          max='2025-12-31'
          placeholder=''
        />
      </Box>

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
  )
}

export function DateInputTypeInField ({ name }: { name: string }) {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        return <DateInputTypeIn name={name} />
      }}
    </Field>
  )
}

export function DateInputTypeInFieldWithLabel ({
  name,
  label
}: {
  name: string
  label: string
}) {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <DateInputTypeInField name={name} />
    </>
  )
}
