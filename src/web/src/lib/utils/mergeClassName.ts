/* eslint-disable import/prefer-default-export */
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const mergeClassName = (...classes: ClassValue[]): string => twMerge(
  clsx(
    classes,
  ),
)
