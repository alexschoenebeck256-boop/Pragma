import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({
  component: Admin,
});

type Step = "intro" | "details" | "documents" | "review";

function Admin() {
  const [currentStep, setCurrentStep] = useState<Step>("intro");

  if (currentStep === "intro") {
    return <Intro onStart={() => setCurrentStep("details")} />;
  }

  return (
    <div className="min-h-dvh pt-16">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {(["details", "documents", "review"] as Step[]).map(
              (step, i) => {
                const stepIndex = ["details", "documents", "review"].indexOf(
                  currentStep
                );
                const isActive = i <= stepIndex;
                return (
                  <div
                    key={step}
                    className="flex items-center gap-2"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        isActive
                          ? "bg-brand-600 text-white"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`hidden text-sm sm:block ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {step === "details"
                        ? "Asset Details"
                        : step === "documents"
                          ? "Documents"
                          : "Review"}
                    </span>
                  </div>
                );
              }
            )}
          </div>
          <div className="mt-4 h-1 w-full rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{
                width: `${
                  (["details", "documents", "review"].indexOf(currentStep) /
                    2) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Form Steps */}
        {currentStep === "details" && (
          <DetailsForm onNext={() => setCurrentStep("documents")} />
        )}
        {currentStep === "documents" && (
          <DocumentsForm
            onBack={() => setCurrentStep("details")}
            onNext={() => setCurrentStep("review")}
          />
        )}
        {currentStep === "review" && (
          <ReviewForm
            onBack={() => setCurrentStep("documents")}
            onSubmit={() => setCurrentStep("intro")}
          />
        )}
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-dvh pt-16">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-600/20">
          <svg
            className="h-12 w-12 text-brand-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Tokenize Your Asset
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-400">
          Turn your real-world assets into blockchain-based tokens. Unlock
          liquidity, enable fractional ownership, and reach a global audience
          of investors.
        </p>

        <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
          <div className="glass-card rounded-xl p-6">
            <div className="mb-2 text-2xl">1</div>
            <h3 className="font-semibold text-white">Submit Details</h3>
            <p className="mt-2 text-sm text-gray-400">
              Tell us about your asset — type, value, location, and
              documentation.
            </p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="mb-2 text-2xl">2</div>
            <h3 className="font-semibold text-white">Verification</h3>
            <p className="mt-2 text-sm text-gray-400">
              Our team performs valuation, legal review, and KYC/AML checks.
            </p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="mb-2 text-2xl">3</div>
            <h3 className="font-semibold text-white">Launch</h3>
            <p className="mt-2 text-sm text-gray-400">
              Your asset is tokenized, listed on our marketplace, and ready
              for investors.
            </p>
          </div>
        </div>

        <button type="button" onClick={onStart} className="btn-primary mt-12">
          Get Started
        </button>
      </div>
    </div>
  );
}

function DetailsForm({ onNext }: { onNext: () => void }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-white">Asset Details</h2>
      <p className="mt-2 text-gray-400">
        Provide the basic information about your asset.
      </p>

      <div className="mt-8 space-y-6">
        <FormField label="Asset Name" placeholder="e.g., Luxury Tower Manhattan" />
        <FormField label="Asset Category" type="select">
          <option value="">Select a category</option>
          <option value="real-estate">Real Estate</option>
          <option value="fine-art">Fine Art</option>
          <option value="collectibles">Collectibles</option>
          <option value="commodities">Commodities</option>
          <option value="private-equity">Private Equity</option>
          <option value="wine">Wine & Spirits</option>
        </FormField>
        <FormField label="Estimated Value (USD)" type="number" placeholder="1,000,000" />
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Location" placeholder="City, Country" />
          <FormField label="Year Acquired" type="number" placeholder="2024" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition-colors focus:border-brand-600"
            rows={4}
            placeholder="Describe your asset in detail..."
          />
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button type="button" onClick={onNext} className="btn-primary">
          Continue &mdash; Documents
        </button>
      </div>
    </>
  );
}

function DocumentsForm({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold text-white">Documents</h2>
      <p className="mt-2 text-gray-400">
        Upload supporting documentation for verification.
      </p>

      <div className="mt-8 space-y-6">
        <UploadField label="Proof of Ownership" accept=".pdf,.jpg,.png" />
        <UploadField label="Valuation Report" accept=".pdf" />
        <UploadField label="Insurance Certificate" accept=".pdf" />
        <UploadField label="Additional Documents (optional)" accept=".pdf,.jpg,.png,.doc" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button type="button" onClick={onBack} className="btn-ghost">
          Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary">
          Review Submission
        </button>
      </div>
    </>
  );
}

function ReviewForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold text-white">Review & Submit</h2>
      <p className="mt-2 text-gray-400">
        Please review your submission before finalizing.
      </p>

      <div className="glass-card mt-8 rounded-xl p-6">
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-500">Asset Name</span>
            <span className="text-white">Luxury Tower Manhattan</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-500">Category</span>
            <span className="text-white">Real Estate</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-500">Estimated Value</span>
            <span className="text-white">$85,000,000</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-500">Location</span>
            <span className="text-white">Manhattan, New York</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Documents</span>
            <span className="text-white">4 files uploaded</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-yellow-600/30 bg-yellow-600/10 p-4 text-sm text-yellow-400">
        Your submission will be reviewed by our team. You will be contacted
        within 3-5 business days with the results of the initial assessment.
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button type="button" onClick={onBack} className="btn-ghost">
          Back
        </button>
        <button type="button" onClick={onSubmit} className="btn-primary">
          Submit for Review
        </button>
      </div>
    </>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
  children,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      {children ? (
        <select className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition-colors focus:border-brand-600">
          {children}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none transition-colors focus:border-brand-600"
        />
      )}
    </div>
  );
}

function UploadField({
  label,
  accept,
}: {
  label: string;
  accept: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-900/50 px-6 py-8">
        <div className="text-center">
          <svg
            className="mx-auto h-8 w-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 16v-4m0 0l-2 2m2-2l2 2m-6 4h8a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-400">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-gray-600">Accepted: {accept}</p>
        </div>
      </div>
    </div>
  );
}