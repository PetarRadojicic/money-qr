import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import SafeAreaViewWrapper from "../components/SafeAreaViewWrapper";
import { Ionicons } from "@expo/vector-icons";

import { useTranslation } from "../hooks/useTranslation";
import { usePreferencesStore } from "../store/preferences";

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

const PrivacyPolicyScreen = ({ onBack }: PrivacyPolicyScreenProps) => {
  const { t } = useTranslation();
  const theme = usePreferencesStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <SafeAreaViewWrapper
      edges={["top", "left", "right"]}
      className="flex-1 bg-slate-50 dark:bg-slate-950"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 border-b" style={{ borderBottomColor: isDark ? "#1e293b" : "#e2e8f0" }}>
        <TouchableOpacity
          onPress={onBack}
          className="flex-row items-center"
        >
          <Ionicons name="chevron-back" size={24} color={isDark ? "#ffffff" : "#1e293b"} />
          <Text className={`ml-2 text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
            {t("back")}
          </Text>
        </TouchableOpacity>
        <Text className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
          {t("privacyPolicy")}
        </Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Privacy Policy Content */}
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Logo */}
          <View className="items-center mb-6">
            <View className="w-44 h-9 bg-slate-200 dark:bg-slate-700 rounded items-center justify-center">
              <Text className="text-slate-600 dark:text-slate-300 font-bold text-lg">Money QR</Text>
            </View>
          </View>

          {/* Title */}
          <View className="items-center mb-4">
            <Text className={`text-2xl font-bold text-center ${isDark ? "text-white" : "text-slate-900"}`}>
              PRIVACY POLICY
            </Text>
              <Text className={`text-sm text-center mt-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Last updated October 28, 2025
            </Text>
          </View>

          {/* Content */}
          <View className="gap-4">
            <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              This Privacy Notice for Radojicic ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
            </Text>

            <View className="ml-4">
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                • Download and use our mobile application (Money QR), or any other application of ours that links to this Privacy Notice
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                • Use Money QR. Personal finance tracking app with QR receipt scanning capabilities
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                • Engage with us in other related ways, including any sales, marketing, or events
              </Text>
            </View>

            <Text className={`text-sm leading-6 font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at petar@radojicic.co.
            </Text>

            {/* Summary Section */}
            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                SUMMARY OF KEY POINTS
              </Text>
              <Text className={`text-sm leading-6 italic ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
              </Text>
            </View>

            <View className="gap-3">
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">What personal information do we process?</Text> We process financial transaction data (income, expenses, amounts, dates, categories) that you enter into the app. This data is stored locally on your device. When you scan receipt QR codes, we temporarily send the QR data to an AI processor to extract financial information.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">Do we process any sensitive personal information?</Text> Financial data is considered sensitive personal information. However, we only store it locally on your device and do not collect personally identifiable information like names or contact details.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">Do we collect any information from third parties?</Text> We do not collect information from third parties, except for the temporary processing of QR receipt data through OpenAI's AI service as described above.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">How do we process your information?</Text> We process your information locally on your device to provide financial tracking services, parse receipt QR codes using an AI processor, and customize your app experience. All processing occurs on your device except for temporary QR receipt parsing by the AI processor.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">In what situations and with which parties do we share personal information?</Text> We only share QR receipt data with an AI processor for temporary parsing. We do not sell or share your financial data with third parties, advertisers, or marketers.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">How do we keep your information safe?</Text> All your financial data is stored locally on your device using local device storage (AsyncStorage). Note: AsyncStorage is not encrypted by default on all platforms. We do not persist data on our servers.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">What are your rights?</Text> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">How do you exercise your rights?</Text> The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
              </Text>
            </View>

            {/* Table of Contents */}
            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                TABLE OF CONTENTS
              </Text>
              <View className="gap-2">
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>1. WHAT INFORMATION DO WE COLLECT?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>2. HOW DO WE PROCESS YOUR INFORMATION?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>5. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>6. HOW LONG DO WE KEEP YOUR INFORMATION?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>7. HOW DO WE KEEP YOUR INFORMATION SAFE?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>8. DO WE COLLECT INFORMATION FROM MINORS?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>9. WHAT ARE YOUR PRIVACY RIGHTS?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>10. CONTROLS FOR DO-NOT-TRACK FEATURES</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>13. DO WE MAKE UPDATES TO THIS NOTICE?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Text>
                <Text className={`text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</Text>
              </View>
            </View>

            {/* Detailed Sections */}
            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                1. WHAT INFORMATION DO WE COLLECT?
              </Text>
              
              <Text className={`text-base font-semibold mb-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Personal information you disclose to us
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We collect personal information that you provide to us.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
              </Text>

              <Text className={`text-sm font-semibold mt-4 mb-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Sensitive Information.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Financial transaction data (amounts, categories, dates) is considered sensitive personal information. However, we store this data locally on your device and do not collect personally identifiable information like names or contact details. All sensitive financial data is stored locally using device storage.
              </Text>

              <Text className={`text-sm font-semibold mt-4 mb-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Application Data.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Mobile Device Access. We may request access or permission to certain features from your mobile device, including your mobile device's camera for QR code scanning functionality. If you wish to change our access or permissions, you may do so in your device's settings.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Financial Data. When you use our app, we collect and store financial transactions including income, expenses, categories, amounts, and dates. This data is stored locally on your device using local device storage (AsyncStorage). Note: AsyncStorage is not encrypted by default on all platforms.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Receipt Parsing Data. When you scan receipt QR codes or submit a receipt URL, the payload (QR text or URL) is sent to our backend solely to extract receipt details (amount, currency, date, vendor). If you provide a URL, our backend will fetch the webpage content and may use a remote browser provider (Browserless) to render dynamic pages. We then send only the extracted page text to our AI processor (OpenAI) to parse receipt details. We do not persist receipt payloads or parsing results on our servers. Only the extracted financial information is stored locally on your device. OpenAI’s use of data is governed by their privacy policy at https://openai.com/privacy/. Browserless provides remote browsing; see https://www.browserless.io/privacy (or provider policy as applicable).
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • App Preferences. We store your app preferences including currency selection, language preference, and theme settings. This information is stored locally on your device.
                </Text>
              <Text className={`text-sm leading-6 mt-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Please avoid scanning or submitting receipts that contain highly sensitive personal data (e.g., full payment card numbers, government IDs, medical information). Our feature only requires typical receipt fields (total, currency, date, vendor).
              </Text>
              </View>
              <Text className={`text-sm leading-6 mt-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">Important:</Text> No personal identifying information is collected. We do not collect your name, email, phone number, or any other personally identifiable information. Your transactions and preferences stay on-device. When you scan receipt QR codes, the QR payload is sent to our backend solely to relay it to an AI processor for parsing. Both the QR payload and the parsing result are discarded by our backend after processing—we do not persist this data on our servers. Only the extracted financial information is stored locally on your device.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                2. HOW DO WE PROCESS YOUR INFORMATION?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We process your information to provide the Services, enable QR receipt scanning, and store your financial data locally on your device.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We process your personal information for the following reasons:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • To provide financial tracking services. We process your transaction data to track your income and expenses, calculate balances, and generate analytics.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • To parse receipt QR codes. When you scan receipt QR codes, we send the raw QR data to our backend service, which uses OpenAI's API to extract financial information. The parsed data is stored locally on your device.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • To customize your experience. We process your preferences (currency, language, theme) to provide a personalized app experience.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • All financial data processing occurs locally on your device. We do not upload your financial transactions to our servers. For the receipt parsing feature, we transmit: (a) QR text or (b) the URL you provide (and associated fetched page content) to our backend, which may use a remote browser provider to render dynamic pages and an AI processor to extract receipt details. We do not persist this data on our servers.
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                The EU General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. For our app, we rely on the following legal bases:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • On-device financial data processing: <Text className="font-semibold">Performance of a Contract</Text>. We process your financial transactions to provide the app's core features (tracking, analytics, balance calculations) as part of the service you expect from the app.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Camera access for QR scanning: <Text className="font-semibold">Consent</Text>. You grant camera access through your device's operating system permissions to enable QR code scanning.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Sending QR payload to AI processor: <Text className="font-semibold">Legitimate Interests</Text>. We send QR codes to an AI processor to enable automated receipt parsing, improving user experience and service delivery. This processing is necessary to fulfill the primary purpose of the QR scanning feature.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • App preferences (currency, language, theme): <Text className="font-semibold">Performance of a Contract</Text>. We process these preferences to provide the customized experience you expect from the app.
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We only share information in specific situations and with specific third parties for service delivery.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We may need to share your personal information in the following situations:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • QR Receipt Processing with AI Provider. When you scan receipt QR codes, we send the QR payload to our backend, which forwards it to OpenAI (an AI processing service) solely to extract receipt details. OpenAI acts as a third-party data processor. Their use of this data is governed by their published terms and privacy policy. For details, see: https://openai.com/privacy/
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • <Text className="font-semibold">No Sale of Data.</Text> We do not sell your personal information to third parties. Your financial data is stored locally on your device and is never sold or shared with advertisers or marketers.
                </Text>
              </View>
              <Text className={`text-sm font-semibold mt-4 mb-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Data Processors and Subprocessors
              </Text>
              <View className="ml-4 mt-1">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • OpenAI (receipt text parsing) — https://openai.com/privacy
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Browserless or equivalent remote browser provider (dynamic page rendering when a URL is provided) — provider privacy policy applies (e.g., https://www.browserless.io/privacy)
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Cloudflare (app infrastructure, Workers, KV, and network/security logs) — https://www.cloudflare.com/privacypolicy/
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • ExchangeRate-API (currency rates only; no user personal data) — https://www.exchangerate-api.com/privacy
                </Text>
              </View>
              <Text className={`text-sm leading-6 mt-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                International Data Transfers. Our service providers may process data in countries outside your country of residence (e.g., the United States or the EU). Where required, we rely on appropriate safeguards for such transfers and contractually require processors to protect your information.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                5. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: Our receipt parsing feature uses OpenAI's AI technology to extract data from QR codes.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Our receipt QR code scanning feature uses an AI processing service (OpenAI) to parse receipt QR codes and extract financial information (amount, date, vendor). This is a service feature designed to enhance your user experience by automatically extracting receipt details using AI technology. When you scan a receipt QR code, the raw data is sent to our backend, which forwards it to OpenAI for processing.
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Your QR receipt data is processed by OpenAI as a third-party AI service
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • OpenAI's use of your data, including how they store or process it, is governed by their privacy policy at https://openai.com/privacy/
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • You should review OpenAI's privacy policy to understand their data practices
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • The terms in this Privacy Notice and OpenAI's privacy policy govern your use of this feature
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                6. HOW LONG DO WE KEEP YOUR INFORMATION?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We keep your information locally on your device until you delete it.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                All of your financial data and app preferences are stored locally on your device. We will only keep your personal information for as long as:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • You continue to use the app and keep the data stored locally on your device
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • You choose to delete your data using the "Reset Data" option in settings
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • You uninstall the app (which removes all local data from your device)
                </Text>
              </View>
              <Text className={`text-sm leading-6 mt-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                When you scan receipt QR codes, the raw QR data is temporarily sent to our backend service, which forwards it to OpenAI's AI service for parsing. Both the QR payload and the parsing result are discarded by our backend after processing—we do not persist this data on our servers. Only the extracted financial information is stored locally on your device. OpenAI's data practices are governed by their privacy policy: https://openai.com/privacy/
              </Text>
              <Text className={`text-sm leading-6 mt-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                For transparency: our infrastructure provider may retain standard server logs (e.g., IP address, user agent) for a limited period per their policies. We cache currency exchange rates (non-personal data) in Cloudflare KV for up to 24 hours to improve performance.
              </Text>
              <Text className={`text-sm leading-6 mt-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                You have full control over your data and can delete all app data at any time using the reset functionality in the app settings.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                7. HOW DO WE KEEP YOUR INFORMATION SAFE?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We aim to protect your personal information through a system of organizational and technical security measures.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                8. DO WE COLLECT INFORMATION FROM MINORS?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We do not knowingly collect data from or market to children under 18 years of age.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. We do not maintain user accounts—all data is stored locally on the user's device. If you are a parent or guardian and believe your child has used the app and you would like the data deleted, please contact us at petar@radojicic.co with instructions on how to access the device and request assistance with data deletion.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                9. WHAT ARE YOUR PRIVACY RIGHTS?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: Depending on where you live, you have certain rights regarding your personal information. You can review, modify, or delete your data at any time.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making.
              </Text>
              <Text className={`text-sm leading-6 font-semibold mt-3 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                How to Exercise Your Rights:
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Since all your data is stored locally on your device, you have direct control over it:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Access/modify: Open the app to view and edit your transactions
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Delete all data: Use the "Reset Data" option in Settings
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Contact us: Email petar@radojicic.co for data-related requests (we respond within 30 days)
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                10. TRACKING AND ANALYTICS
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                This is a mobile app with data stored locally on your device. We do not use in-app analytics SDKs, tracking technologies, cookies, or advertising identifiers. Our infrastructure provider (Cloudflare) may collect standard network logs (e.g., IP address, user agent) for security and operations. We do not use these logs for profiling or advertising. For receipt parsing, we transmit QR text or URLs and extracted page text to service providers solely to perform the feature, as described in Section 1.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: You may have additional rights based on the country you reside in.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                13. DO WE MAKE UPDATES TO THIS NOTICE?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                If you have questions or comments about this notice, you may email us at petar@radojicic.co or contact us by post at:
              </Text>
              <View className="mt-3 ml-4">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Radojicic
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Belgrade, Belgrade
                </Text>
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Serbia
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Based on the applicable laws of your country or state of residence, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law.
              </Text>
              <Text className={`text-sm leading-6 font-semibold mt-3 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                How to Make a Data Subject Request:
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                1. Email your request to petar@radojicic.co
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                2. Specify what information you need (access, correction, deletion)
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                3. We will respond within 30 days in accordance with applicable data protection laws
              </Text>
              <Text className={`text-sm leading-6 mt-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Note: Since your data is stored locally on your device, you can delete all data immediately using the "Reset Data" option in Settings. You can also export your data by accessing it through the app's interface.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaViewWrapper>
  );
};

export default PrivacyPolicyScreen;
