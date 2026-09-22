"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

type NewsletterFormProps = {
  placeholder: string;
  terms: string;
  buttonText: string;
};

export default function NewsletterForm({
  placeholder,
  terms,
  buttonText,
}: NewsletterFormProps) {
  return (
    <div className="flex flex-col gap-8 mt-4 md:mt-0">
      <div className="relative">
        <Input
          type="email"
          placeholder={placeholder}
          autoComplete="email"
          className="w-full border-0 border-b border-gray-400 rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-black placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest"
        />
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="newsletter-terms"
          className="mt-1 rounded-none border-gray-400 data-[state=checked]:bg-black data-[state=checked]:text-white"
        />

        <label
          htmlFor="newsletter-terms"
          className="text-sm text-gray-500 leading-snug cursor-pointer">
          {terms}
        </label>
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto px-12 py-6 text-base uppercase tracking-widest border-gray-900 text-gray-900 hover:bg-[#b08e75] hover:text-white rounded-none transition-all">
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
