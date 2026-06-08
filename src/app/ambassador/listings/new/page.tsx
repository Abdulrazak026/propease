"use client";
import { useRole } from "@/context/RoleContext";
import CreateListingForm from "@/components/listings/CreateListingForm";

export default function PostListingPage() {
  const { currentUser } = useRole();
  return (
    <CreateListingForm
      backHref="/ambassador"
      title="Post New Listing"
      subtitle="Add a property to your city's listings"
      successRedirectTo="/ambassador/listings"
      defaultCity={currentUser?.city || undefined}
    />
  );
}
