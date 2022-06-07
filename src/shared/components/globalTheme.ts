import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

const getDesignTokens = (mode: PaletteMode) => ({
	palette: {
		mode,
		...(mode === 'light'
			? {
					primary: {
						main: '#00BCD4',
						light: '#B2EBF2',
						dark: '#0097A7',
						contrastText: '#FFFFFF',
					},
					secondary: {
						main: '#f50057',
					},
					text: {
						primary: '#212121',
						secondary: '#757575',
					},
					divider: '#BDBDBD',
			  }
            //   TODO: Implement dark design
			: {
					primary: {
						main: '#00BCD4',
						light: '#B2EBF2',
						dark: '#0097A7',
						contrastText: '#FFFFFF',
					},
					secondary: {
						main: '#f50057',
					},
					text: {
						primary: '#212121',
						secondary: '#757575',
					},
					divider: '#BDBDBD',
			  }),
	},
});

export const defaultTheme = createTheme(getDesignTokens('light'));
