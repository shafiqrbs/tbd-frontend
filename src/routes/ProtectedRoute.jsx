import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ roles, children }) {
	const userInfo = JSON.parse(localStorage.getItem("user") || "{}");

	if (userInfo?.access_control_role?.includes("role_domain")) {
		return children;
	}

	const hasRequiredRole = roles.some((role) => userInfo?.access_control_role?.includes(role));

	if (!hasRequiredRole) {
		return <Navigate to="/" replace />;
	}

	return children;
}
