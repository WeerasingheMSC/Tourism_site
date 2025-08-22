import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import StructuredData, { structuredDataTemplates } from "./SEO/StructuredData";

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  const location = useLocation();

  // Auto-generate breadcrumbs if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", path: "/" }];

    // Map path segments to readable labels
    const pathLabels: { [key: string]: string } = {
      packages: "Tour Packages",
      hotels: "Hotels",
      vehicles: "Vehicles",
      contact: "Contact Us",
      CustomPackageForm: "Custom Tour",
      destinations: "Destinations",
      sigiriya: "Sigiriya Lion Rock",
      kandy: "Kandy",
      ella: "Ella",
      dambulla: "Dambulla Cave Temple",
      galle: "Galle Fort",
      yala: "Yala National Park",
      "nuwara-eliya": "Nuwara Eliya",
      mirissa: "Mirissa Beach",
      anuradhapura: "Anuradhapura",
      polonnaruwa: "Polonnaruwa",
    };

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label =
        pathLabels[segment] ||
        segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      const isActive = index === pathSegments.length - 1;

      breadcrumbs.push({
        label,
        path: currentPath,
        isActive,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (location.pathname === "/") {
    return null;
  }

  // Don't show if only home breadcrumb
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <>
      {/* Structured data for breadcrumbs */}
      <StructuredData
        data={structuredDataTemplates.breadcrumbs(
          breadcrumbItems.map((item) => ({
            name: item.label,
            url: `https://travelbookingsrilanka.com${item.path}`,
          }))
        )}
        id="breadcrumbs-schema"
      />

      <nav
        className={`bg-gray-50 border-b border-gray-200 py-3 ${className}`}
        aria-label="Breadcrumb"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}

                {item.isActive ? (
                  <span className="text-gray-900 font-medium flex items-center">
                    {index === 0 && <Home className="w-4 h-4 mr-1" />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center hover:underline"
                  >
                    {index === 0 && <Home className="w-4 h-4 mr-1" />}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumbs;
