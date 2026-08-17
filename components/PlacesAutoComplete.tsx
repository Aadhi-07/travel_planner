"use client";
import { Input } from "@/components/ui/input";
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useState,
} from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Loading } from "@/components/shared/Loading";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { formSchemaType } from "@/components/NewPlanForm";

type PlacesAutoCompleteProps = {
  selectedFromList?: boolean;
  setSelectedFromList?: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<formSchemaType, any, any>;
  field: ControllerRenderProps<formSchemaType, any>;
  fieldName?: "originPlace" | "placeName";
  placeholder?: string;
};

const PlacesAutoComplete = ({
  form,
  field,
  selectedFromList,
  setSelectedFromList,
  fieldName = "placeName",
  placeholder,
}: PlacesAutoCompleteProps) => {
  const [showResults, setShowResults] = useState(false);
  const isEnglish = (text: string) => /^[A-Za-z0-9\s,.-]+$/.test(text);

  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    options: {
      types: ["(regions)"],
      input: field.value || "",
    },
  });

  const handleSelectItem = (
    e: MouseEvent<HTMLLIElement>,
    description: string
  ) => {
    e.stopPropagation();
    form.clearErrors(fieldName);

    setShowResults(false);
    if (setSelectedFromList) setSelectedFromList(true);

    form.setValue(fieldName, description, { shouldValidate: true });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    field.onChange(val);

    if (!val) {
      setShowResults(false);
      return;
    }

    if (!isEnglish(val)) {
      form.setError(fieldName, {
        message: "Only English letters are supported.",
        type: "custom",
      });
      return;
    }

    form.clearErrors(fieldName);
    if (setSelectedFromList && selectedFromList) {
      setSelectedFromList(false);
    }

    getPlacePredictions({ input: val });
    setShowResults(true);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder={
            placeholder ||
            (fieldName === "originPlace"
              ? "Where are you travelling from? (e.g. Chennai)"
              : "Where do you want to go? (e.g. Ooty)")
          }
          onChange={handleSearch}
          onBlur={() => setShowResults(false)}
          value={field.value || ""}
          className="bg-background text-sm"
        />
        {isPlacePredictionsLoading && (
          <div className="absolute right-3 top-0 h-full flex items-center">
            <Loading className="w-5 h-5" />
          </div>
        )}
      </div>
      {showResults && (
        <div
          className="absolute w-full mt-1 shadow-lg rounded-xl p-1 bg-background border border-border max-h-60 overflow-auto z-50"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ul
            className="w-full flex flex-col gap-1"
            onMouseDown={(e) => e.preventDefault()}
          >
            {placePredictions?.map((item) => (
              <li
                className="cursor-pointer border-b border-border/40 flex justify-between items-center hover:bg-muted hover:rounded-lg px-3 py-2 text-xs"
                onClick={(e) => handleSelectItem(e, item.description)}
                key={item.place_id}
              >
                {item.description}
              </li>
            ))}
            {field.value && field.value.length >= 2 && (
              <li
                className="cursor-pointer flex justify-between items-center hover:bg-muted hover:rounded-lg px-3 py-2 text-xs text-[#c86d51] font-semibold"
                onClick={(e) => handleSelectItem(e, field.value)}
              >
                Use "{field.value}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlacesAutoComplete;
