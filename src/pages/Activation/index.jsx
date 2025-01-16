import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { activateUser } from "./api";

export function Activation() {
  const { token } = useParams();
  const [apiProgress, setApiProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function activate() {
      setApiProgress(true);
      try {
        const response = await activateUser(token);
        console.log("Axios response: ", response);
        setSuccessMessage(response.data.message);
        console.log("Success message updated: ", response.data.message);
      } catch (axiosError) {
        console.log("Error response: ", axiosError.response);
        setErrorMessage(
          axiosError.response?.data?.message || "Unexpected error"
        );
      } finally {
        setApiProgress(false);
      }
    }
    activate();
  }, [token]);

  return (
    <>
      {apiProgress && (
        <span className="spinner-border" aria-hidden="true"></span>
      )}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </>
  );
}
