import usersCrud from "@/app/lib/crud/users";
// import usersOfflineCrud from "@/app/lib/offline_crud/users";
// import syncService from "@/app/lib/services/syncService";

export const register = async (data) => {
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

		return await usersCrud.registerUser({ email, password });
		//
		// if (!syncService.isOnline) {
		// 	return await usersOfflineCrud.registerUser({ email, password });
		// } else {
		// 	return await usersCrud.registerUser({ email, password });
		// }
	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		};
	}
};
