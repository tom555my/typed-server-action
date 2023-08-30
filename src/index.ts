import { z } from 'zod';

type ErrMsg = {
	key: string;
	errMsg: string;
};

export type ServerReturnType<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			errMsgs: ErrMsg[];
	  };

export const serverActionResult = {
	success: <T extends any>(data: T) => {
		return {
			success: true,
			data,
		} as const;
	},
	fail: (errMsgs: ErrMsg[]) => {
		return {
			success: false,
			errMsgs,
		} as const;
	},
};

export type ServerActionFunc<S extends ReturnType<typeof z.object>, T extends any> = (
	data: z.infer<S>,
) => Promise<ServerReturnType<T>>;

export function typedServerAction<S extends ReturnType<typeof z.object>, T extends any>(
	schema: S,
	func: ServerActionFunc<S, T>,
) {
	return async (formData: FormData) => {
		const parsedResult = schema.safeParse(formData);
		if (!parsedResult.success) {
			return serverActionResult.fail(
				parsedResult.error.issues.map((issue) => ({
					key: issue.path.join('.'),
					errMsg: issue.message,
				})),
			);
		}
		const result = await func(parsedResult.data);
		return result;
	};
}
