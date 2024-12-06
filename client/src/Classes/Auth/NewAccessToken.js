import axios from "axios";

export function getAccessToken() {
    axios
    .post(
      "https://goldfish-app-ebu3p.ondigitalocean.app/api/accessToken",
      {},
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);

      const payload = accessToken.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      localStorage.setItem("Role", role);

    })
    .catch((error) => {
      console.error("Error refreshing access token:", error);

      if (error.response?.status === 422) {
        console.error("Invalid refresh token or session expired.");
        window.location.href = "/Login";
      }

    });
}
