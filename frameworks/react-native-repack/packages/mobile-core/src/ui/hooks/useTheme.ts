import {configureFonts, useTheme as usePaperTheme} from 'react-native-paper';

import {colors} from '../';
import fontConfig from './fontConfig.ts';

export const useTheme = () => {
  const theme = usePaperTheme();

  return {
    ...theme,
    colors: {
      ...theme.colors,
      ...colors.theme,
    },
    fonts: configureFonts({config: fontConfig}),
  };
};
