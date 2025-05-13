import { Navigate, Outlet } from "react-router-dom";
import getDomainConfig from "../components/global-hook/config-data/getDomainConfig.js";
import { useNetwork, useViewportSize } from "@mantine/hooks";

export default function ProtectedModule({ modules }) {
	const { domainConfig } = getDomainConfig();
	const { height } = useViewportSize();
	const networkStatus = useNetwork();

	const moduleArray = Array.isArray(modules) ? modules : [modules];

	if (!moduleArray.some(module => domainConfig?.modules?.includes(module))) {
		return <Navigate to="/" replace />;
	}

	return <Outlet context={{ isOnline: networkStatus.online, mainAreaHeight: height }} />;
}
