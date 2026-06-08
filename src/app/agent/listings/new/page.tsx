"use client";
import CreateListingForm from "@/components/listings/CreateListingForm";

export default function AgentNewListing() {
  return (
    <CreateListingForm
      backHref="/agent"
      title="New Listing"
      subtitle="Add a property to your portfolio"
      successRedirectTo="/agent/my-listings"
    />
  );
}
