import usersCrud from "@/app/lib/crud/users";

export const login = async (data) => {
	try {
		const email = data['email'] || null;
		const password = data['password'] || null;

		if (email === null || password === null) {
			return {
				returncode: 400,
				message: "Missing required parameters",
				output: []
			};
		}

		return await usersCrud.loginUser({ email, password });
		// if (!syncService.isOnline) {
		// 	return await usersOfflineCrud.loginUser({ email, password })
		// } else {
		// 	return await usersCrud.loginUser({ email, password });
		// }
	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		};
	}
};
