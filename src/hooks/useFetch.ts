import axios from "axios";
import { useEffect } from "react";

const useFetch = (deviceId: string, setDeviceState: (state: string) => void) => {
    useEffect(() => {
        const token = localStorage.getItem("token");
    
        const fetchDeviceData = async () => {
          try {
            const response = await axios.get(`https://smart-home-backend-07op.onrender.com/api/device/${deviceId}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            });
    
            setDeviceState(response.data.status); // Set the state based on the response
          } catch (err: any) {
            console.log(err);
          } 
        };
    
        fetchDeviceData();
      }, [deviceId, setDeviceState]);
}

export default useFetch;