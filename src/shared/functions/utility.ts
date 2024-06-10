import { Bounce, toast, TypeOptions } from 'react-toastify';

export function formatAuthErrorMsg(error: any) {
  if (error?.data?.error) return error?.data?.error;
  return 'Something went wrong.';
}

export function isNonEmptyString(str: string) {
  return str.trim().length > 0;
}

export function getErrorText(error: any): string {
  return typeof error?.data?.error === 'string'
    ? error?.data?.error
    : 'Something went wrong';
}

export function showToast(errorText: string, type: TypeOptions) {
  const options = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  };
  switch (type) {
    case 'success':
      toast.success(errorText, options);
      break;
    case 'error':
      toast.error(errorText, options);
      break;
    case 'info':
      toast.info(errorText, options);
      break;
    case 'warning':
      toast.warning(errorText, options);
      break;
    default:
      toast(errorText, options);
  }
}
