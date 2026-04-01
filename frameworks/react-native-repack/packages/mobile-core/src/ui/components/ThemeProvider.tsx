import React from 'react';

import type {ComponentProps} from 'react';
import {PaperProvider} from 'react-native-paper';

import {useTheme} from '../hooks/useTheme.ts';

type Props = ComponentProps<typeof PaperProvider>;

export const ThemeProvider = ({children}: Props) => {
  const theme = useTheme();

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
};
