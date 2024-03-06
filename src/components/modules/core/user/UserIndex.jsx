import React from "react";
import {Grid} from "@mantine/core";
import {useSelector} from "react-redux";
import UserTable from "./UserTable.jsx";
import UserForm from "./UserForm.jsx";
import UserUpdateForm from "./UserUpdateForm.jsx";

function UserIndex() {
    const insertType = useSelector((state) => state.crudSlice.insertType)
    return (
        <div>
            <Grid>
                <Grid.Col span={8}>
                    <UserTable/>
                </Grid.Col>
                <Grid.Col span={4}>
                    {
                        insertType === 'create'?<UserForm/>:<UserUpdateForm />
                    }

                </Grid.Col>
            </Grid>
        </div>
    );
}

export default UserIndex;
