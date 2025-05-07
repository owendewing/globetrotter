// constants/envConfig.js
import { Platform } from "react-native";

/**
 * Returns the local IP address configuration.
 * IMPORTANT: This needs to be updated with your actual local IP address
 * when running the application.
 */
export function getLocalIpAddress() {
  return {
    ip: "YOUR_IP_ADDRESS_HERE",
  };
}

const { ip } = getLocalIpAddress();
const isDev = __DEV__;

export const BASE_URL = isDev
  ? Platform.select({
      ios: `http://${ip}:5000`,
      android: `http://${ip}:5000`,
      default: `http://${ip}:5000`,
    })
  : "https://your-production-api-domain.com";
