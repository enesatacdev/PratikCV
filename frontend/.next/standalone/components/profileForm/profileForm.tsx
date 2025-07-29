"use client";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";
import PersonalInfoForm from "./PersonalInfoForm";

export default function ProfileForm() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phones: [""],
    emails: [""],
    profilePhoto: "",
    address: "",
    birthDate: ""
  });

  useEffect(() => {
    if (!user?.id) return;
    setDataLoading(true);
    try {
      const fullName = user?.name || "";
      const [firstName = "", lastName = ""] = fullName.split(" ");
      
      setPersonalInfo({
        firstName,
        lastName,
        phones: user?.phones && user.phones.length > 0 ? user.phones : [""],
        emails: user?.emails && user.emails.length > 0 ? user.emails : [user?.email || ""].filter(Boolean),
        profilePhoto: user?.avatar || "",
        address: user?.address || "",
        birthDate: user?.birthDate ? user.birthDate.split('T')[0] : "" // ISO string'i YYYY-MM-DD formatına çevir
      });
    } finally {
      setDataLoading(false);
    }
  }, [user?.id, user?.name, user?.email, user?.avatar, user?.phones, user?.emails, user?.address, user?.birthDate]);

  if (!user) return null;

  const updatePersonalInfo = (data: any) => {
    setPersonalInfo((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    try {
      const phones = (personalInfo.phones || []).filter(p => p && p.trim() !== "");
      const emails = (personalInfo.emails || []).filter(e => e && e.trim() !== "");
      
      const result = await updateUserProfile({
        fullName: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
        phones,
        emails,
        address: personalInfo.address,
        profilePhoto: personalInfo.profilePhoto,
        birthDate: personalInfo.birthDate
      });
      
      if (result.success) {
        toast.success("✅ Profil bilgileriniz başarıyla kaydedildi!", { duration: 3000, icon: "🎉" });
      } else {
        toast.error(`❌ Profil kaydedilirken bir hata oluştu: ${result.error || ''}`, { duration: 5000 });
      }
    } catch (error) {
      toast.error("❌ Profil kaydedilirken bir hata oluştu.", { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-area">
      <div className="global-container">
        <div className="mx-auto">
          {dataLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Profil verileriniz yükleniyor...</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <div className="bg-white rounded-lg shadow-sm border">
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Kişisel Bilgiler</h3>
                    <div className="text-gray-600">
                     <PersonalInfoForm
                       formData={personalInfo}
                       updateFormData={updatePersonalInfo}
                       addArrayItem={(field, defaultValue) => {
                         if (field === 'phones') {
                           setPersonalInfo((prev) => ({
                             ...prev,
                             phones: [...prev.phones, defaultValue]
                           }));
                         } else if (field === 'emails') {
                           setPersonalInfo((prev) => ({
                             ...prev,
                             emails: [...prev.emails, defaultValue]
                           }));
                         }
                       }}
                       removeArrayItem={(field, index) => {
                         if (field === 'phones') {
                           setPersonalInfo((prev) => ({
                             ...prev,
                             phones: prev.phones.filter((_, i) => i !== index)
                           }));
                         } else if (field === 'emails') {
                           setPersonalInfo((prev) => ({
                             ...prev,
                             emails: prev.emails.filter((_, i) => i !== index)
                           }));
                         }
                       }}
                       updateArrayItem={(field, index, value) => {
                         if (field === 'phones') {
                           setPersonalInfo((prev) => ({
                             ...prev,
                             phones: prev.phones.map((item, i) => i === index ? value : item)
                           }));
                         } else if (field === 'emails') {
                           setPersonalInfo((prev) => ({
                             ...prev,
                             emails: prev.emails.map((item, i) => i === index ? value : item)
                           }));
                         }
                       }}
                     />
                    </div>
                    <div className="flex justify-end pt-6 border-t">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
