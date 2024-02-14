import React  from 'react'
import {NavLink} from '@mantine/core'
import {
    IconGauge,
} from '@tabler/icons-react';
import {useNavigate} from "react-router-dom";
import DashBoard from "../modules/sample-module/DashBoard";
import {useTranslation} from "react-i18next";

function Navbar() {
    const navigate = useNavigate()
    const {t, i18n} = useTranslation();


    return (
<>
      <NavLink
          href="#required-for-focus"
          label="Sample"
          leftSection={<IconGauge size="1rem" stroke={1.5} />}
          childrenOffset={28}
      >
          <NavLink href="sample" label="sample" component={"DashBoard"} onClick={(e)=>{navigate('sample')}}  />
      </NavLink>

        <NavLink
            href="#required-for-focus"
            label={t('MasterData')}
            leftSection={<IconGauge size="1rem" stroke={1.5} />}
            childrenOffset={28}
        >
            <NavLink
                href="sample"
                label={t('Customer')}
                component={"DashBoard"}
                onClick={(e)=>{navigate('master-data/customer')}}
            />
        </NavLink>

    </>
  )
}

export default Navbar