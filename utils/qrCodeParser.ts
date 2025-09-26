/**
 * QR Code Parser for Payment Systems
 * Supports multiple QR code formats for payments and receipts
 */

export interface ParsedQRData {
  format: 'ips' | 'emv' | 'sepa' | 'url' | 'generic' | 'unknown';
  amount?: number;
  currency?: string;
  merchant?: string;
  description?: string;
  reference?: string;
  iban?: string;
  bic?: string;
  date?: string;
  rawData: string;
  success: boolean;
  error?: string;
}

/**
 * Parse IPS (Instant Payment System) QR codes - Serbian format
 * Format: K:PR|V:01|C:1|R:200220618010100048|N:JKP INFOSTAN TEHNOLOGIJE|I:RSD2141,65|SF:122|S:OBJEDINJENA NAPLATA|RO:11801246487058-25089-1
 */
function parseIPSQRCode(data: string): ParsedQRData | null {
  try {
    const segments = data.split('|');
    const parsedData: any = {};
    
    // Parse each segment
    for (const segment of segments) {
      const [key, value] = segment.split(':');
      if (key && value) {
        parsedData[key] = value;
      }
    }
    
    // Extract relevant information
    let amount: number | undefined;
    let currency = 'RSD'; // Default for Serbian IPS
    
    // Parse amount from I field (e.g., "RSD2141,65")
    if (parsedData.I) {
      const amountMatch = parsedData.I.match(/([A-Z]{3})?([0-9.,]+)/);
      if (amountMatch) {
        if (amountMatch[1]) {
          currency = amountMatch[1];
        }
        const amountStr = amountMatch[2].replace(',', '.');
        amount = parseFloat(amountStr);
      }
    }
    
    return {
      format: 'ips',
      amount,
      currency,
      merchant: parsedData.N || undefined,
      description: parsedData.S || undefined,
      reference: parsedData.R || parsedData.RO || undefined,
      rawData: data,
      success: true
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parse EMV QR Code format (ISO/IEC 20022)
 * Used by many payment systems worldwide
 */
function parseEMVQRCode(data: string): ParsedQRData | null {
  try {
    // EMV QR codes have a specific structure with TLV (Tag-Length-Value)
    let index = 0;
    const parsedData: any = {};
    
    while (index < data.length) {
      if (index + 4 > data.length) break;
      
      const tag = data.substring(index, index + 2);
      const length = parseInt(data.substring(index + 2, index + 4), 10);
      
      if (isNaN(length) || index + 4 + length > data.length) break;
      
      const value = data.substring(index + 4, index + 4 + length);
      parsedData[tag] = value;
      
      index += 4 + length;
    }
    
    // Common EMV tags
    let amount: number | undefined;
    let currency: string | undefined;
    let merchant: string | undefined;
    
    // Tag 54: Transaction Amount
    if (parsedData['54']) {
      amount = parseFloat(parsedData['54']);
    }
    
    // Tag 53: Transaction Currency (ISO 4217 numeric code)
    if (parsedData['53']) {
      const currencyCode = parseInt(parsedData['53'], 10);
      currency = getCurrencyFromCode(currencyCode);
    }
    
    // Tag 59: Merchant Name
    if (parsedData['59']) {
      merchant = parsedData['59'];
    }
    
    return {
      format: 'emv',
      amount,
      currency,
      merchant,
      rawData: data,
      success: true
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parse SEPA QR codes (European payments)
 * Format: BCD\n002\n1\nSCT\n{BIC}\n{Name}\n{IBAN}\n{Currency}{Amount}\n{Purpose}\n{Reference}\n{Description}
 */
function parseSEPAQRCode(data: string): ParsedQRData | null {
  try {
    const lines = data.split('\n');
    
    // Check if it's a SEPA QR code
    if (lines[0] !== 'BCD' || lines.length < 6) {
      return null;
    }
    
    const bic = lines[4] || undefined;
    const merchant = lines[5] || undefined;
    const iban = lines[6] || undefined;
    
    let amount: number | undefined;
    let currency: string | undefined;
    
    // Parse amount (format: EUR12.34)
    if (lines[7]) {
      const amountMatch = lines[7].match(/([A-Z]{3})([0-9.]+)/);
      if (amountMatch) {
        currency = amountMatch[1];
        amount = parseFloat(amountMatch[2]);
      }
    }
    
    const reference = lines[9] || undefined;
    const description = lines[10] || undefined;
    
    return {
      format: 'sepa',
      amount,
      currency,
      merchant,
      description,
      reference,
      iban,
      bic,
      rawData: data,
      success: true
    };
  } catch (error) {
    return null;
  }
}

/**
 * Parse generic patterns for amounts/prices in various formats
 */
function parseGenericAmount(data: string): ParsedQRData | null {
  try {
    const patterns = [
      // Common amount patterns
      /(?:amount|suma|iznos|total|ukupno|price|cena|cjena)[\s:=]*([0-9.,]+)\s*([A-Z]{3})?/i,
      /([A-Z]{3})[\s]*([0-9.,]+)/i, // Currency code followed by amount
      /([0-9.,]+)[\s]*([A-Z]{3})/i, // Amount followed by currency code
      /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/g, // Generic number patterns
    ];
    
    for (const pattern of patterns) {
      const matches = data.match(pattern);
      if (matches) {
        let amount: number | undefined;
        let currency: string | undefined;
        
        if (matches.length >= 3) {
          // Pattern with currency
          const amountStr = (matches[1] || matches[2]).replace(',', '.');
          amount = parseFloat(amountStr);
          currency = matches[2] || matches[1];
          
          if (currency && currency.length !== 3) {
            currency = undefined;
          }
        } else if (matches[1]) {
          // Pattern without currency
          const amountStr = matches[1].replace(',', '.');
          amount = parseFloat(amountStr);
        }
        
        if (amount && amount > 0) {
          return {
            format: 'generic',
            amount,
            currency: currency || 'RSD', // Default to RSD for Serbian context
            rawData: data,
            success: true
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Convert ISO 4217 numeric currency code to string
 */
function getCurrencyFromCode(code: number): string {
  const currencyMap: { [key: number]: string } = {
    978: 'EUR',
    840: 'USD',
    941: 'RSD',
    826: 'GBP',
    756: 'CHF',
    203: 'CZK',
    348: 'HUF',
    985: 'PLN',
    191: 'HRK',
    946: 'RON',
    975: 'BGN',
  };
  
  return currencyMap[code] || 'EUR';
}

/**
 * Main QR code parser function
 * Attempts to parse QR data using various format parsers
 */
export function parseQRCode(data: string): ParsedQRData {
  if (!data || data.trim().length === 0) {
    return {
      format: 'unknown',
      rawData: data,
      success: false,
      error: 'Empty QR code data'
    };
  }
  
  const trimmedData = data.trim();
  
  // Try URL format first (existing functionality)
  if (trimmedData.startsWith('http://') || trimmedData.startsWith('https://')) {
    return {
      format: 'url',
      rawData: trimmedData,
      success: true
    };
  }
  
  // Try IPS format (Serbian payments)
  if (trimmedData.includes('K:PR|') || trimmedData.includes('|V:')) {
    const ipsResult = parseIPSQRCode(trimmedData);
    if (ipsResult) return ipsResult;
  }
  
  // Try SEPA format
  if (trimmedData.startsWith('BCD\n')) {
    const sepaResult = parseSEPAQRCode(trimmedData);
    if (sepaResult) return sepaResult;
  }
  
  // Try EMV format (check if it looks like TLV structure)
  if (/^[0-9]{2}[0-9]{2}/.test(trimmedData) && trimmedData.length > 10) {
    const emvResult = parseEMVQRCode(trimmedData);
    if (emvResult) return emvResult;
  }
  
  // Try generic amount patterns
  const genericResult = parseGenericAmount(trimmedData);
  if (genericResult) return genericResult;
  
  // If no specific format matches, return unknown
  return {
    format: 'unknown',
    rawData: trimmedData,
    success: false,
    error: 'Unsupported QR code format'
  };
}

/**
 * Enhanced parser for specific regional formats
 */
export function parseRegionalQRCode(data: string, region: 'serbia' | 'eu' | 'global' = 'global'): ParsedQRData {
  const result = parseQRCode(data);
  
  // Apply regional defaults if needed
  if (result.success && !result.currency) {
    switch (region) {
      case 'serbia':
        result.currency = 'RSD';
        break;
      case 'eu':
        result.currency = 'EUR';
        break;
      default:
        result.currency = 'USD';
        break;
    }
  }
  
  return result;
}

/**
 * Validate parsed QR data
 */
export function validateQRData(parsed: ParsedQRData): boolean {
  if (!parsed.success) return false;
  
  // For payment QR codes, we need at least an amount
  if (parsed.format !== 'url' && (!parsed.amount || parsed.amount <= 0)) {
    return false;
  }
  
  return true;
}

/**
 * Format amount for display based on currency
 */
export function formatQRAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if currency is not supported
    return `${amount.toFixed(2)} ${currency}`;
  }
}
