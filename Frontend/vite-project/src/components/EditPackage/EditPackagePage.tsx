import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPackageById, updatePackage } from "../../api/packages";
import { uploadFileAndGetURL } from "../../firebase";

import PackageDetailsTab from "../AddPackage/PackageDetailsTab";
import DailyAgendaTab from "../AddPackage/DailyAgendaTab";
import IncludeNotIncludeTab from "../AddPackage/IncludeNotIncludeTab";

type DailyPlan = {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: string[];
  locations: string[];
};
type PackageItem = { id: string; text: string };

const EditPackagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    name: "",
    theme: "",
    description: "",
    idealFor: [] as string[],
    startingPrice: "",
    packageIcon: null as File | null, // new icon file (optional)
    packagePhotos: [] as File[], // new photo files (optional)
  });

  // keep existing media as URLs (file inputs can’t be prefilled)
  const [existingIconUrl, setExistingIconUrl] = useState("");
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([]);

  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);
  const [includedItems, setIncludedItems] = useState<PackageItem[]>([]);
  const [notIncludedItems, setNotIncludedItems] = useState<PackageItem[]>([]);

  const [activeTab, setActiveTab] = useState("Package details");
  const tabs = useMemo(
    () => ["Package details", "Daily Agenda", "Include & Not include details"],
    []
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPackageById(id)
      .then((res) => {
        const p = res.data;
        setFormData((prev) => ({
          ...prev,
          name: p.name || "",
          theme: p.theme || "",
          description: p.description || "",
          idealFor: Array.isArray(p.idealFor) ? p.idealFor : [],
          startingPrice: p.startingPrice ?? "",
          packageIcon: null,
          packagePhotos: [],
        }));
        setExistingIconUrl(p.packageIcon || "");
        setExistingPhotoUrls(
          Array.isArray(p.packagePhotos) ? p.packagePhotos : []
        );
        setDailyPlans(
          Array.isArray(p.dailyPlans)
            ? p.dailyPlans.map((d: any, i: number) => ({
                id: d.id ?? `day-${i}`,
                day: d.day ?? i + 1,
                title: typeof d.title === "string" ? d.title : "",
                description:
                  typeof d.description === "string"
                    ? d.description
                    : Array.isArray(d.description)
                    ? d.description.map(String).join("\n")
                    : d.description == null
                    ? ""
                    : String(d.description),
                activities: Array.isArray(d.activities) ? d.activities : [],
                locations: Array.isArray(d.locations) ? d.locations : [],
              }))
            : []
        );

        setIncludedItems(
          Array.isArray(p.includedItems)
            ? p.includedItems.map((text: string, i: number) => ({
                id: `inc-${i}`,
                text,
              }))
            : []
        );
        setNotIncludedItems(
          Array.isArray(p.notIncludedItems)
            ? p.notIncludedItems.map((text: string, i: number) => ({
                id: `ninc-${i}`,
                text,
              }))
            : []
        );
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const removeExistingPhoto = (url: string) =>
    setExistingPhotoUrls((prev) => prev.filter((u) => u !== url));
  const clearExistingIcon = () => setExistingIconUrl("");

  const idealForOptions = [
    "Young travelers",
    "Surfers",
    "Backpackers",
    "Pilgrims",
    "Seniors",
    "Spiritual seekers",
    "First-time visitors",
    "Groups",
    "Families",
    "Couples",
    "Mixed-interest groups",
    "Photographers",
    "Natural lovers",
    "Beach lovers",
    "Solo travelers",
    "Local explorers",
    "Honeymooners",
    "Special event",
    "Anniversary couples",
    "Students",
    "History lovers",
  ];

  const goNext = () => {
    const i = tabs.indexOf(activeTab);
    if (i < tabs.length - 1) setActiveTab(tabs[i + 1]);
  };
  const goBack = () => {
    const i = tabs.indexOf(activeTab);
    if (i > 0) setActiveTab(tabs[i - 1]);
  };

  const handleSubmit = async () => {
    if (!id) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // keep existing icon unless a new file is chosen
      let iconUrl = existingIconUrl;
      if (formData.packageIcon) {
        iconUrl = await uploadFileAndGetURL(
          formData.packageIcon,
          "packageIcons"
        );
      }

      // keep existing photos + add newly uploaded
      const newPhotoUrls = await Promise.all(
        formData.packagePhotos.map((f) =>
          uploadFileAndGetURL(f, "packagePhotos")
        )
      );
      const allPhotoUrls = [...existingPhotoUrls, ...newPhotoUrls];

      const payload = {
        name: formData.name,
        theme: formData.theme,
        description: formData.description,
        idealFor: formData.idealFor,
        startingPrice: formData.startingPrice,
        packageIcon: iconUrl,
        packagePhotos: allPhotoUrls,
        dailyPlans,
        includedItems: includedItems.map((x) => x.text),
        notIncludedItems: notIncludedItems.map((x) => x.text),
      };

      await updatePackage(id, payload);
      setSuccess("Package updated successfully!");
    } catch (e: any) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="my-8 text-center">Loading package…</div>;
  if (error)
    return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Package</h1>

      <div className="rounded-lg shadow-lg bg-white/30 backdrop-blur isolate">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === tab
                  ? "text-blue-500 border-b-2 border-blue-500 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* current media preview above the first tab’s form */}
        {activeTab === "Package details" && (
          <div className="relative">
            {(existingIconUrl || existingPhotoUrls.length > 0) && (
              <div className="px-8 pt-6">
                <div className="rounded-xl border border-blue-200 p-4 bg-white/70 mb-4">
                  <p className="text-sm text-gray-600 mb-3">Current media</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    {existingIconUrl && (
                      <div className="flex flex-col items-center">
                        <img
                          src={existingIconUrl}
                          alt="icon"
                          className="w-16 h-16 rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearExistingIcon}
                          className="text-xs text-red-500 mt-1"
                        >
                          remove icon
                        </button>
                      </div>
                    )}
                    {existingPhotoUrls.map((u, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <img
                          src={u}
                          alt={`photo-${i}`}
                          className="w-20 h-14 rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(u)}
                          className="text-xs text-red-500 mt-1"
                        >
                          remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <PackageDetailsTab
              formData={formData}
              setFormData={setFormData}
              idealForOptions={idealForOptions}
            />
          </div>
        )}

        {activeTab === "Daily Agenda" && (
          <DailyAgendaTab
            dailyPlans={dailyPlans}
            setDailyPlans={setDailyPlans}
          />
        )}

        {activeTab === "Include & Not include details" && (
          <IncludeNotIncludeTab
            includedItems={includedItems}
            setIncludedItems={setIncludedItems}
            notIncludedItems={notIncludedItems}
            setNotIncludedItems={setNotIncludedItems}
          />
        )}
      </div>

      <div className="flex justify-end gap-4 px-1 py-4">
        <button
          type="button"
          onClick={goBack}
          className="border border-blue-500 text-blue-500 px-6 py-2 rounded-md font-medium hover:bg-blue-50"
          disabled={tabs.indexOf(activeTab) === 0 || saving}
        >
          Back
        </button>
        <button
          type="button"
          onClick={activeTab === tabs[tabs.length - 1] ? handleSubmit : goNext}
          className="px-6 py-2 rounded-md font-medium text-white bg-blue-500 hover:bg-blue-600"
          disabled={saving}
        >
          {saving
            ? "Saving…"
            : activeTab === tabs[tabs.length - 1]
            ? "Save"
            : "Next"}
        </button>
      </div>

      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && !loading && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default EditPackagePage;
