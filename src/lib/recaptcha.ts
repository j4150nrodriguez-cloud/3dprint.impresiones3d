import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = async (action: string) => {
    if (!executeRecaptcha) {
      console.warn("reCAPTCHA not ready yet");
      return "";
    }
    return await executeRecaptcha(action);
  };

  return { getToken };
};
