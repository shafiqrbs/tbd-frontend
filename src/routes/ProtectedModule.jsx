import { Navigate, Outlet } from "react-router-dom";
import useDomainConfig from "../components/global-hook/config-data/useDomainConfig.js";
import { useNetwork, useViewportSize } from "@mantine/hooks";

export default function ProtectedModule({ modules }) {
	const domainConfig = JSON.parse(localStorage.getItem("domain-config-data") || "{}");
	const { height } = useViewportSize();
	const networkStatus = useNetwork();
	const headerHeight = 42;
	const footerHeight = 58;
	const padding = 0;
	const mainAreaHeight = height - headerHeight - footerHeight - padding;

	const moduleArray = Array.isArray(modules) ? modules : [modules];
	if (!moduleArray.some(module => domainConfig?.modules?.includes(module))) {
		console.log("redirect to login from ProtectedModule");
		return <Navigate to="/" replace />;
	}
	return <Outlet context={{ isOnline: networkStatus.online, mainAreaHeight }} />;
}
