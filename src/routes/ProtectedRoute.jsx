import { Navigate, Outlet } from "react-router-dom";
import getDomainConfig from "../components/global-hook/config-data/getDomainConfig.js";
import { useNetwork, useViewportSize } from "@mantine/hooks";

export default function ProtectedRoute({ module }) {
	const { domainConfig } = getDomainConfig();
	const { height } = useViewportSize();
	const networkStatus = useNetwork();

	if (!domainConfig?.modules?.includes(module)) {
		return <Navigate to="/" replace />;
	}

	return <Outlet context={{ isOnline: networkStatus.online, mainAreaHeight: height }} />;
}
