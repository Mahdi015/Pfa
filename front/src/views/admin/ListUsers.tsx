import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { listUsers, deleteUser } from "../../functions/admin";
import { formatDistanceToNow } from "date-fns";
import { Container, Button } from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AddUserModal from "../../components/AddUserModal";
import { fr } from "date-fns/locale";
import EditUserModal from "../../components/EditUserModal";

export default function ListUsers() {
  const [userData, setUserData] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [userToUpdate, setUserToUpdate] = React.useState();

  const getUsersData = async () => {
    const res = await listUsers();
    if (res.data) {
      setUserData(res.data);
    }
  };

  React.useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      field: "fullName",
      headerName: "Nom",
      width: 200,
    },
    {
      field: "created_at",
      headerName: "Date de création",
      width: 200,
      valueGetter: (value: any) => {
        const date = new Date(value);
        return isNaN(date.getTime())
          ? ""
          : formatDistanceToNow(date, { addSuffix: true, locale: fr });
      },
    },
    {
      field: "status",
      headerName: "Statut",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 400,
      renderCell: (params: any) => (
        <div
          style={{
            padding: "0 16px",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            gap: "30px",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleModifier(params.row)}
          >
            Modifier
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteUser(params.row.id)}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    await deleteUser(userId).then(() => {
      getUsersData();
      setIsLoading(false);
    });
  };

  const handleModifier = (row: any) => {
    setUserToUpdate(row);
    setShowUpdateModal(true);
    console.log("Modifier clicked for user ID:", row);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Container
        sx={{ mt: 4, mb: 4 }}
        style={{
          display: "flex",

          justifyContent: "end",
        }}
      >
        <Button
          onClick={() => setShowModal(true)}
          variant="contained"
          endIcon={<PersonAddAltIcon />}
        >
          Ajouter un utilisateur
        </Button>
      </Container>
      <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          loading={isLoading}
          rows={userData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
          getRowId={(row: any) => row.id || row._id}
          disableMultipleRowSelection
          disableRowSelectionOnClick
        />
      </div>
      <AddUserModal
        showModal={showModal}
        setShowModal={setShowModal}
        getUsersData={getUsersData}
        setIsLoading={setIsLoading}
      />
      <EditUserModal
        showUpdateModal={showUpdateModal}
        setShowUpdateModal={setShowUpdateModal}
        getUsersData={getUsersData}
        userToUpdate={userToUpdate}
        setIsLoading={setIsLoading}
      />
    </Container>
  );
}
