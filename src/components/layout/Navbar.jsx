import React  from 'react'
import {NavLink} from '@mantine/core'
import {
    IconGauge,
} from '@tabler/icons-react';
import {useNavigate} from "react-router-dom";
import DashBoard from "../modules/sample-module/DashBoard";

function Navbar() {
    const navigate = useNavigate()

  return (
<>
      <NavLink
          href="#required-for-focus"
          label="Inventory"
          leftSection={<IconGauge size="1rem" stroke={1.5} />}
          childrenOffset={28}
      >
          <NavLink href="sample" label="sample" component={"DashBoard"} onClick={(e)=>{navigate('sample')}}  />
      </NavLink>

    </>
  )
}

export default Navbar