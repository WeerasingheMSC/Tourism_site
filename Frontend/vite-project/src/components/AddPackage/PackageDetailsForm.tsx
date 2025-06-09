import { useState } from "react";
import styles from "./PackageDetailsForm.module.css";

type Props = {
  onNext: () => void;
};

const categories = [
  "Young travelers",
  "surfers",
  "backpackers",
  "Pilgrims",
  "seniors",
  "spiritual seekers",
  "Firsttime visitors",
  "groups",
  "Families",
  "couples",
  "mixed-interest groups",
  "photographers",
  "Natural lovers",
  "beach lovers",
  "solo travelers",
  "local explorers",
  "Honeymooners",
  "special event",
  "anniversary couples",
  "students",
  "History lovers",
];

const PackageDetailsForm = ({ onNext }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    theme: "",
    description: "",
    price: "",
    icon: null as File | null,
    photos: [] as File[],
    categories: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement; // force TypeScript to get inputs
    const { name, value, type, files } = target;

    if (type === "file") {
      if (name === "icon") {
        setFormData({ ...formData, icon: files?.[0] || null });
      } else {
        setFormData({ ...formData, photos: Array.from(files || []) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "price") {
      const numeric = Math.max(0, parseFloat(value)); // ensures no negative value on copy paste
      setFormData({ ...formData, price: numeric.toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      {/* SECTION HEADER */}
      <div>
        <h2 className={styles.sectionTitle}>Package details</h2>
        <p className={styles.subtext}>Enter your package information</p>
      </div>

      {/* NAME + THEME */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Name of the package <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Theme <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Small description (up to 30 words){" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className={styles.input}
          maxLength={200}
          required
        />
      </div>

      {/* CATEGORIES */}
      <div>
        <label className={styles.label}>
          <span className="text-black">Ideal for</span>{" "}
          <span className="text-gray-500">(select up to 4)</span>{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className={styles.checkboxGrid}>
          {categories.map((cat) => (
            <label key={cat} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div className={styles.inlineField}>
        <label className={styles.inlineLabel}>
          Starting price (USD) <span className="text-red-500">*</span>:
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min={0}
          className={styles.priceInput}
          required
        />
      </div>

      {/* ICON UPLOAD */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Upload package icon <span className="text-red-500">*</span>
        </label>
        <div className={styles.uploadBox}>
          <button type="button" className={styles.uploadBtn}>
            Add File
          </button>
          <p className={styles.helper}>
            upload png image with 100 × 100 pixels
          </p>
          <input
            type="file"
            name="icon"
            accept="image/png"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>

      {/* PHOTOS UPLOAD */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Upload package related photos <span className="text-red-500">*</span>
        </label>
        <div className={styles.uploadBox}>
          <button type="button" className={styles.uploadBtn}>
            Add File
          </button>
          <p className={styles.helper}>
            Or drag and drop files ( up to 30 photos )
          </p>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>

      {/* NEXT BUTTON */}
      <div className={styles.nextButton}>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default PackageDetailsForm;
