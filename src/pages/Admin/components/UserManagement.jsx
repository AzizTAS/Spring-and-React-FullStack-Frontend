import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUsers, updateUserRole, deleteUser } from "./api";
import { Spinner } from "@/shared/components/Spinner";
import { useToast } from "@/shared/components/Toast";
import { useAuthState } from "@/shared/state/context";

export function UserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState({ content: [], page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const authState = useAuthState();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (page = 0) => {
    setLoading(true);
    try {
      const response = await getUsers(page);
      setUsers(response.data);
    } catch (err) {
      addToast(t("failedLoadUsers"), "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === authState.id) {
      addToast(t("cannotChangeOwnRole"), "warning");
      return;
    }
    try {
      await updateUserRole(userId, newRole);
      addToast(t("userRoleUpdated"), "success");
      fetchUsers(users.number);
    } catch (err) {
      addToast(err.response?.data?.message || t("failedUpdateRole"), "danger");
    }
  };

  const handleDelete = async (userId) => {
    if (userId === authState.id) {
      addToast(t("cannotDeleteYourself"), "warning");
      return;
    }
    if (!window.confirm(t("confirmDeleteUser"))) {
      return;
    }
    try {
      await deleteUser(userId);
      addToast(t("userDeleted"), "success");
      fetchUsers(users.number);
    } catch (err) {
      addToast(err.response?.data?.message || t("failedDeleteUser"), "danger");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">👥 {t("userManagement")}</h5>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center"><Spinner /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t("image")}</th>
                  <th>{t("username")}</th>
                  <th>{t("email")}</th>
                  <th>{t("role")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.content?.map((user) => (
                  <tr key={user.id} className={user.id === authState.id ? "table-info" : ""}>
                    <td>{user.id}</td>
                    <td>
                      {user.image ? (
                        <img
                          src={`/assets/profile/${user.image}`}
                          alt={user.username}
                          style={{ width: "35px", height: "35px", objectFit: "cover" }}
                          className="rounded-circle"
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                          style={{ width: "35px", height: "35px" }}
                        >
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td>
                      {user.username}
                      {user.id === authState.id && (
                        <span className="badge bg-info ms-2">{t("you")}</span>
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={user.role || "USER"}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === authState.id}
                        style={{ width: "100px" }}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === authState.id}
                        title={user.id === authState.id ? t("cannotDeleteYourself") : t("deleteUser")}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {users.totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${users.first ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => fetchUsers(users.number - 1)}
                  disabled={users.first}
                >
                  {t("previous")}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {users.number + 1} / {users.totalPages}
                </span>
              </li>
              <li className={`page-item ${users.last ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => fetchUsers(users.number + 1)}
                  disabled={users.last}
                >
                  {t("next")}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
