import DashBoard from "../components/modules/sample-module/DashBoard";
import FullForm from "../components/modules/sample-module/FullForm";

const routes = [
    {path: '/', name: 'DashBoard', component: DashBoard},
    {path: '/stock', name: 'Stock', component: FullForm}
]

export default routes