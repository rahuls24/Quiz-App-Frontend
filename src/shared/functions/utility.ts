export function formatAuthErrorMsg(error: any) {
    if (error?.data?.error) return error?.data?.error;
    return 'Something went wrong.';
}

export function isNonEmptyString(str: string) {
    return str.trim().length > 0;
}

export function getAutoHideRequiredProps() {}
