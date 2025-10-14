// Receipt parser service
import { API_BASE_URL } from "@env";

type ParseReceiptResponse = {
  total: number;
  currency: string;
  date: string;
  vendor: string;
} | {
  error: "raw_data_required" | "raw_data_empty" | "scan_failed";
};

/**
 * Parse a receipt QR code by sending raw data to the API
 * @param rawData - The raw QR code data (URL or encoded string)
 * @returns Parsed receipt data or error
 */
export const parseReceipt = async (rawData: string): Promise<ParseReceiptResponse> => {
  try {
    // Use fallback URL if API_BASE_URL is not configured
    const baseUrl = API_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/parse-receipt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rawData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error parsing receipt:", error);
    return { error: "scan_failed" };
  }
};

