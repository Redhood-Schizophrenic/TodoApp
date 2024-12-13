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

		const result = await usersCrud.loginUser({ email, password });
		return result;
	} catch (error) {
		return {
			returncode: 500,
			message: error.message,
			output: []
		};
	}
};
