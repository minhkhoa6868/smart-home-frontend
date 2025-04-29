import axios from "axios";
import { useEffect } from "react";

const useFetch = (deviceId: string, setDeviceState: (state: any) => void) => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDeviceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/device/${deviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDeviceState(response.data.status); // Set the state based on the response
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchDeviceData();
  }, [deviceId, setDeviceState]);
};

export default useFetch;
