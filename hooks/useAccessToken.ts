import { useStateContext } from "../context/AppConext";
import { getProfileFn } from "@/api/authApi";

const useAccessToken = () => {
  const stateContext = useStateContext();
  const accessToken = async () => {
    try {
      const { data, message } = await getProfileFn();
      stateContext.dispatch({ type: "SET_USER", payload: data });

      return message;
    } catch (error) {}
  };

  return accessToken;
};

export default useAccessToken;
