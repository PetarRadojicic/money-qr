import type { Currency } from "../store/preferences";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$", AED: "د.إ", AFN: "؋", ALL: "L", AMD: "֏", ANG: "ƒ", AOA: "Kz", ARS: "$", AUD: "A$", AWG: "ƒ",
  AZN: "₼", BAM: "KM", BBD: "$", BDT: "৳", BGN: "лв", BHD: ".د.ب", BIF: "FBu", BMD: "$", BND: "$", BOB: "Bs.",
  BRL: "R$", BSD: "$", BTN: "Nu.", BWP: "P", BYN: "Br", BZD: "$", CAD: "C$", CDF: "FC", CHF: "CHF", CLP: "$",
  CNY: "¥", COP: "$", CRC: "₡", CUP: "$", CVE: "$", CZK: "Kč", DJF: "Fdj", DKK: "kr", DOP: "$", DZD: "د.ج",
  EGP: "£", ERN: "Nfk", ETB: "Br", EUR: "€", FJD: "$", FKP: "£", FOK: "kr", GBP: "£", GEL: "₾", GGP: "£",
  GHS: "₵", GIP: "£", GMD: "D", GNF: "FG", GTQ: "Q", GYD: "$", HKD: "$", HNL: "L", HRK: "kn", HTG: "G",
  HUF: "Ft", IDR: "Rp", ILS: "₪", IMP: "£", INR: "₹", IQD: "ع.د", IRR: "﷼", ISK: "kr", JEP: "£", JMD: "$",
  JOD: "د.ا", JPY: "¥", KES: "Sh", KGS: "с", KHR: "៛", KID: "$", KMF: "CF", KRW: "₩", KWD: "د.ك", KYD: "$",
  KZT: "₸", LAK: "₭", LBP: "ل.ل", LKR: "Rs", LRD: "$", LSL: "L", LYD: "ل.د", MAD: "د.م.", MDL: "L", MGA: "Ar",
  MKD: "ден", MMK: "K", MNT: "₮", MOP: "P", MRU: "UM", MUR: "₨", MVR: "Rf", MWK: "MK", MXN: "$", MYR: "RM",
  MZN: "MT", NAD: "$", NGN: "₦", NIO: "C$", NOK: "kr", NPR: "₨", NZD: "$", OMR: "ر.ع.", PAB: "B/.", PEN: "S/",
  PGK: "K", PHP: "₱", PKR: "₨", PLN: "zł", PYG: "₲", QAR: "ر.ق", RON: "lei", RSD: "din", RUB: "₽", RWF: "FRw",
  SAR: "ر.س", SBD: "$", SCR: "₨", SDG: "ج.س.", SEK: "kr", SGD: "$", SHP: "£", SLE: "Le", SLL: "Le", SOS: "Sh",
  SRD: "$", SSP: "£", STN: "Db", SYP: "£", SZL: "L", THB: "฿", TJS: "ЅМ", TMT: "m", TND: "د.ت", TOP: "T$",
  TRY: "₺", TTD: "$", TVD: "$", TWD: "NT$", TZS: "Sh", UAH: "₴", UGX: "Sh", UYU: "$", UZS: "so'm", VES: "Bs.",
  VND: "₫", VUV: "VT", WST: "T", XAF: "FCFA", XCD: "$", XCG: "ƒ", XDR: "XDR", XOF: "CFA", XPF: "₣", YER: "﷼",
  ZAR: "R", ZMW: "ZK", ZWL: "$",
};

export const getCurrencySymbol = (currency: Currency): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};

