func AuthMiddleware(c *fiber.Ctx) error {
	token := c.Cookies("hotel_auth_token")
	if token == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Unauthorized"})
	}
	// Verify token logic here
	return c.Next()
}