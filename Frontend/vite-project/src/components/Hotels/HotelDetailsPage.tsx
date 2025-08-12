import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  MapPin,
  ChevronDown,
  Calendar,
  Users,
  CreditCard,
  Baby,
  PawPrint,
  Bed,
  Mail,
  Phone,
} from "lucide-react";
import HotelMap from "../Map/location";
import { getApprovedHotelById, addReviewToHotel } from "../../api/hotel";
import { createBooking } from "../../api/hotelBooking";
import { useNavigate } from "react-router-dom";

interface FAQ {
  question: string;
  answer: string;
}
interface RoomType {
  name: string;
  description?: string;
  pricePerNight?: number;
  totalRooms?: number;
  amenities?: string[];
  maxOccupancy?: number;
}

interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}
interface Review {
  _id: string;
  user: { name: string };
  rating: number;
  comment?: string;
  createdAt: string;
}
interface HotelDetail {
  _id: string;
  name: string;
  description: string;
  fullDescription?: string;
  images: string[];
  amenities: string[];
  roomTypes: RoomType[];
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    geoLocation?: GeoPoint;
    postalCode?: string;
  };
  contact: { phone?: string; email?: string };
  policies: {
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: string;
    childrenAndBeds?: string;
    ageRestriction?: string;
    petsAllowed?: boolean;
  };
  starRating?: number;
  reviews: Review[];
  faqs: FAQ[];
}


const HotelDetailsPage = () => {
  

  

  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Booking modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [bookingRoomType, setBookingRoomType] = useState<string>("");
  const [bookingStartDate, setBookingStartDate] = useState<string>("");
  const [bookingEndDate, setBookingEndDate] = useState<string>("");
  const [bookingNumRooms, setBookingNumRooms] = useState<number>(1);
  const [bookingContact, setBookingContact] = useState<string>("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  useEffect(() => {
    if (!id) return;
    getApprovedHotelById(id)
      .then((data) => setHotel(data))
      .catch((err) => setError(err.message || "Failed to load hotel"))
      .finally(() => setLoading(false));
  }, [id]);

  const loadHotel = () => {
    if (!id) return;
    getApprovedHotelById(id)
      .then((data) => setHotel(data))
      .catch((err) => setError(err.message || "Failed to load hotel"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHotel();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!id) return;
    setSubmitting(true);
    setReviewError(null);
    try {
      await addReviewToHotel(id, { rating: newRating, comment: newComment });
      // reload hotel reviews
      loadHotel();
      setNewRating(5);
      setNewComment("");
    } catch (err: any) {
      setReviewError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openBookingModal = (roomTypeName: string) => {
    setBookingRoomType(roomTypeName);
    setBookingStartDate("");
    setBookingEndDate("");
    setBookingNumRooms(1);
    setBookingContact(hotel?.contact.phone || "");
    setBookingError(null);
    setShowModal(true);
  };

  const handleBookingSubmit = async () => {
    if (!id) return;
    if (
      !bookingStartDate ||
      !bookingEndDate ||
      !bookingNumRooms ||
      !bookingContact
    ) {
      setBookingError("All fields are required");
      return;
    }
    setBookingLoading(true);
    setBookingError(null);
    try {
      await createBooking({
        hotelId: id,
        roomType: bookingRoomType,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        numRooms: bookingNumRooms,
        contactNumber: bookingContact,
      });
      setShowModal(false);
      // Optionally toast success
    } catch (err: any) {
      setBookingError(err.response?.data?.message || err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="my-8 text-center">Loading hotel...</div>;
  if (error || !hotel)
    return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  const {
    name,
    description,
    fullDescription,
    images,
    amenities,
    address,
    contact,
    policies,
    starRating,
    reviews,
    faqs,
    roomTypes,
  } = hotel;

  const gallery = images;
  const displayReviews = reviews;
  const displayFaqs = faqs;

  // Extract coords if available, default to [0,0]
  const coords = address.geoLocation?.coordinates || [0, 0];
  const [lng, lat] = coords;

  return (
    <div className="min-h-screen mt-18 z-10">
      <div className="border-b border-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="mx-2">{">"}</span>
            <span className="hover:text-blue-600 cursor-pointer truncate">{name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {name}
                </h1>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {description}
                </p>
              </div>

              <div className="px-4 sm:px-6 pb-6">
                <div className="flex flex-col lg:flex-row gap-3 mb-3">
                  <div className="relative group cursor-pointer overflow-hidden rounded-lg">
                    <img
                      src={gallery[selectedImage]}
                      alt={name}
                      className="w-full lg:w-[560px] h-[250px] sm:h-[300px] lg:h-[375px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>
                  <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                    {gallery.slice(1, 4).map((src, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg flex-shrink-0"
                        onClick={() => setSelectedImage(index + 1)}
                      >
                        <img
                          src={src}
                          alt={`${name} view ${index + 1}`}
                          className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-[180px] lg:h-[120px] object-cover transition-all duration-300 group-hover:scale-105 ${
                            selectedImage === index + 1
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                        />
                        <div className="absolute inset-0 group-hover:bg-opacity-10 transition-all duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden sm:flex gap-3 overflow-x-auto">
                  {gallery.map((src, i) => (
                    <div
                      key={i}
                      className="relative group cursor-pointer overflow-hidden rounded-lg flex-shrink-0"
                      onClick={() => setSelectedImage(i)}
                    >
                      <img
                        src={src}
                        alt={`${name} view ${i}`}
                        className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-[180px] lg:h-[120px] object-cover transition-all duration-300 group-hover:scale-105 ${
                          selectedImage === i ? "ring-2 ring-blue-500" : ""
                        }`}
                      />
                      <div className="absolute inset-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 flex flex-col order-first lg:order-last">
            <div className="relative rounded-xl overflow-hidden mb-6">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm shadow-sm border border-black/10"></div>
              <div className="relative z-10 p-4 sm:p-6 text-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Priority Highlights
                </h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {[
                        address.street,
                        address.city,
                        address.state,
                        address.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Facilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/40 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-blue-600/90 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-blue-700/90 font-semibold transition-all shadow-lg">
                  Reserve Now
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-60 sm:h-80 relative">
              <div className="h-full relative rounded-lg">
                {address.city && <HotelMap lat={lat} lng={lng} />}{" "}
                {/* replace with real coords */}
                <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 w-full h-6 bg-white pointer-events-none z-10" />
                <div className="absolute bottom-6 right-2 w-20 h-8 bg-white rounded pointer-events-none z-10" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">
              Most Popular Facilities & Reviews
            </h2>
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* dynamic amenities icons omitted for brevity */}
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg shadow-sm"
                    >
                      <span className="text-blue-600 font-semibold text-sm">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-80">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-4 sm:p-6 flex items-center justify-between">
                  <div className="text-white">
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
                      <span className="text-2xl sm:text-4xl font-bold">
                        {(
                          reviews.reduce((sum, r) => sum + r.rating, 0) /
                          (reviews.length || 1)
                        ).toFixed(1)}
                      </span>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
                          <Star
                            key={i}
                            className={`${
                              i <=
                              Math.round(
                                reviews.reduce((sum, r) => sum + r.rating, 0) /
                                  (reviews.length || 1)
                              )
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            } w-4 h-4 sm:w-5 sm:h-5`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-100">
                      {reviews.length} reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayReviews.map((review) => (
                <div
                  key={review._id}
                  className="border-2 border-blue-200 rounded-lg p-4 bg-white"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                      <span className="text-sm sm:text-lg leading-none text-gray-700 flex items-center justify-center h-full">
                        {review.user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 truncate">
                        {review.user.name}
                      </h4>
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                        <span className="font-semibold text-sm text-blue-600">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1 line-clamp-3">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">
              Detail Description About Us
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base">
              {(fullDescription || description)
                .split("\n\n")
                .map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
            </div>
          </div>
          {/* Contact Details Section */}
          <div className="bg-blue-50 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-800">
              Contact Details
            </h2>
            <div className="flex flex-col space-y-3 text-gray-700 text-sm sm:text-base">
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <a href={`tel:${contact.phone}`} className="hover:underline break-all">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:underline break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="break-words">
                  {[
                    address.street,
                    address.city,
                    address.state,
                    address.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">
              Travellers Ask Questions
            </h2>
            <div className="space-y-3">
              {displayFaqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transform transition-transform flex-shrink-0 ${
                        expandedFAQ === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-gray-600 text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">Hotel Rules</h2>
            <div className="space-y-6">
              {/* Repeat rules using policies object */}
              {policies.checkInTime && (
                <div className="flex items-start gap-4">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="font-medium text-sm sm:text-base">Check in</span>
                      <span className="text-gray-600 text-sm sm:text-base">
                        {policies.checkInTime}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {policies.checkOutTime && (
                <div className="flex items-start gap-4">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="font-medium text-sm sm:text-base">Check out</span>
                      <span className="text-gray-600 text-sm sm:text-base">
                        {policies.checkOutTime}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {/* Add other rules similarly */}
              {policies.cancellationPolicy && (
                <div className="flex items-start gap-4">
                  <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="font-medium text-sm sm:text-base">Cancellation Policy</span>
                      <span className="text-gray-600 text-sm sm:text-base">
                        {policies.cancellationPolicy}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {policies.childrenAndBeds && (
                <div className="flex items-start gap-4">
                  <Baby className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="font-medium text-sm sm:text-base">Children & Beds</span>
                      <span className="text-gray-600 text-sm sm:text-base">
                        {policies.childrenAndBeds}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {policies.ageRestriction && (
                <div className="flex items-start gap-4">
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="font-medium text-sm sm:text-base">Age Restriction</span>
                      <span className="text-gray-600 text-sm sm:text-base">
                        {policies.ageRestriction}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {policies.petsAllowed && (
                <div className="flex items-start gap-4">
                  <PawPrint className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="font-medium text-sm sm:text-base">Pets Allowed</span>
                      <span className="text-gray-600 text-sm sm:text-base">
                        {policies.petsAllowed ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Room Types Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">Room Types</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {roomTypes.map((rt, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {rt.name}
                    </h3>
                    <span className="text-base sm:text-lg font-bold text-blue-500">
                      {rt.pricePerNight != null
                        ? `$${rt.pricePerNight.toFixed(2)}/night`
                        : "N/A"}
                    </span>
                  </div>
                  {rt.description && (
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">
                      {rt.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 mb-2">
                    {rt.amenities?.map((amen, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-50 rounded-full"
                      >
                        {amen}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-700 text-xs sm:text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Max Occupancy: {rt.maxOccupancy || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>Total Rooms: {rt.totalRooms || 0}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openBookingModal(rt.name)}
                    className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 shadow-gray-500 w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
                <h3 className="text-base sm:text-lg font-semibold mb-4 pr-6">
                  Book {bookingRoomType}
                </h3>
                {bookingError && (
                  <p className="text-red-500 mb-2 text-sm">{bookingError}</p>
                )}
                <label className="block mb-3">
                  <span className="text-sm font-medium">Start Date</span>
                  <input
                    type="date"
                    value={bookingStartDate}
                    onChange={(e) => setBookingStartDate(e.target.value)}
                    className="w-full border rounded p-2 mt-1 text-sm"
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-sm font-medium">End Date</span>
                  <input
                    type="date"
                    value={bookingEndDate}
                    onChange={(e) => setBookingEndDate(e.target.value)}
                    className="w-full border rounded p-2 mt-1 text-sm"
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-sm font-medium">Number of Rooms</span>
                  <input
                    type="number"
                    min={1}
                    value={bookingNumRooms}
                    onChange={(e) => setBookingNumRooms(Number(e.target.value))}
                    className="w-full border rounded p-2 mt-1 text-sm"
                  />
                </label>
                <label className="block mb-4">
                  <span className="text-sm font-medium">Contact Number</span>
                  <input
                    type="tel"
                    value={bookingContact}
                    onChange={(e) => setBookingContact(e.target.value)}
                    className="w-full border rounded p-2 mt-1 text-sm"
                  />
                </label>
                <button
                  onClick={handleBookingSubmit}
                  disabled={bookingLoading}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded hover:bg-blue-700 text-sm sm:text-base"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}

          {/* Review submission form */}
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium mb-4">Add Your Review</h3>
            {reviewError && <p className="text-red-500 mb-2 text-sm">{reviewError}</p>}
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
              <label className="text-sm font-medium">Rating:</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={20}
                    onClick={() => setNewRating(i)}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`cursor-pointer transition-colors ${
                      i <= (hoverRating || newRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    } mr-1`}
                  />
                ))}
              </div>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              placeholder="Write your review..."
              className="w-full border rounded p-2 mb-4 text-sm sm:text-base"
            />
            <button
              onClick={handleReviewSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all text-sm sm:text-base"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;
