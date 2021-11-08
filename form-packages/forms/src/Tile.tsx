import * as React from 'react'
import { Span, Circle } from '@truework/ui'
import styled from 'styled-components'

export type TileProps = {
  name: string
  value: string
  label: string
  icon?: React.ReactElement
  hasError?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

const TileButton = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
`

const TileContent = styled.div<Pick<TileProps, 'hasError'>>(
  ({ theme, hasError }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: ${theme.space.med} ${theme.space.sm};
  color: ${theme.colors.body};
  background-color: ${theme.colors.background};
  border: 1px solid ${hasError ? theme.colors.error : theme.colors.outline};
  border-radius: ${theme.space.xxs};
  transition-property: color, background-color, border-color;
  transition-duration: ${theme.transitionDurations.fast};
  transition-timing-function: ${theme.transitionTimingFunctions.ease};
`
)

const Input = styled.input(
  ({ theme }) => `
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  position: absolute;
  whitespace: nowrap;
  wordwrap: normal;

  &:checked
    ~ ${TileContent},
    &:hover
    ~ ${TileContent},
    &:focus
    ~ ${TileContent} {
    border: 1px solid ${theme.colors.primary};
    background-color: rgba(91, 99, 254, 0.1);
  }

  &:checked ~ ${TileContent} {
    color: ${theme.colors.primary};
  }
`
)

export function Tile ({ icon, label, hasError, ...props }: TileProps) {
  const id = props.name + props.value

  return (
    <TileButton htmlFor={id}>
      <Input id={id} type='radio' {...props} />

      <TileContent hasError={hasError}>
        {icon && (
          <Circle mb='xs' background='white' width='48px' height='48px'>
            {icon}
          </Circle>
        )}

        <Span
          display='flex'
          justifyContent='center'
          minHeight='32px'
          fontSize={0}
          fontWeight={5}
          lineHeight={0}
          width='100%'
        >
          {label}
        </Span>
      </TileContent>
    </TileButton>
  )
}
