import React from 'react'
import { withA11y } from '@storybook/addon-a11y'

import Game from '.'

export default {
  title: 'Components / Organisms / Game',
  decorators: [withA11y],
}

export const Default = () => <Game />
