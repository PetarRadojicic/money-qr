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
              Last updated October 17, 2025
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
                <Text className="font-semibold">What personal information do we process?</Text> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">Do we process any sensitive personal information?</Text> We do not process sensitive personal information.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">Do we collect any information from third parties?</Text> We do not collect any information from third parties.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">How do we process your information?</Text> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">In what situations and with which parties do we share personal information?</Text> We may share information in specific situations and with specific third parties.
              </Text>

              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <Text className="font-semibold">How do we keep your information safe?</Text> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
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
                We do not process sensitive information.
              </Text>

              <Text className={`text-sm font-semibold mt-4 mb-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Application Data.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Mobile Device Access. We may request access or permission to certain features from your mobile device, including your mobile device's camera, and other features. If you wish to change our access or permissions, you may do so in your device's settings.
                </Text>
              </View>
              <Text className={`text-sm leading-6 mt-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                2. HOW DO WE PROCESS YOUR INFORMATION?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • To save or protect an individual's vital interest. We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.
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
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We may share information in specific situations and with specific third parties.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We may need to share your personal information in the following situations:
              </Text>
              <View className="ml-4 mt-2">
                <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  • Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                5. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of the AI Products within our Services.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                6. HOW LONG DO WE KEEP YOUR INFORMATION?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
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
                We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                9. WHAT ARE YOUR PRIVACY RIGHTS?
              </Text>
              <Text className={`text-sm leading-6 italic mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In Short: Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making.
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                10. CONTROLS FOR DO-NOT-TRACK FEATURES
              </Text>
              <Text className={`text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
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
                  __________
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
                Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a data subject access request.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaViewWrapper>
  );
};

export default PrivacyPolicyScreen;
