import { AutoHideAlertProps, AutoHideAlertSeverity } from '@Type/Quiz';

export function formatAuthErrorMsg(error: any) {
    if (error?.data?.error) return error?.data?.error;
    return 'Something went wrong.';
}

export function isNonEmptyString(str: string) {
    return str.trim().length > 0;
}

export function getAutoHideRequiredProps(
    isOpen?: boolean,
    alertMsg?: string,
    severity?: AutoHideAlertSeverity,
    autoHideDuration?: number
) {
    let autoHideAlertProps: AutoHideAlertProps = {
        isOpen: isOpen ?? false,
        alertMsg: alertMsg ?? '',
        severity: severity ?? 'error',
        autoHideDuration: autoHideDuration ?? 4000,
    };
    return autoHideAlertProps;
}
