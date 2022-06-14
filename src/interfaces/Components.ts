export interface IAutoHideAlert {
	isOpen: boolean;
	onCloseHandler?: any;
	alertMsg: string;
	severity: 'error' | 'warning' | 'success';
	autoHideDuration: number;
}