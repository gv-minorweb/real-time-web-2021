import React from 'react'
import { withA11y } from '@storybook/addon-a11y'

import Ticker from '.'

export default {
  title: 'Components / Atoms / Ticker',
  decorators: [withA11y],
}

export const Default = () => <Ticker />
