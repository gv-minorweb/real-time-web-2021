import React from 'react'
import { withA11y } from '@storybook/addon-a11y'

import Button from '.'

export default {
  title: 'Components / Atoms / Button',
  decorators: [withA11y],
}

export const Default = () => <Button />
