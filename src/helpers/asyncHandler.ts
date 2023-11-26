const asyncHandler = (fn: Function) => {
    console.log('Async Handler')
	return (req: any, res: any, next: any) => {
		fn(req, res, next).catch(next);
	};
};

export { asyncHandler };
