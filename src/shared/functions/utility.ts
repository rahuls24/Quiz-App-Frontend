export function formatAuthErrorMsg(error: any) {
	if (error?.data?.error) return error?.data?.error;
	return 'Something went wrong.';
}